import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, Star, Phone, MapPin, Mail,
  Scissors, Sparkles, Heart, Award, Users2,
  ChevronLeft, ChevronRight, Play, Pause,
  Instagram, Facebook, Twitter, User, Users,
  Eye, Menu, X, LogOut, LogIn, Download, Smartphone
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Service, Staff } from '@shared/types';
import { useAuth } from '@/contexts/AuthContext';
import { usePWA } from '@/hooks/usePWA';

const heroImages = [
  'https://images.pexels.com/photos/6899542/pexels-photo-6899542.jpeg',
  'https://images.pexels.com/photos/7697390/pexels-photo-7697390.jpeg',
  'https://images.pexels.com/photos/6663371/pexels-photo-6663371.jpeg'
];

const galleryImages = [
  {
    url: 'https://images.pexels.com/photos/7755511/pexels-photo-7755511.jpeg',
    title: 'Hair Color Consultation',
    category: 'Hair Services'
  },
  {
    url: 'https://images.pexels.com/photos/6045539/pexels-photo-6045539.jpeg',
    title: 'Nail Art & Manicure',
    category: 'Nail Services'
  },
  {
    url: 'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg',
    title: 'Color Selection',
    category: 'Consultation'
  },
  {
    url: 'https://images.pexels.com/photos/33224928/pexels-photo-33224928.jpeg',
    title: 'Luxury Spa Environment',
    category: 'Spa Services'
  }
];

export default function Home() {
  const [services, setServices] = useState<Service[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [currentHeroImage, setCurrentHeroImage] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, isAuthenticated, logout } = useAuth();
  const { isInstalled, isInstallable, canInstall, installApp, isIOS } = usePWA();

  // Debug PWA state
  useEffect(() => {
    console.log('PWA State:', { isInstalled, isInstallable, canInstall, isIOS });
  }, [isInstalled, isInstallable, canInstall, isIOS]);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const handleInstallApp = async () => {
    try {
      const installed = await installApp();
      if (installed) {
        console.log('App installed successfully!');
      }
    } catch (error) {
      console.error('Failed to install app:', error);
    }
  };

  useEffect(() => {
    // Fetch services and staff
    Promise.all([
      fetch('/api/services').then(res => res.json()),
      fetch('/api/staff').then(res => res.json())
    ]).then(([servicesRes, staffRes]) => {
      if (servicesRes.success) setServices(servicesRes.data);
      if (staffRes.success) setStaff(staffRes.data);
    }).catch(console.error);
  }, []);

  useEffect(() => {
    // Auto-rotate hero images
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2
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

  const serviceIcons = {
    'Hair': Scissors,
    'Skincare': Sparkles,
    'Spa': Heart
  };

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Floating Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-white/20 shadow-lg"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <motion.div
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                  Luxe Salon
                </h1>
              </Link>
            </motion.div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {['Services', 'Team', 'Gallery', 'Contact'].map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="text-gray-700 hover:text-rose-600 transition-colors duration-300 font-medium relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
                </motion.a>
              ))}
              <Link to="/offers" className="text-gray-700 hover:text-rose-600 transition-colors duration-300 font-medium relative group">
                Offers
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              {isAuthenticated && user?.role !== 'admin' && (
                <Link to="/my-bookings" className="text-gray-700 hover:text-rose-600 transition-colors duration-300 font-medium relative group">
                  My Bookings
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              )}

              {isAuthenticated && user?.role !== 'admin' ? (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">Hi, {user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-rose-600 transition-colors duration-300 font-medium flex items-center space-x-1"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : !isAuthenticated ? (
                <Link to="/login" className="text-gray-700 hover:text-rose-600 transition-colors duration-300 font-medium relative group flex items-center space-x-1">
                  <LogIn className="h-4 w-4" />
                  <span>Login</span>
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ) : null}
            </nav>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-4">
              {user?.role === 'admin' ? (
                <Link to="/admin" className="hidden sm:block">
                  <Button size="sm" className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300">
                    <Users className="h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <Link to="/booking" className="hidden sm:block">
                  <Button size="sm" className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </Link>
              )}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-700 hover:text-rose-600 transition-colors duration-300"
              >
                {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.button>
            </div>
            
            {/* Desktop Action Buttons */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="hidden md:flex items-center space-x-3"
            >
              {/* Install App Button */}
              {(!isInstalled && canInstall) || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7 }}
                >
                  <Button
                    onClick={handleInstallApp}
                    variant="outline"
                    className="border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white px-4 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Install App
                  </Button>
                </motion.div>
              ) : null}

              {/* Main Action Button */}
              {user?.role === 'admin' ? (
                <Link to="/admin">
                  <Button className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <Users className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/booking">
                  <Button className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Now
                  </Button>
                </Link>
              )}
            </motion.div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="md:hidden bg-white/95 backdrop-blur-lg border-b border-white/20 shadow-lg"
            >
              <div className="max-w-7xl mx-auto px-4 py-4">
                <nav className="flex flex-col space-y-4">
                  {['Services', 'Team', 'Gallery', 'Contact'].map((item, index) => (
                    <motion.a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-gray-700 hover:text-rose-600 transition-colors duration-300 font-medium py-2 border-b border-gray-100 hover:border-rose-300"
                    >
                      {item}
                    </motion.a>
                  ))}
                  <Link
                    to="/offers"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-700 hover:text-rose-600 transition-colors duration-300 font-medium py-2 border-b border-gray-100 hover:border-rose-300"
                  >
                    Offers
                  </Link>
                  {isAuthenticated && user?.role !== 'admin' && (
                    <Link
                      to="/my-bookings"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-gray-700 hover:text-rose-600 transition-colors duration-300 font-medium py-2 border-b border-gray-100 hover:border-rose-300"
                    >
                      My Bookings
                    </Link>
                  )}

                  {isAuthenticated && user?.role !== 'admin' ? (
                    <div className="pt-2 space-y-2">
                      <div className="text-sm text-gray-600 py-2">Hi, {user?.name}</div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left text-gray-700 hover:text-rose-600 transition-colors duration-300 font-medium py-2 border-b border-gray-100 hover:border-rose-300 flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  ) : !isAuthenticated ? (
                    <div className="pt-2 space-y-2">
                      <Link
                        to="/login"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-gray-700 hover:text-rose-600 transition-colors duration-300 font-medium py-2 border-b border-gray-100 hover:border-rose-300 flex items-center space-x-2"
                      >
                        <LogIn className="h-4 w-4" />
                        <span>Login</span>
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-gray-700 hover:text-rose-600 transition-colors duration-300 font-medium py-2 border-b border-gray-100 hover:border-rose-300 flex items-center space-x-2"
                      >
                        <User className="h-4 w-4" />
                        <span>Sign Up</span>
                      </Link>
                    </div>
                  ) : null}
                  <div className="pt-4 space-y-3">
                    {/* Install App Button for Mobile */}
                    {(!isInstalled && canInstall) || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? (
                      <Button
                        onClick={() => {
                          handleInstallApp();
                          setIsMobileMenuOpen(false);
                        }}
                        variant="outline"
                        className="w-full border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Install App
                      </Button>
                    ) : null}

                    {/* Main Action Button */}
                    {user?.role === 'admin' ? (
                      <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                          <Users className="mr-2 h-4 w-4" />
                          Dashboard
                        </Button>
                      </Link>
                    ) : (
                      <Link to="/booking" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                          <Calendar className="mr-2 h-4 w-4" />
                          Book Now
                        </Button>
                      </Link>
                    )}
                  </div>
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section with Carousel */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHeroImage}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 1 }}
              className="absolute inset-0"
            >
              <img
                src={heroImages[currentHeroImage]}
                alt="Luxury Salon"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent"></div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Hero Carousel Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentHeroImage(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentHeroImage ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <motion.h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              Where Beauty
              <br />
              <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
                Meets Excellence
              </span>
            </motion.h2>
            
            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed px-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
            >
              Experience luxury and rejuvenation at Luxe Salon. Our expert team provides
              personalized beauty treatments in an elegant, relaxing environment.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1 }}
            >
              <Link to="/booking">
                <Button size="lg" className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-2xl text-base sm:text-lg font-semibold shadow-2xl hover:shadow-rose-500/25 transition-all duration-300 transform hover:scale-105">
                  <Calendar className="mr-2 sm:mr-3 h-5 sm:h-6 w-5 sm:w-6" />
                  Book Your Experience
                </Button>
              </Link>

              {/* Install App Button in Hero */}
              {(!isInstalled && canInstall) || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  <Button
                    onClick={handleInstallApp}
                    size="lg"
                    variant="outline"
                    className="border-2 border-purple-400 text-purple-100 hover:bg-purple-400 hover:text-white px-6 sm:px-10 py-3 sm:py-4 rounded-2xl text-base sm:text-lg font-semibold backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
                  >
                    <Download className="mr-2 sm:mr-3 h-5 sm:h-6 w-5 sm:w-6" />
                    <span className="hidden sm:inline">Install App</span>
                    <span className="sm:hidden">Install</span>
                  </Button>
                </motion.div>
              ) : null}

              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-6 sm:px-10 py-3 sm:py-4 rounded-2xl text-base sm:text-lg font-semibold backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
              >
                <Phone className="mr-2 sm:mr-3 h-5 sm:h-6 w-5 sm:w-6" />
                <span className="hidden sm:inline">(555) 123-4567</span>
                <span className="sm:hidden">Call</span>
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Floating Elements */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-32 right-20 w-20 h-20 bg-gradient-to-br from-rose-400/20 to-pink-400/20 rounded-full backdrop-blur-sm hidden lg:block"
        />
        
        <motion.div
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -8, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-32 left-16 w-16 h-16 bg-gradient-to-br from-pink-400/20 to-rose-400/20 rounded-full backdrop-blur-sm hidden lg:block"
        />
      </section>

      {/* Offers Popup Notification - Mobile Optimized */}
      <motion.div
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 2, duration: 0.8, ease: "easeOut" }}
        className="fixed top-20 sm:top-24 left-4 right-4 sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 z-40 sm:max-w-md"
      >
        <motion.div
          animate={{
            scale: [1, 1.01, 1],
            boxShadow: [
              "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              "0 20px 40px -12px rgba(0, 0, 0, 0.25)",
              "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
            ]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 p-0.5 sm:p-1 rounded-xl sm:rounded-2xl shadow-xl"
        >
          <div className="bg-white rounded-xl sm:rounded-2xl backdrop-blur-sm">
            <Link to="/offers" className="block group p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 sm:space-x-3 flex-1">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0"
                  >
                    <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <motion.p
                      className="font-bold text-gray-900 text-xs sm:text-sm group-hover:text-orange-600 transition-colors duration-300 truncate"
                      animate={{ opacity: [1, 0.8, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      🔥 EXCLUSIVE OFFERS
                    </motion.p>
                    <p className="text-xs text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      <span className="hidden sm:inline">Up to 40% OFF • Click to explore deals</span>
                      <span className="sm:hidden">Up to 40% OFF</span>
                    </p>
                  </div>
                </div>
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="text-orange-500 group-hover:text-orange-600 ml-2"
                >
                  <Eye className="h-4 w-4" />
                </motion.div>
              </div>
            </Link>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Install App Button */}
      {(!isInstalled && canInstall) || (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') ? (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 4, duration: 0.8, ease: "easeOut" }}
          className="fixed bottom-4 right-4 z-40"
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              boxShadow: [
                "0 10px 25px -5px rgba(139, 92, 246, 0.3)",
                "0 20px 40px -12px rgba(139, 92, 246, 0.4)",
                "0 10px 25px -5px rgba(139, 92, 246, 0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="bg-gradient-to-r from-purple-500 to-purple-600 p-1 rounded-2xl shadow-xl"
          >
            <Button
              onClick={handleInstallApp}
              className="bg-white text-purple-600 hover:bg-purple-50 px-4 py-3 rounded-xl font-semibold shadow-lg transition-all duration-300 flex items-center space-x-2"
            >
              <Download className="h-5 w-5" />
              <span className="hidden sm:inline">Install App</span>
              <span className="sm:hidden">Install</span>
            </Button>
          </motion.div>
        </motion.div>
      ) : null}

      {/* Stats Section */}
      <motion.section
        className="py-20 bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
            {[
              { icon: Users2, number: '1000+', label: 'Happy Clients' },
              { icon: Award, number: '8+', label: 'Years Experience' },
              { icon: Star, number: '4.9', label: 'Average Rating' },
              { icon: Sparkles, number: '50+', label: 'Services' }
            ].map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center group"
              >
                <motion.div 
                  className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <stat.icon className="h-8 w-8 text-white" />
                </motion.div>
                <motion.h3
                  className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  {stat.number}
                </motion.h3>
                <p className="text-sm sm:text-base text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>



      {/* Enhanced Services Section with Sliding Animation */}
      <motion.section
        id="services"
        className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500"></div>

        {/* Floating background elements */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-gradient-to-br from-rose-100/30 to-pink-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-40 h-40 bg-gradient-to-br from-purple-100/30 to-rose-100/30 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            variants={itemVariants}
          >
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Premium
              <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent"> Services</span>
            </h3>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              From precision cuts to luxurious spa treatments, we offer a complete range of beauty services
            </p>
          </motion.div>

          {/* Services Carousel */}
          <div className="relative">
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              variants={containerVariants}
            >
              {services.map((service, index) => {
                const IconComponent = serviceIcons[service.category as keyof typeof serviceIcons] || Sparkles;

                // Service specific images
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
                    variants={itemVariants}
                    initial={{ opacity: 0, x: 100 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: index * 0.2,
                      ease: "easeOut"
                    }}
                    whileHover={{ y: -15, scale: 1.03 }}
                    className="group"
                  >
                    <Card className="overflow-hidden border-0 shadow-2xl bg-white/80 backdrop-blur-sm hover:shadow-rose-500/20 transition-all duration-500 h-full">
                      {/* Service Image */}
                      <div className="relative h-64 overflow-hidden">
                        <motion.img
                          src={serviceImage}
                          alt={service.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          initial={{ scale: 1.1, opacity: 0 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          transition={{ duration: 0.8 }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                        {/* Service Category Badge */}
                        <motion.div
                          className="absolute top-4 left-4"
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                        >
                          <Badge className="bg-white/90 text-gray-800 border-0 px-3 py-1 backdrop-blur-sm">
                            {service.category}
                          </Badge>
                        </motion.div>

                        {/* Price Badge */}
                        <motion.div
                          className="absolute top-4 right-4"
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                        >
                          <div className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                            ${service.price}
                          </div>
                        </motion.div>

                        {/* Overlay Icon */}
                        <motion.div
                          className="absolute bottom-4 left-4 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          transition={{ duration: 0.3 }}
                        >
                          <IconComponent className="h-7 w-7 text-white" />
                        </motion.div>
                      </div>

                      {/* Service Content */}
                      <CardContent className="p-4 sm:p-6 lg:p-8">
                        <motion.h4
                          className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 group-hover:text-rose-600 transition-colors duration-300"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 + index * 0.1 }}
                        >
                          {service.name}
                        </motion.h4>

                        <motion.p
                          className="text-gray-600 mb-6 leading-relaxed text-sm sm:text-base lg:text-lg"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                        >
                          {service.description}
                        </motion.p>

                        <motion.div
                          className="flex items-center justify-between mb-6"
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 + index * 0.1 }}
                        >
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
                        </motion.div>

                        {/* Individual Book Button */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.5 + index * 0.1 }}
                        >
                          <Link to={`/booking?service=${service.id}`}>
                            <Button
                              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-2 sm:py-3 rounded-xl text-sm sm:text-base lg:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                              size="lg"
                            >
                              <Calendar className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                              <span className="hidden sm:inline">Book This Service</span>
                              <span className="sm:hidden">Book Now</span>
                            </Button>
                          </Link>
                        </motion.div>
                      </CardContent>

                      {/* Animated bottom border */}
                      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* View All Services Button */}
            <motion.div
              className="text-center mt-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Link to="/booking">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-rose-500 text-rose-600 hover:bg-rose-500 hover:text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  View All Services & Book
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Video Section */}
      <motion.section 
        className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            variants={itemVariants}
          >
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6">
              Experience the
              <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent"> Luxe Difference</span>
            </h3>
            <p className="text-lg sm:text-xl text-gray-300 max-w-3xl mx-auto px-4">
              Watch our expert stylists create magic with precision and artistry
            </p>
          </motion.div>
          
          <motion.div 
            className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <video
              className="w-full h-48 sm:h-64 md:h-80 lg:h-96 object-cover"
              src="https://videos.pexels.com/video-files/7697129/7697129-hd_1280_720_30fps.mp4"
              autoPlay
              muted
              loop
              playsInline
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <motion.button
              className="absolute inset-0 flex items-center justify-center group"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsVideoPlaying(!isVideoPlaying)}
            >
              <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                {isVideoPlaying ? (
                  <Pause className="h-8 w-8 text-white ml-1" />
                ) : (
                  <Play className="h-8 w-8 text-white ml-1" />
                )}
              </div>
            </motion.button>
          </motion.div>
        </div>
      </motion.section>

      {/* Enhanced Gallery Section with Categories */}
      <motion.section
        id="gallery"
        className="py-24 bg-gradient-to-br from-rose-50 to-pink-50 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            variants={itemVariants}
          >
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our Work
              <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent"> Gallery</span>
            </h3>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Discover the artistry and precision that defines our work across all beauty services
            </p>
          </motion.div>

          {/* Enhanced Gallery with More Categories */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
            variants={containerVariants}
          >
            {/* Hair Transformations */}
            <Link to="/gallery?category=hair">
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -15 }}
                transition={{ duration: 0.4 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-3xl shadow-2xl h-64 sm:h-72 lg:h-80">
                  <img
                    src="https://images.pexels.com/photos/8834095/pexels-photo-8834095.jpeg"
                    alt="Hair Transformation"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-rose-500 text-white border-0 px-3 py-1">Hair Services</Badge>
                    </div>
                    <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 text-white">
                      <h4 className="font-bold text-lg sm:text-xl mb-1 sm:mb-2">Hair Transformations</h4>
                      <p className="text-xs sm:text-sm text-gray-200">Professional cuts & styling</p>
                    </div>
                    <div className="absolute bottom-6 right-6">
                      <Scissors className="h-8 w-8 text-white opacity-60" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                        <Eye className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Hair Coloring */}
            <Link to="/gallery?category=hair">
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -15 }}
                transition={{ duration: 0.4 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-3xl shadow-2xl h-64 sm:h-72 lg:h-80">
                  <img
                    src="https://images.pexels.com/photos/8468125/pexels-photo-8468125.jpeg"
                    alt="Hair Coloring"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-purple-500 text-white border-0 px-3 py-1">Color Services</Badge>
                    </div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <h4 className="font-bold text-xl mb-2">Hair Coloring</h4>
                      <p className="text-sm text-gray-200">Expert color treatments</p>
                    </div>
                    <div className="absolute bottom-6 right-6">
                      <Sparkles className="h-8 w-8 text-white opacity-60" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                        <Eye className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Nail Art */}
            <Link to="/gallery?category=nails">
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -15 }}
                transition={{ duration: 0.4 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-3xl shadow-2xl h-64 sm:h-72 lg:h-80">
                  <img
                    src="https://images.pexels.com/photos/6045539/pexels-photo-6045539.jpeg"
                    alt="Nail Art"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-pink-500 text-white border-0 px-3 py-1">Nail Services</Badge>
                    </div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <h4 className="font-bold text-xl mb-2">Nail Artistry</h4>
                      <p className="text-sm text-gray-200">Creative nail designs</p>
                    </div>
                    <div className="absolute bottom-6 right-6">
                      <Star className="h-8 w-8 text-white opacity-60" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                        <Eye className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Spa Treatments */}
            <Link to="/gallery?category=spa">
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -15 }}
                transition={{ duration: 0.4 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-3xl shadow-2xl h-64 sm:h-72 lg:h-80">
                  <img
                    src="https://images.pexels.com/photos/6187645/pexels-photo-6187645.jpeg"
                    alt="Spa Treatments"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-emerald-500 text-white border-0 px-3 py-1">Spa Services</Badge>
                    </div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <h4 className="font-bold text-xl mb-2">Spa Treatments</h4>
                      <p className="text-sm text-gray-200">Relaxation & wellness</p>
                    </div>
                    <div className="absolute bottom-6 right-6">
                      <Heart className="h-8 w-8 text-white opacity-60" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                        <Eye className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Facial Treatments */}
            <Link to="/gallery?category=skincare">
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -15 }}
                transition={{ duration: 0.4 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-3xl shadow-2xl h-64 sm:h-72 lg:h-80">
                  <img
                    src="https://images.pexels.com/photos/6663371/pexels-photo-6663371.jpeg"
                    alt="Facial Treatments"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-blue-500 text-white border-0 px-3 py-1">Skincare</Badge>
                    </div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <h4 className="font-bold text-xl mb-2">Facial Treatments</h4>
                      <p className="text-sm text-gray-200">Skincare & rejuvenation</p>
                    </div>
                    <div className="absolute bottom-6 right-6">
                      <Sparkles className="h-8 w-8 text-white opacity-60" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                        <Eye className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Makeup Artistry */}
            <Link to="/gallery?category=makeup">
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -15 }}
                transition={{ duration: 0.4 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-3xl shadow-2xl h-64 sm:h-72 lg:h-80">
                  <img
                    src="https://images.pexels.com/photos/20717928/pexels-photo-20717928.jpeg"
                    alt="Makeup Artistry"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-orange-500 text-white border-0 px-3 py-1">Makeup</Badge>
                    </div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <h4 className="font-bold text-xl mb-2">Makeup Artistry</h4>
                      <p className="text-sm text-gray-200">Professional makeup</p>
                    </div>
                    <div className="absolute bottom-6 right-6">
                      <Star className="h-8 w-8 text-white opacity-60" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                        <Eye className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Color Consultation */}
            <Link to="/gallery?category=hair">
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -15 }}
                transition={{ duration: 0.4 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-3xl shadow-2xl h-64 sm:h-72 lg:h-80">
                  <img
                    src="https://images.pexels.com/photos/7755511/pexels-photo-7755511.jpeg"
                    alt="Color Consultation"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-indigo-500 text-white border-0 px-3 py-1">Consultation</Badge>
                    </div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <h4 className="font-bold text-xl mb-2">Color Consultation</h4>
                      <p className="text-sm text-gray-200">Expert color matching</p>
                    </div>
                    <div className="absolute bottom-6 right-6">
                      <Eye className="h-8 w-8 text-white opacity-60" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                        <Eye className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Luxury Experience */}
            <Link to="/gallery?category=all">
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -15 }}
                transition={{ duration: 0.4 }}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-3xl shadow-2xl h-64 sm:h-72 lg:h-80">
                  <img
                    src="https://images.pexels.com/photos/6899542/pexels-photo-6899542.jpeg"
                    alt="Luxury Experience"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-yellow-500 text-white border-0 px-3 py-1">Luxury</Badge>
                    </div>
                    <div className="absolute bottom-6 left-6 text-white">
                      <h4 className="font-bold text-xl mb-2">Luxury Experience</h4>
                      <p className="text-sm text-gray-200">Premium salon environment</p>
                    </div>
                    <div className="absolute bottom-6 right-6">
                      <Award className="h-8 w-8 text-white opacity-60" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                        <Eye className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>

          {/* View Portfolio Button */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Link to="/gallery">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-rose-500 text-rose-600 hover:bg-rose-500 hover:text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <Eye className="mr-2 h-5 w-5" />
                View Complete Portfolio
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Enhanced Team Section with Professional Photos and Booking */}
      <motion.section
        id="team"
        className="py-24 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        {/* Floating background elements */}
        <div className="absolute top-32 left-10 w-40 h-40 bg-gradient-to-br from-purple-100/30 to-pink-100/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 right-10 w-32 h-32 bg-gradient-to-br from-rose-100/30 to-orange-100/30 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-20"
            variants={itemVariants}
          >
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Meet Our Expert
              <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent"> Team</span>
            </h3>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
              Our talented professionals are passionate about helping you look and feel your best
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {staff.map((member, index) => {
              // Professional photos for each team member
              const memberPhotos = {
                'Sarah Johnson': 'https://images.pexels.com/photos/7440131/pexels-photo-7440131.jpeg',
                'Maria Garcia': 'https://images.pexels.com/photos/5128220/pexels-photo-5128220.jpeg',
                'Emma Wilson': 'https://images.pexels.com/photos/5240817/pexels-photo-5240817.jpeg',
                'Lisa Chen': 'https://images.pexels.com/photos/3998427/pexels-photo-3998427.jpeg'
              };

              const memberPhoto = memberPhotos[member.name as keyof typeof memberPhotos] || 'https://images.pexels.com/photos/7440131/pexels-photo-7440131.jpeg';

              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.2,
                    ease: "easeOut"
                  }}
                  whileHover={{ y: -20, scale: 1.05 }}
                  className="group"
                >
                  <Card className="overflow-hidden border-0 shadow-2xl bg-white hover:shadow-purple-500/20 transition-all duration-500 h-full">
                    {/* Professional Photo */}
                    <div className="relative h-80 overflow-hidden">
                      <motion.img
                        src={memberPhoto}
                        alt={member.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        initial={{ scale: 1.1, opacity: 0 }}
                        whileInView={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                      {/* Experience Badge */}
                      <motion.div
                        className="absolute top-4 left-4"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        <Badge className="bg-white/90 text-gray-800 border-0 px-3 py-1 backdrop-blur-sm font-medium">
                          {member.experience_years} Years
                        </Badge>
                      </motion.div>

                      {/* Rating Badge */}
                      <motion.div
                        className="absolute top-4 right-4"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        <div className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg flex items-center">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          {member.rating}
                        </div>
                      </motion.div>

                      {/* Specialty Icon */}
                      <motion.div
                        className="absolute bottom-4 left-4 w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                        whileHover={{ scale: 1.1, rotate: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <User className="h-7 w-7 text-white" />
                      </motion.div>
                    </div>

                    {/* Member Details */}
                    <CardContent className="p-4 sm:p-6 text-center">
                      <motion.h4
                        className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors duration-300"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                      >
                        {member.name}
                      </motion.h4>

                      <motion.p
                        className="text-purple-600 font-semibold mb-3 text-base sm:text-lg"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        {member.role}
                      </motion.p>

                      <motion.p
                        className="text-gray-600 mb-4 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        {member.specialty}
                      </motion.p>

                      <motion.div
                        className="flex items-center justify-center mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.6 + i * 0.1 }}
                            >
                              <Star
                                className={`h-4 w-4 ${i < Math.floor(member.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            </motion.div>
                          ))}
                        </div>
                        <span className="ml-2 text-sm font-semibold text-gray-700">{member.rating}</span>
                      </motion.div>

                      <motion.p
                        className="text-sm text-gray-600 leading-relaxed mb-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        {member.bio}
                      </motion.p>

                      {/* Individual Book Button */}
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                      >
                        <Link to={`/booking?staff=${member.id}`}>
                          <Button
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-2 sm:py-3 rounded-xl text-sm sm:text-base lg:text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                            size="lg"
                          >
                            <User className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                            <span className="hidden sm:inline">Book with {member.name.split(' ')[0]}</span>
                            <span className="sm:hidden">Book</span>
                          </Button>
                        </Link>
                      </motion.div>
                    </CardContent>

                    {/* Animated bottom border */}
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* View All Team Button */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
          >
            <Link to="/booking">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-purple-500 text-purple-600 hover:bg-purple-500 hover:text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <Users className="mr-2 h-5 w-5" />
                View All Team & Book
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section 
        id="contact" 
        className="py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <motion.div variants={itemVariants}>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8">
                Visit Our
                <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">Sanctuary</span>
              </h3>
              
              <div className="space-y-6">
                {[
                  { icon: MapPin, text: '123 Beauty Boulevard, Luxury District, NY 10001' },
                  { icon: Phone, text: '(555) 123-4567' },
                  { icon: Mail, text: 'hello@luxesalon.com' }
                ].map((contact, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-center group"
                    whileHover={{ x: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                      <contact.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-gray-300 group-hover:text-white transition-colors duration-300">{contact.text}</span>
                  </motion.div>
                ))}
              </div>
              
              <div className="mt-12">
                <h4 className="text-xl sm:text-2xl font-bold mb-6 text-white">Opening Hours</h4>
                <div className="space-y-3">
                  {[
                    { day: 'Monday - Friday', hours: '9:00 AM - 8:00 PM' },
                    { day: 'Saturday', hours: '9:00 AM - 6:00 PM' },
                    { day: 'Sunday', hours: '10:00 AM - 5:00 PM' }
                  ].map((schedule, index) => (
                    <motion.div 
                      key={index}
                      className="flex justify-between items-center p-3 bg-white/5 rounded-lg backdrop-blur-sm"
                      whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                    >
                      <span className="text-gray-300">{schedule.day}</span>
                      <span className="text-white font-semibold">{schedule.hours}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="mt-12">
                <h4 className="text-xl sm:text-2xl font-bold mb-6 text-white">Follow Us</h4>
                <div className="flex space-x-4">
                  {[Instagram, Facebook, Twitter].map((Social, index) => (
                    <motion.a
                      key={index}
                      href="#"
                      className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Social className="h-6 w-6 text-white" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              className="bg-gradient-to-br from-white/10 to-white/5 p-10 rounded-3xl backdrop-blur-sm border border-white/10"
              variants={itemVariants}
            >
              <h3 className="text-2xl sm:text-3xl font-bold mb-8 text-white">Ready to Transform?</h3>
              <p className="text-gray-300 mb-8 text-base sm:text-lg leading-relaxed">
                Schedule your appointment today and experience the luxury you deserve.
                Our booking system makes it easy to find the perfect time and service for you.
              </p>
              
              <Link to="/booking">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="lg" className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-4 rounded-2xl text-lg font-semibold shadow-2xl">
                    <Calendar className="mr-3 h-6 w-6" />
                    Book Your Transformation
                  </Button>
                </motion.div>
              </Link>
              
              <motion.div 
                className="mt-8 p-6 bg-gradient-to-r from-rose-500/20 to-pink-500/20 rounded-2xl border border-rose-400/20"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 }}
              >
                <p className="text-sm text-gray-300 text-center">
                  ✨ First-time clients receive 15% off their initial service
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="bg-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className="flex items-center justify-center space-x-3 mb-6"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
                <Sparkles className="h-7 w-7 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">
                Luxe Salon
              </h2>
            </motion.div>
            
            <p className="text-gray-400 mb-8 text-lg">Where beauty meets excellence</p>
            
            <div className="flex justify-center space-x-8 mb-8">
              {['Privacy Policy', 'Terms of Service', 'Contact'].map((link, index) => (
                <motion.a 
                  key={link}
                  href="#" 
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  {link}
                </motion.a>
              ))}
            </div>
            
            <motion.p 
              className="text-gray-500 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
            >
              © 2024 Luxe Salon. All rights reserved.
            </motion.p>
          </motion.div>
        </div>
      </footer>
    </div>
  );
}
