import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, Clock, User, ArrowLeft, Check, 
  Sparkles, Star, Phone, Mail, MapPin, Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { Service, Staff, BookingRequest } from '@shared/types';

type BookingStep = 'service' | 'staff' | 'datetime' | 'details' | 'confirmation';

const stepTitles = {
  service: 'Choose Your Service',
  staff: 'Select Your Stylist',
  datetime: 'Pick Date & Time',
  details: 'Your Information',
  confirmation: 'Booking Confirmed!'
};

const stepDescriptions = {
  service: 'Select from our premium range of beauty and wellness services',
  staff: 'Choose your preferred expert stylist for the perfect experience',
  datetime: 'Find the perfect time that works with your schedule',
  details: 'Tell us about yourself so we can personalize your visit',
  confirmation: 'Your luxurious experience awaits!'
};

export default function Booking() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState<BookingStep>('service');
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [availableSlots, setAvailableSlots] = useState<Array<{time: string, available: boolean, booked: boolean}>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  // Ref to track current fetch request
  const currentFetchRef = useRef<AbortController | null>(null);
  const [clientDetails, setClientDetails] = useState({
    name: '',
    email: '',
    phone: '',
    specialRequests: ''
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/services').then(res => res.json()),
      fetch('/api/staff').then(res => res.json())
    ]).then(([servicesRes, staffRes]) => {
      if (servicesRes.success) {
        setServices(servicesRes.data);

        // Check for pre-selected service or staff from URL params
        const urlParams = new URLSearchParams(window.location.search);
        const serviceId = urlParams.get('service');
        const staffId = urlParams.get('staff');

        if (serviceId) {
          const preSelectedService = servicesRes.data.find((s: Service) => s.id === parseInt(serviceId));
          if (preSelectedService) {
            setSelectedService(preSelectedService);
            setStep('staff'); // Skip to staff selection if service is pre-selected
          }
        }

        if (staffId && staffRes.success) {
          const preSelectedStaff = staffRes.data.find((s: Staff) => s.id === parseInt(staffId));
          if (preSelectedStaff) {
            setSelectedStaff(preSelectedStaff);
            // If staff is pre-selected but no service, go to service selection first
            if (!serviceId) {
              setStep('service');
            } else {
              setStep('datetime'); // Skip to date/time if both service and staff are selected
            }
          }
        }
      }
      if (staffRes.success) setStaff(staffRes.data);
    }).catch(console.error);
  }, []);

  // Auto-fill user details when logged in
  useEffect(() => {
    if (user) {
      setClientDetails(prev => ({
        ...prev,
        name: user.name || '',
        phone: user.mobile || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    if (selectedService && selectedStaff && selectedDate) {
      // Cancel any existing request
      if (currentFetchRef.current) {
        currentFetchRef.current.abort();
      }

      // Create new AbortController
      currentFetchRef.current = new AbortController();
      const controller = currentFetchRef.current;

      setIsLoading(true);
      setAvailableSlots([]);

      const apiUrl = `/api/available-slots?date=${selectedDate}&staff_id=${selectedStaff.id}&service_id=${selectedService.id}`;
      console.log('Fetching slots from:', apiUrl);

      fetch(apiUrl, {
        signal: controller.signal,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(response => {
        // Check if request was aborted
        if (controller.signal.aborted) {
          throw new Error('Request aborted');
        }

        console.log('Response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        return response.json();
      })
      .then(data => {
        // Check if request was aborted before processing
        if (controller.signal.aborted) {
          return;
        }

        console.log('Slots data:', data);
        if (data.success) {
          setAvailableSlots(data.data || []);
        } else {
          console.error('API error:', data.error);
          setAvailableSlots([]);
        }
      })
      .catch(error => {
        if (error.name === 'AbortError' || error.message === 'Request aborted') {
          console.log('Request was cancelled');
          return;
        }
        console.error('Fetch error:', error);
        setAvailableSlots([]);
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

      // Cleanup function
      return () => {
        if (currentFetchRef.current) {
          currentFetchRef.current.abort();
          currentFetchRef.current = null;
        }
      };
    } else {
      setAvailableSlots([]);
      setIsLoading(false);
    }
  }, [selectedService, selectedStaff, selectedDate]);

  const handleSubmitBooking = async () => {
    if (!selectedService || !selectedStaff || !selectedDate || !selectedTime) return;

    setIsLoading(true);
    try {
      const bookingData: BookingRequest = {
        client_name: clientDetails.name,
        client_email: clientDetails.email,
        client_phone: clientDetails.phone,
        service_id: selectedService.id,
        staff_id: selectedStaff.id,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        special_requests: clientDetails.specialRequests
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setStep('confirmation');
      } else {
        alert(result.error || 'Failed to create booking');
      }
    } catch (error) {
      console.error('Booking error:', error);
      alert('Failed to create booking');
    } finally {
      setIsLoading(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 60);
    return maxDate.toISOString().split('T')[0];
  };

  const getStepNumber = (stepName: BookingStep): number => {
    const steps = ['service', 'staff', 'datetime', 'details', 'confirmation'];
    return steps.indexOf(stepName) + 1;
  };

  const isStepCompleted = (stepName: BookingStep): boolean => {
    const currentStepNumber = getStepNumber(step);
    const checkStepNumber = getStepNumber(stepName);
    return currentStepNumber > checkStepNumber || step === 'confirmation';
  };

  const serviceIcons = {
    'Hair': '����‍♀️',
    'Skincare': '✨',
    'Spa': '🧘‍♀️'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Animated Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-rose-100"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <Link to="/" className="flex items-center text-gray-600 hover:text-rose-600 transition-colors duration-300">
                <ArrowLeft className="h-5 w-5 mr-3" />
                <span className="font-medium">Back to Home</span>
              </Link>
            </motion.div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  Book Your Experience
                </h1>
                <p className="text-sm text-gray-500">Step {getStepNumber(step)} of 5</p>
              </div>
            </div>
            
            <div className="w-24"></div> {/* Spacer for balance */}
          </div>
        </div>
      </motion.header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Enhanced Progress Steps */}
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center mb-8">
            {['service', 'staff', 'datetime', 'details', 'confirmation'].map((stepName, index) => (
              <div key={stepName} className="flex items-center">
                <motion.div 
                  className={`relative w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold transition-all duration-500 ${
                    step === stepName
                      ? 'bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-lg scale-110' 
                      : isStepCompleted(stepName as BookingStep)
                      ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  {isStepCompleted(stepName as BookingStep) && step !== stepName ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    index + 1
                  )}
                  
                  {step === stepName && (
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-400 to-pink-500"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      style={{ zIndex: -1 }}
                    />
                  )}
                </motion.div>
                
                {index < 4 && (
                  <div className={`w-16 h-1 mx-4 rounded-full transition-all duration-500 ${
                    isStepCompleted(stepName as BookingStep) || step === 'confirmation'
                      ? 'bg-gradient-to-r from-rose-500 to-pink-500' 
                      : 'bg-gray-300'
                  }`} />
                )}
              </div>
            ))}
          </div>
          
          <motion.div 
            className="text-center"
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {stepTitles[step]}
            </h2>
            <p className="text-gray-600 text-lg">
              {stepDescriptions[step]}
            </p>
          </motion.div>
        </motion.div>

        {/* Step Content with Animations */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            {step === 'service' && (
              <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-3xl">Choose Your Perfect Service</CardTitle>
                  <p className="text-gray-600 mt-2">Select from our premium range of beauty and wellness treatments</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {services.map((service, index) => {
                      // Service specific images for booking page
                      const serviceImages = {
                        'Hair Cut & Style': 'https://images.pexels.com/photos/8468129/pexels-photo-8468129.jpeg',
                        'Hair Coloring': 'https://images.pexels.com/photos/8468125/pexels-photo-8468125.jpeg',
                        'Facial Treatment': 'https://images.pexels.com/photos/6663371/pexels-photo-6663371.jpeg',
                        'Spa Package': 'https://images.pexels.com/photos/6187645/pexels-photo-6187645.jpeg'
                      };

                      const serviceImage = serviceImages[service.name as keyof typeof serviceImages] || 'https://images.pexels.com/photos/6663371/pexels-photo-6663371.jpeg';

                      return (
                        <motion.div
                          key={service.id}
                          initial={{ opacity: 0, y: 20, scale: 0.9 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          transition={{ delay: index * 0.1, duration: 0.5 }}
                          className={`relative overflow-hidden rounded-3xl cursor-pointer transition-all duration-500 ${
                            selectedService?.id === service.id
                              ? 'ring-4 ring-rose-500 shadow-2xl transform scale-105'
                              : 'hover:shadow-xl hover:scale-102'
                          }`}
                          onClick={() => setSelectedService(service)}
                          whileHover={{ y: -8 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {/* Service Image Background */}
                          <div className="relative h-64 overflow-hidden">
                            <img
                              src={serviceImage}
                              alt={service.name}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>

                            {/* Category Badge */}
                            <motion.div
                              className="absolute top-4 left-4"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.3 + index * 0.1 }}
                            >
                              <Badge className="bg-white/90 text-gray-800 border-0 px-3 py-1 backdrop-blur-sm font-medium">
                                {service.category}
                              </Badge>
                            </motion.div>

                            {/* Price Badge */}
                            <motion.div
                              className="absolute top-4 right-4"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.4 + index * 0.1 }}
                            >
                              <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-4 py-2 rounded-full font-bold text-xl shadow-lg">
                                ${service.price}
                              </div>
                            </motion.div>

                            {/* Service Icon */}
                            <motion.div
                              className="absolute bottom-4 left-4 w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                              whileHover={{ scale: 1.1, rotate: 10 }}
                              transition={{ duration: 0.3 }}
                            >
                              <span className="text-3xl">{serviceIcons[service.category as keyof typeof serviceIcons] || '✨'}</span>
                            </motion.div>

                            {/* Selection Indicator */}
                            {selectedService?.id === service.id && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                              >
                                <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center shadow-2xl">
                                  <Check className="h-10 w-10 text-rose-600" />
                                </div>
                              </motion.div>
                            )}
                          </div>

                          {/* Service Details */}
                          <div className="p-6 bg-white">
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.name}</h3>
                            <p className="text-gray-600 mb-4 leading-relaxed">{service.description}</p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center text-gray-500">
                                <Clock className="mr-2 h-5 w-5 text-rose-500" />
                                <span className="font-medium">{service.duration_minutes} minutes</span>
                              </div>

                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="h-4 w-4 text-yellow-400 fill-current"
                                  />
                                ))}
                                <span className="ml-1 text-sm text-gray-600 font-medium">5.0</span>
                              </div>
                            </div>
                          </div>

                          {/* Selection Border Animation */}
                          <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-pink-500 transform transition-transform duration-500 ${
                            selectedService?.id === service.id ? 'scale-x-100' : 'scale-x-0'
                          }`}></div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {selectedService && (
                    <motion.div
                      className="mt-12 flex justify-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Button
                        onClick={() => setStep('staff')}
                        className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-12 py-4 rounded-2xl text-lg font-semibold shadow-2xl hover:shadow-rose-500/25"
                        size="lg"
                      >
                        Continue to Staff Selection
                        <ArrowLeft className="ml-3 h-5 w-5 rotate-180" />
                      </Button>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            )}

            {step === 'staff' && (
              <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl">Select Your Expert Stylist</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {staff.map((member, index) => (
                      <motion.div 
                        key={member.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                          selectedStaff?.id === member.id
                            ? 'border-rose-500 bg-gradient-to-br from-rose-50 to-pink-50 shadow-lg transform scale-105'
                            : 'border-gray-200 hover:border-rose-300 hover:shadow-md'
                        }`}
                        onClick={() => setSelectedStaff(member)}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-start space-x-4">
                          <motion.div 
                            className="w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg"
                            whileHover={{ rotate: 5, scale: 1.1 }}
                          >
                            <span className="text-xl font-bold text-white">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </motion.div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                            <p className="text-rose-600 font-semibold text-sm mb-1">{member.role}</p>
                            <p className="text-gray-600 text-sm mb-3">{member.specialty}</p>
                            <div className="flex items-center mb-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(member.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                ))}
                              </div>
                              <span className="text-sm text-gray-600 ml-2 font-semibold">{member.rating}</span>
                            </div>
                            <p className="text-xs text-gray-500">{member.experience_years} years experience</p>
                          </div>
                        </div>
                        
                        {selectedStaff?.id === member.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="mt-4 flex items-center justify-center"
                          >
                            <div className="w-6 h-6 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center">
                              <Check className="h-4 w-4 text-white" />
                            </div>
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="mt-8 flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => setStep('service')}
                      className="px-6 py-3 rounded-xl"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    {selectedStaff && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <Button 
                          onClick={() => setStep('datetime')} 
                          className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-8 py-3 rounded-xl"
                        >
                          Choose Date & Time
                          <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 'datetime' && (
              <div className="max-w-6xl mx-auto">
                <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm overflow-hidden">
                  <CardHeader className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-center py-8">
                    <CardTitle className="text-4xl font-bold mb-2">Schedule Your Appointment</CardTitle>
                    <p className="text-blue-100 text-lg">Choose your perfect date and time</p>
                  </CardHeader>
                  <CardContent className="p-8">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                      {/* Calendar Date Selection */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="xl:col-span-1"
                      >
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-6 h-full">
                          <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                              <Calendar className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Select Date</h3>
                            <p className="text-gray-600">Choose your appointment date</p>
                          </div>

                          <div className="space-y-4">
                            <Input
                              type="date"
                              min={getTomorrowDate()}
                              max={getMaxDate()}
                              value={selectedDate}
                              onChange={(e) => {
                                setSelectedDate(e.target.value);
                                setSelectedTime('');
                              }}
                              className="text-center text-lg p-4 rounded-2xl border-2 border-blue-200 focus:border-blue-500 bg-white/80 font-semibold"
                            />

                            {selectedDate && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white/80 p-4 rounded-2xl border border-blue-200"
                              >
                                <div className="flex items-center justify-center space-x-2 text-blue-600 mb-2">
                                  <Calendar className="h-5 w-5" />
                                  <span className="font-semibold">Selected Date</span>
                                </div>
                                <p className="text-center font-bold text-gray-900">
                                  {new Date(selectedDate).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </p>
                                <p className="text-center text-sm text-gray-600 mt-1">
                                  with {selectedStaff?.name}
                                </p>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </motion.div>

                      {/* Time Slot Selection */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="xl:col-span-2"
                      >
                        <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl p-6 h-full">
                          <div className="text-center mb-6">
                            <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                              <Clock className="h-8 w-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Available Times</h3>
                            <p className="text-gray-600">Click on any available time slot</p>
                          </div>

                          {selectedDate ? (
                            isLoading ? (
                              <div className="text-center py-16">
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-6"
                                />
                                <p className="text-gray-600 text-xl font-semibold">Loading available times...</p>
                              </div>
                            ) : availableSlots.length > 0 ? (
                              <div className="space-y-6">
                                {/* Morning Slots */}
                                <div>
                                  <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                    <span className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
                                    Morning (9:00 AM - 12:00 PM)
                                  </h4>
                                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                    {availableSlots
                                      .filter(slot => {
                                        const hour = parseInt(slot.time.split(':')[0]);
                                        return hour >= 9 && hour < 12;
                                      })
                                      .map((slot, index) => (
                                        <motion.button
                                          key={slot.time}
                                          initial={{ opacity: 0, scale: 0.8 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{ delay: index * 0.05 }}
                                          disabled={slot.booked}
                                          className={`relative p-3 text-sm rounded-xl font-semibold transition-all duration-300 ${
                                            slot.booked
                                              ? 'bg-red-100 text-red-500 border-2 border-red-200 cursor-not-allowed opacity-60'
                                              : selectedTime === slot.time
                                              ? 'bg-gradient-to-br from-rose-500 to-pink-600 text-white border-2 border-rose-500 shadow-lg transform scale-105'
                                              : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-rose-300 hover:bg-rose-50 hover:scale-105 shadow-sm'
                                          }`}
                                          onClick={() => !slot.booked && setSelectedTime(slot.time)}
                                          whileHover={!slot.booked ? { y: -2 } : {}}
                                          whileTap={!slot.booked ? { scale: 0.95 } : {}}
                                        >
                                          {slot.time}
                                          {slot.booked && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-red-100/80 rounded-xl">
                                              <span className="text-xs font-bold text-red-600">BOOKED</span>
                                            </div>
                                          )}
                                          {selectedTime === slot.time && !slot.booked && (
                                            <motion.div
                                              initial={{ scale: 0 }}
                                              animate={{ scale: 1 }}
                                              className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                                            >
                                              <Check className="h-3 w-3 text-white" />
                                            </motion.div>
                                          )}
                                        </motion.button>
                                      ))}
                                  </div>
                                </div>

                                {/* Afternoon Slots */}
                                <div>
                                  <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                    <span className="w-3 h-3 bg-orange-400 rounded-full mr-2"></span>
                                    Afternoon (12:00 PM - 5:00 PM)
                                  </h4>
                                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                    {availableSlots
                                      .filter(slot => {
                                        const hour = parseInt(slot.time.split(':')[0]);
                                        return hour >= 12 && hour < 17;
                                      })
                                      .map((slot, index) => (
                                        <motion.button
                                          key={slot.time}
                                          initial={{ opacity: 0, scale: 0.8 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{ delay: index * 0.05 }}
                                          disabled={slot.booked}
                                          className={`relative p-3 text-sm rounded-xl font-semibold transition-all duration-300 ${
                                            slot.booked
                                              ? 'bg-red-100 text-red-500 border-2 border-red-200 cursor-not-allowed opacity-60'
                                              : selectedTime === slot.time
                                              ? 'bg-gradient-to-br from-rose-500 to-pink-600 text-white border-2 border-rose-500 shadow-lg transform scale-105'
                                              : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-rose-300 hover:bg-rose-50 hover:scale-105 shadow-sm'
                                          }`}
                                          onClick={() => !slot.booked && setSelectedTime(slot.time)}
                                          whileHover={!slot.booked ? { y: -2 } : {}}
                                          whileTap={!slot.booked ? { scale: 0.95 } : {}}
                                        >
                                          {slot.time}
                                          {slot.booked && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-red-100/80 rounded-xl">
                                              <span className="text-xs font-bold text-red-600">BOOKED</span>
                                            </div>
                                          )}
                                          {selectedTime === slot.time && !slot.booked && (
                                            <motion.div
                                              initial={{ scale: 0 }}
                                              animate={{ scale: 1 }}
                                              className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                                            >
                                              <Check className="h-3 w-3 text-white" />
                                            </motion.div>
                                          )}
                                        </motion.button>
                                      ))}
                                  </div>
                                </div>

                                {/* Evening Slots */}
                                <div>
                                  <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                    <span className="w-3 h-3 bg-purple-400 rounded-full mr-2"></span>
                                    Evening (5:00 PM - 6:00 PM)
                                  </h4>
                                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                    {availableSlots
                                      .filter(slot => {
                                        const hour = parseInt(slot.time.split(':')[0]);
                                        return hour >= 17;
                                      })
                                      .map((slot, index) => (
                                        <motion.button
                                          key={slot.time}
                                          initial={{ opacity: 0, scale: 0.8 }}
                                          animate={{ opacity: 1, scale: 1 }}
                                          transition={{ delay: index * 0.05 }}
                                          disabled={slot.booked}
                                          className={`relative p-3 text-sm rounded-xl font-semibold transition-all duration-300 ${
                                            slot.booked
                                              ? 'bg-red-100 text-red-500 border-2 border-red-200 cursor-not-allowed opacity-60'
                                              : selectedTime === slot.time
                                              ? 'bg-gradient-to-br from-rose-500 to-pink-600 text-white border-2 border-rose-500 shadow-lg transform scale-105'
                                              : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-rose-300 hover:bg-rose-50 hover:scale-105 shadow-sm'
                                          }`}
                                          onClick={() => !slot.booked && setSelectedTime(slot.time)}
                                          whileHover={!slot.booked ? { y: -2 } : {}}
                                          whileTap={!slot.booked ? { scale: 0.95 } : {}}
                                        >
                                          {slot.time}
                                          {slot.booked && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-red-100/80 rounded-xl">
                                              <span className="text-xs font-bold text-red-600">BOOKED</span>
                                            </div>
                                          )}
                                          {selectedTime === slot.time && !slot.booked && (
                                            <motion.div
                                              initial={{ scale: 0 }}
                                              animate={{ scale: 1 }}
                                              className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"
                                            >
                                              <Check className="h-3 w-3 text-white" />
                                            </motion.div>
                                          )}
                                        </motion.button>
                                      ))}
                                  </div>
                                </div>

                                {/* Legend */}
                                <div className="bg-white/80 p-4 rounded-2xl border border-gray-200">
                                  <h4 className="font-semibold text-gray-800 mb-3">Legend</h4>
                                  <div className="flex flex-wrap gap-4 text-sm">
                                    <div className="flex items-center space-x-2">
                                      <div className="w-4 h-4 bg-white border-2 border-gray-200 rounded"></div>
                                      <span className="text-gray-600">Available</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <div className="w-4 h-4 bg-gradient-to-br from-rose-500 to-pink-600 rounded"></div>
                                      <span className="text-gray-600">Selected</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <div className="w-4 h-4 bg-red-100 border-2 border-red-200 rounded"></div>
                                      <span className="text-gray-600">Already Booked</span>
                                    </div>
                                  </div>
                                </div>

                                {selectedTime && (
                                  <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200"
                                  >
                                    <div className="flex items-center justify-center space-x-3 mb-3">
                                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                        <Check className="h-5 w-5 text-white" />
                                      </div>
                                      <span className="text-xl font-bold text-green-800">Time Slot Selected!</span>
                                    </div>
                                    <div className="text-center">
                                      <p className="text-lg font-semibold text-gray-900">{selectedTime}</p>
                                      <p className="text-sm text-gray-600">Duration: {selectedService?.duration_minutes} minutes</p>
                                      <p className="text-sm text-gray-600">Service: {selectedService?.name}</p>
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            ) : (
                              <motion.div
                                className="text-center py-16"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                  <Clock className="h-12 w-12 text-gray-400" />
                                </div>
                                <h4 className="text-2xl font-bold text-gray-900 mb-2">All Slots Booked</h4>
                                <p className="text-gray-600 text-lg">Please select another date or try a different staff member.</p>
                              </motion.div>
                            )
                          ) : (
                            <motion.div
                              className="text-center py-16"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Calendar className="h-12 w-12 text-blue-500" />
                              </div>
                              <h4 className="text-2xl font-bold text-gray-900 mb-2">Select a Date First</h4>
                              <p className="text-gray-600 text-lg">Choose your preferred date to see available time slots.</p>
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    </div>

                    <div className="mt-8 flex justify-between items-center">
                      <Button
                        variant="outline"
                        onClick={() => setStep('staff')}
                        className="px-8 py-4 rounded-2xl text-lg"
                      >
                        <ArrowLeft className="mr-2 h-5 w-5" />
                        Back to Staff
                      </Button>

                      {selectedDate && selectedTime && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center space-x-4"
                        >
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Selected Time</p>
                            <p className="text-lg font-bold text-gray-900">{selectedTime} on {new Date(selectedDate).toLocaleDateString()}</p>
                          </div>
                          <Button
                            onClick={() => setStep('details')}
                            className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold shadow-2xl"
                          >
                            Continue to Details
                            <ArrowLeft className="ml-2 h-5 w-5 rotate-180" />
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {step === 'details' && (
              <Card className="border-0 shadow-2xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl">Tell Us About Yourself</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6 max-w-md mx-auto">
                    {[
                      { id: 'name', label: 'Full Name', type: 'text', placeholder: 'Enter your full name', icon: User },
                      { id: 'email', label: 'Email Address', type: 'email', placeholder: 'Enter your email', icon: Mail },
                      { id: 'phone', label: 'Phone Number', type: 'tel', placeholder: 'Enter your phone number', icon: Phone }
                    ].map((field, index) => (
                      <motion.div
                        key={field.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Label htmlFor={field.id} className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                          <field.icon className="h-5 w-5 mr-2 text-rose-500" />
                          {field.label}
                        </Label>
                        <Input
                          id={field.id}
                          type={field.type}
                          value={clientDetails[field.id as keyof typeof clientDetails]}
                          onChange={(e) => setClientDetails({...clientDetails, [field.id]: e.target.value})}
                          placeholder={field.placeholder}
                          className="text-lg p-4 rounded-xl border-2 border-gray-200 focus:border-rose-500"
                        />
                      </motion.div>
                    ))}
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Label htmlFor="requests" className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                        <Heart className="h-5 w-5 mr-2 text-rose-500" />
                        Special Requests (Optional)
                      </Label>
                      <Textarea
                        id="requests"
                        value={clientDetails.specialRequests}
                        onChange={(e) => setClientDetails({...clientDetails, specialRequests: e.target.value})}
                        placeholder="Any special requests or notes for your visit..."
                        className="text-lg p-4 rounded-xl border-2 border-gray-200 focus:border-rose-500 min-h-24"
                      />
                    </motion.div>
                  </div>

                  <div className="mt-8 flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => setStep('datetime')}
                      className="px-6 py-3 rounded-xl"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    {clientDetails.name && clientDetails.email && clientDetails.phone && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                      >
                        <Button 
                          onClick={handleSubmitBooking} 
                          disabled={isLoading}
                          className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-8 py-3 rounded-xl"
                        >
                          {isLoading ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                              />
                              Booking...
                            </>
                          ) : (
                            <>
                              Confirm Booking
                              <Check className="ml-2 h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {step === 'confirmation' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-sm max-w-2xl mx-auto">
                  <CardContent className="text-center py-12">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                      className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl"
                    >
                      <Check className="h-12 w-12 text-white" />
                    </motion.div>
                    
                    <motion.h2 
                      className="text-4xl font-bold text-gray-900 mb-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      Booking Confirmed! 🎉
                    </motion.h2>
                    
                    <motion.p 
                      className="text-xl text-gray-600 mb-8"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      Your luxurious experience is all set! We'll send you a confirmation email shortly.
                    </motion.p>
                    
                    <motion.div 
                      className="bg-gradient-to-br from-rose-50 to-pink-50 p-8 rounded-2xl mb-8 text-left border-2 border-rose-100"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                    >
                      <h3 className="font-bold text-gray-900 mb-6 text-center text-xl">Your Appointment Details</h3>
                      <div className="space-y-4">
                        {[
                          { label: 'Service', value: selectedService?.name, icon: Sparkles },
                          { label: 'Stylist', value: selectedStaff?.name, icon: User },
                          { label: 'Date', value: new Date(selectedDate).toLocaleDateString(), icon: Calendar },
                          { label: 'Time', value: selectedTime, icon: Clock },
                          { label: 'Duration', value: `${selectedService?.duration_minutes} minutes`, icon: Clock },
                          { label: 'Investment', value: `$${selectedService?.price}`, icon: Star }
                        ].map((item, index) => (
                          <motion.div 
                            key={item.label}
                            className="flex items-center justify-between p-3 bg-white/60 rounded-xl"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9 + index * 0.1 }}
                          >
                            <div className="flex items-center">
                              <item.icon className="h-5 w-5 text-rose-500 mr-3" />
                              <strong className="text-gray-700">{item.label}:</strong>
                            </div>
                            <span className="text-gray-900 font-semibold">{item.value}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    <motion.div 
                      className="flex flex-col sm:flex-row gap-4 justify-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2 }}
                    >
                      <Link to="/">
                        <Button variant="outline" className="w-full sm:w-auto px-6 py-3 rounded-xl">
                          Back to Home
                        </Button>
                      </Link>
                      <Button 
                        onClick={() => {
                          setStep('service');
                          setSelectedService(null);
                          setSelectedStaff(null);
                          setSelectedDate('');
                          setSelectedTime('');
                          setClientDetails({ name: '', email: '', phone: '', specialRequests: '' });
                        }}
                        className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white w-full sm:w-auto px-6 py-3 rounded-xl"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        Book Another Experience
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
