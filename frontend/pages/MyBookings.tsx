import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, User, ArrowLeft, Check,
  Star, Phone, Mail, MapPin, RefreshCw,
  Filter, Search, ChevronDown, Eye, Bell,
  CheckCircle, XCircle, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Booking } from '@shared/types';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5
    }
  }
};

export default function MyBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedBooking, setExpandedBooking] = useState<number | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBookings();
    }

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }

    // Check for status updates every 15 seconds
    const statusCheckInterval = setInterval(() => {
      checkForStatusUpdates();
    }, 15000);

    // Add click outside listener for notifications
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showNotifications && !target.closest('.notification-dropdown') && !target.closest('.notification-button')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      clearInterval(statusCheckInterval);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [user, showNotifications]);

  useEffect(() => {
    // Also check when bookings change
    if (bookings.length > 0) {
      checkForStatusUpdates();
    }
  }, [bookings]);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter]);

  const fetchBookings = async () => {
    if (!user || !user.mobile) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/user-bookings?user_phone=${encodeURIComponent(user.mobile)}`);
      const result = await response.json();
      if (result.success) {
        setBookings(result.data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkForStatusUpdates = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/admin/bookings-manage', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.success) {
        const currentBookings = [...bookings];
        const currentUser = user;
        const userBookings = result.data.filter((booking: any) =>
          (currentUser?.mobile && booking.client_phone === currentUser.mobile) ||
          (currentUser?.name && booking.client_name === currentUser.name)
        );

        // Check for status changes
        userBookings.forEach((newBooking: any) => {
          const oldBooking = currentBookings.find(b => b.id === newBooking.id);
          if (oldBooking && oldBooking.status !== newBooking.status) {
            addStatusNotification(newBooking, oldBooking.status, newBooking.status);
          }
        });

        setBookings(userBookings);
      }
    } catch (error) {
      console.error('Error checking status updates:', error);
    }
  };

  const addStatusNotification = (booking: any, oldStatus: string, newStatus: string) => {
    const notification = {
      id: Date.now() + Math.random(),
      type: 'status_update',
      booking: booking,
      oldStatus: oldStatus,
      newStatus: newStatus,
      title: getNotificationTitle(newStatus),
      message: `Your booking for ${booking.service_name} has been ${newStatus}`,
      timestamp: new Date().toISOString(),
      read: false
    };

    setNotifications(prev => [notification, ...prev].slice(0, 10));

    // Show browser notification if permission granted
    if (Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico'
      });
    }
  };

  const getNotificationTitle = (status: string) => {
    switch (status) {
      case 'confirmed': return '✅ Booking Confirmed!';
      case 'rejected': return '❌ Booking Rejected';
      case 'completed': return '��� Service Completed';
      case 'cancelled': return '⚠️ Booking Cancelled';
      default: return '📅 Booking Update';
    }
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const filterBookings = () => {
    let filtered = [...bookings];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.service_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.staff_name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => {
      const dateA = new Date(a.appointment_date + ' ' + a.appointment_time);
      const dateB = new Date(b.appointment_date + ' ' + b.appointment_time);
      return dateB.getTime() - dateA.getTime();
    });

    setFilteredBookings(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'no_show': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getUpcomingBookings = () => {
    const now = new Date();
    return filteredBookings.filter(booking => {
      const bookingDate = new Date(booking.appointment_date + ' ' + booking.appointment_time);
      return bookingDate > now && booking.status === 'confirmed';
    });
  };

  const getPastBookings = () => {
    const now = new Date();
    return filteredBookings.filter(booking => {
      const bookingDate = new Date(booking.appointment_date + ' ' + booking.appointment_time);
      return bookingDate <= now || booking.status !== 'confirmed';
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full mx-auto mb-6"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Your Bookings</h2>
          <p className="text-gray-600">Fetching your appointment history...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="bg-white/80 backdrop-blur-lg shadow-xl border-b border-gray-200/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <Link to="/" className="flex items-center text-gray-600 hover:text-rose-600 transition-colors duration-300">
                  <ArrowLeft className="h-5 w-5 mr-3" />
                  <span className="font-medium">Back to Home</span>
                </Link>
              </motion.div>
              
              <div className="h-8 w-px bg-gray-300 mx-4"></div>
              
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  My Bookings
                </h1>
                <p className="text-sm text-gray-500">View and manage your appointments</p>
              </div>
            </div>
            
            <motion.div
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              {/* Notification Bell */}
              <div className="relative">
                <Button
                  onClick={() => setShowNotifications(!showNotifications)}
                  variant="outline"
                  size="sm"
                  className="relative notification-button"
                >
                  <Bell className="h-4 w-4" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {notifications.filter(n => !n.read).length}
                    </span>
                  )}
                </Button>

                {/* Notifications Dropdown */}
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute right-0 top-12 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto notification-dropdown"
                  >
                    <div className="p-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900">Booking Updates</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">
                            {notifications.filter(n => !n.read).length} new
                          </span>
                          {notifications.length > 0 && (
                            <Button
                              onClick={clearAllNotifications}
                              variant="ghost"
                              size="sm"
                              className="text-xs"
                            >
                              Clear All
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                              !notification.read ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => markNotificationAsRead(notification.id)}
                          >
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 rounded-full flex items-center justify-center">
                                {notification.newStatus === 'confirmed' && (
                                  <CheckCircle className="h-5 w-5 text-green-600" />
                                )}
                                {notification.newStatus === 'rejected' && (
                                  <XCircle className="h-5 w-5 text-red-600" />
                                )}
                                {notification.newStatus === 'completed' && (
                                  <Check className="h-5 w-5 text-blue-600" />
                                )}
                                {notification.newStatus === 'cancelled' && (
                                  <AlertCircle className="h-5 w-5 text-orange-600" />
                                )}
                                {!['confirmed', 'rejected', 'completed', 'cancelled'].includes(notification.newStatus) && (
                                  <Bell className="h-5 w-5 text-gray-600" />
                                )}
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
                                <p className="text-gray-600 text-sm">{notification.message}</p>
                                <div className="flex items-center justify-between mt-2">
                                  <p className="text-gray-400 text-xs">
                                    {new Date(notification.timestamp).toLocaleString()}
                                  </p>
                                  {!notification.read && (
                                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500">
                          No notifications yet
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>

              <Button
                onClick={fetchBookings}
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </Button>

              <Link to="/booking">
                <Button className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book New Appointment
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <motion.div 
          className="mb-8 flex flex-col sm:flex-row gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="relative flex-1">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 rounded-xl border-gray-200 focus:border-rose-500"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48 rounded-xl border-gray-200">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
              <SelectItem value="no_show">No Show</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-xl bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600 mb-1">Upcoming</p>
                    <p className="text-3xl font-bold text-blue-900">{getUpcomingBookings().length}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-xl bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600 mb-1">Completed</p>
                    <p className="text-3xl font-bold text-green-900">
                      {filteredBookings.filter(b => b.status === 'completed').length}
                    </p>
                  </div>
                  <Check className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="border-0 shadow-xl bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-purple-600 mb-1">Total Bookings</p>
                    <p className="text-3xl font-bold text-purple-900">{filteredBookings.length}</p>
                  </div>
                  <Star className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Upcoming Bookings */}
        {getUpcomingBookings().length > 0 && (
          <motion.section 
            className="mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Upcoming Appointments</h2>
            <div className="space-y-4">
              {getUpcomingBookings().map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                            <Calendar className="h-8 w-8 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{booking.service_name}</h3>
                            <p className="text-gray-600">with {booking.staff_name}</p>
                            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {new Date(booking.appointment_date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-1" />
                                {booking.appointment_time}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={`${getStatusColor(booking.status)} mb-2`}>
                            {booking.status}
                          </Badge>
                          <p className="text-2xl font-bold text-gray-900">${booking.total_price}</p>
                          <p className="text-sm text-gray-500">{booking.duration_minutes} minutes</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* Past Bookings */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Booking History {getPastBookings().length > 0 && `(${getPastBookings().length})`}
          </h2>
          
          {getPastBookings().length > 0 ? (
            <div className="space-y-4">
              {getPastBookings().map((booking, index) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group"
                >
                  <Card className="border-0 shadow-lg bg-white hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-6">
                      <div 
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => setExpandedBooking(expandedBooking === booking.id ? null : booking.id)}
                      >
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                            booking.status === 'completed' 
                              ? 'bg-green-100' 
                              : booking.status === 'cancelled' 
                              ? 'bg-red-100' 
                              : 'bg-gray-100'
                          }`}>
                            {booking.status === 'completed' ? (
                              <Check className="h-6 w-6 text-green-600" />
                            ) : (
                              <Calendar className="h-6 w-6 text-gray-600" />
                            )}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{booking.service_name}</h3>
                            <p className="text-gray-600">with {booking.staff_name}</p>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                              <span>{new Date(booking.appointment_date).toLocaleDateString()}</span>
                              <span>{booking.appointment_time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <Badge className={getStatusColor(booking.status)}>
                              {booking.status}
                            </Badge>
                            <p className="text-lg font-bold text-gray-900 mt-1">${booking.total_price}</p>
                          </div>
                          <ChevronDown 
                            className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${
                              expandedBooking === booking.id ? 'rotate-180' : ''
                            }`} 
                          />
                        </div>
                      </div>
                      
                      <AnimatePresence>
                        {expandedBooking === booking.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="mt-6 pt-6 border-t border-gray-200"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3">Booking Details</h4>
                                <div className="space-y-2 text-sm">
                                  <p><strong>Client:</strong> {booking.client_name}</p>
                                  <p><strong>Email:</strong> {booking.client_email}</p>
                                  <p><strong>Phone:</strong> {booking.client_phone}</p>
                                  <p><strong>Duration:</strong> {booking.duration_minutes} minutes</p>
                                  <p><strong>Booked:</strong> {new Date(booking.created_at).toLocaleDateString()}</p>
                                </div>
                              </div>
                              
                              {booking.notes && (
                                <div>
                                  <h4 className="font-semibold text-gray-900 mb-3">Notes</h4>
                                  <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                    {booking.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Calendar className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Bookings Found</h3>
              <p className="text-gray-600 mb-6">You haven't made any appointments yet.</p>
              <Link to="/booking">
                <Button className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Your First Appointment
                </Button>
              </Link>
            </motion.div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
