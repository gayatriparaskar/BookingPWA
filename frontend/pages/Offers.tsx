import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, Star, Phone, MapPin, Mail,
  Scissors, Sparkles, Heart, Award, Users2,
  ChevronLeft, ChevronRight, Play, Pause,
  Instagram, Facebook, Twitter, User, Users,
  Eye, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Offers() {
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
              <Link to="/" className="text-gray-700 hover:text-rose-600 transition-colors duration-300 font-medium relative group">
                Home
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/#services" className="text-gray-700 hover:text-rose-600 transition-colors duration-300 font-medium relative group">
                Services
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/gallery" className="text-gray-700 hover:text-rose-600 transition-colors duration-300 font-medium relative group">
                Gallery
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link to="/offers" className="text-rose-600 font-medium relative">
                Offers
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-rose-500 to-pink-500"></span>
              </Link>
              <Link to="/my-bookings" className="text-gray-700 hover:text-rose-600 transition-colors duration-300 font-medium relative group">
                My Bookings
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </nav>
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Link to="/booking">
                <Button size="sm" className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300">
                  <Calendar className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Desktop Book Button */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="hidden md:block"
            >
              <Link to="/booking">
                <Button className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Now
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/6899542/pexels-photo-6899542.jpeg"
            alt="Luxury Salon Offers"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 200 }}
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-8 py-4 rounded-full font-bold text-2xl mb-8 shadow-2xl"
            >
              <Sparkles className="h-8 w-8" />
              <span>EXCLUSIVE OFFERS</span>
              <Sparkles className="h-8 w-8" />
            </motion.div>

            <motion.h2
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
            >
              Unbeatable
              <br />
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Beauty Deals
              </span>
            </motion.h2>
            
            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto leading-relaxed px-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.9 }}
            >
              Save big on premium beauty services with our limited-time offers.
              From first-time discounts to luxury packages, we have something special for everyone.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1 }}
            >
              <Link to="/booking">
                <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black px-6 sm:px-10 py-3 sm:py-4 rounded-2xl text-base sm:text-lg font-bold shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105">
                  <Calendar className="mr-2 sm:mr-3 h-5 sm:h-6 w-5 sm:w-6" />
                  <span className="hidden sm:inline">Book with Offer</span>
                  <span className="sm:hidden">Book Offer</span>
                </Button>
              </Link>

              <Link to="/">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-6 sm:px-10 py-3 sm:py-4 rounded-2xl text-base sm:text-lg font-semibold backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
                >
                  <ArrowLeft className="mr-2 sm:mr-3 h-5 sm:h-6 w-5 sm:w-6" />
                  <span className="hidden sm:inline">Back to Home</span>
                  <span className="sm:hidden">Home</span>
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Attractive Offers Section */}
      <motion.section
        className="py-24 bg-gradient-to-br from-purple-900 via-rose-900 to-pink-900 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={containerVariants}
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              rotate: [360, 0],
              scale: [1.2, 1, 1.2]
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "linear"
            }}
            className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-xl"
          />
          <motion.div
            animate={{
              x: [-20, 20, -20],
              y: [-10, 10, -10]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-br from-rose-400/20 to-pink-400/20 rounded-full blur-lg"
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            variants={itemVariants}
          >
            <h3 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Limited Time
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent"> Offers</span>
            </h3>
            <p className="text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto leading-relaxed px-4">
              Don't miss out on these incredible offers! Book now and save big on our premium beauty services.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* First Time Client Offer */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -15, scale: 1.03 }}
              transition={{ duration: 0.4 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-600 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Card className="relative bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden h-full">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-400 to-teal-600"></div>
                <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                  >
                    <Users className="h-10 w-10 text-white" />
                  </motion.div>

                  <Badge className="bg-emerald-100 text-emerald-800 border-0 px-4 py-1 text-sm font-bold mb-4">
                    NEW CLIENT SPECIAL
                  </Badge>

                  <h4 className="text-3xl font-bold text-gray-900 mb-2">25% OFF</h4>
                  <h5 className="text-xl font-semibold text-emerald-600 mb-4">First Visit</h5>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Welcome to Luxe Salon! Enjoy 25% off any service on your first visit.
                    Perfect for trying our premium treatments.
                  </p>

                  <div className="bg-emerald-50 p-4 rounded-2xl mb-6">
                    <p className="text-sm text-emerald-800 font-semibold">
                      ⏰ Valid for new clients only • No expiration
                    </p>
                  </div>

                  <Link to="/booking">
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white py-3 rounded-xl text-lg font-semibold shadow-lg">
                      <Calendar className="mr-2 h-5 w-5" />
                      Claim Offer
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Spa Package Deal */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -15, scale: 1.03 }}
              transition={{ duration: 0.4 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Card className="relative bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden h-full">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-500 to-pink-600"></div>
                <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                  >
                    <Heart className="h-10 w-10 text-white" />
                  </motion.div>

                  <Badge className="bg-purple-100 text-purple-800 border-0 px-4 py-1 text-sm font-bold mb-4">
                    POPULAR PACKAGE
                  </Badge>

                  <h4 className="text-3xl font-bold text-gray-900 mb-2">$299</h4>
                  <h5 className="text-xl font-semibold text-purple-600 mb-4">Luxury Spa Day</h5>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Complete wellness package: Facial + Massage + Manicure + Hair Styling.
                    Save $100 compared to individual services!
                  </p>

                  <div className="bg-purple-50 p-4 rounded-2xl mb-6">
                    <p className="text-sm text-purple-800 font-semibold">
                      💎 Originally $399 • Save $100 • 4-hour experience
                    </p>
                  </div>

                  <Link to="/booking">
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white py-3 rounded-xl text-lg font-semibold shadow-lg">
                      <Sparkles className="mr-2 h-5 w-5" />
                      Book Package
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Weekend Special */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -15, scale: 1.03 }}
              transition={{ duration: 0.4 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-600 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Card className="relative bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden h-full">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-orange-400 to-red-600"></div>
                <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
                  <motion.div
                    animate={{
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ duration: 2.5, repeat: Infinity }}
                    className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                  >
                    <Clock className="h-10 w-10 text-white" />
                  </motion.div>

                  <Badge className="bg-orange-100 text-orange-800 border-0 px-4 py-1 text-sm font-bold mb-4">
                    WEEKEND SPECIAL
                  </Badge>

                  <h4 className="text-3xl font-bold text-gray-900 mb-2">40% OFF</h4>
                  <h5 className="text-xl font-semibold text-orange-600 mb-4">Hair Services</h5>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Saturday & Sunday only! Get 40% off all hair cuts, coloring, and styling services.
                    Perfect for your weekend transformation.
                  </p>

                  <div className="bg-orange-50 p-4 rounded-2xl mb-6">
                    <p className="text-sm text-orange-800 font-semibold">
                      🔥 Weekends only • Limited slots • Ends soon
                    </p>
                  </div>

                  <Link to="/booking">
                    <Button className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white py-3 rounded-xl text-lg font-semibold shadow-lg">
                      <Scissors className="mr-2 h-5 w-5" />
                      Book Weekend
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Referral Program */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -15, scale: 1.03 }}
              transition={{ duration: 0.4 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Card className="relative bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden h-full">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-400 to-indigo-600"></div>
                <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
                  <motion.div
                    animate={{
                      y: [0, -5, 0],
                      rotate: [0, 10, 0]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                  >
                    <Star className="h-10 w-10 text-white" />
                  </motion.div>

                  <Badge className="bg-blue-100 text-blue-800 border-0 px-4 py-1 text-sm font-bold mb-4">
                    REFER & EARN
                  </Badge>

                  <h4 className="text-3xl font-bold text-gray-900 mb-2">$50 + $50</h4>
                  <h5 className="text-xl font-semibold text-blue-600 mb-4">Referral Rewards</h5>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Refer a friend and you both get $50 off your next service!
                    Share the luxury experience with those you love.
                  </p>

                  <div className="bg-blue-50 p-4 rounded-2xl mb-6">
                    <p className="text-sm text-blue-800 font-semibold">
                      👥 You get $50 • Friend gets $50 • Unlimited referrals
                    </p>
                  </div>

                  <Link to="/booking">
                    <Button className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-3 rounded-xl text-lg font-semibold shadow-lg">
                      <Users className="mr-2 h-5 w-5" />
                      Start Referring
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Monthly Membership */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -15, scale: 1.03 }}
              transition={{ duration: 0.4 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-400 to-pink-600 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Card className="relative bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden h-full">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-rose-400 to-pink-600"></div>
                <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 180, 360]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                  >
                    <Award className="h-10 w-10 text-white" />
                  </motion.div>

                  <Badge className="bg-rose-100 text-rose-800 border-0 px-4 py-1 text-sm font-bold mb-4">
                    VIP MEMBERSHIP
                  </Badge>

                  <h4 className="text-3xl font-bold text-gray-900 mb-2">$99/mo</h4>
                  <h5 className="text-xl font-semibold text-rose-600 mb-4">Unlimited Access</h5>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    VIP membership with 50% off all services, priority booking,
                    and exclusive monthly treatments. Cancel anytime.
                  </p>

                  <div className="bg-rose-50 p-4 rounded-2xl mb-6">
                    <p className="text-sm text-rose-800 font-semibold">
                      👑 50% off everything • Priority booking • Exclusive perks
                    </p>
                  </div>

                  <Link to="/booking">
                    <Button className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white py-3 rounded-xl text-lg font-semibold shadow-lg">
                      <Award className="mr-2 h-5 w-5" />
                      Join VIP
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Holiday Special */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -15, scale: 1.03 }}
              transition={{ duration: 0.4 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Card className="relative bg-white/95 backdrop-blur-sm border-0 shadow-2xl rounded-3xl overflow-hidden h-full">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-yellow-400 to-orange-600"></div>
                <CardContent className="p-4 sm:p-6 lg:p-8 text-center">
                  <motion.div
                    animate={{
                      rotate: [0, -10, 10, 0],
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                  >
                    <Sparkles className="h-10 w-10 text-white" />
                  </motion.div>

                  <Badge className="bg-yellow-100 text-yellow-800 border-0 px-4 py-1 text-sm font-bold mb-4">
                    SEASONAL SPECIAL
                  </Badge>

                  <h4 className="text-3xl font-bold text-gray-900 mb-2">Buy 2 Get 1</h4>
                  <h5 className="text-xl font-semibold text-orange-600 mb-4">Gift Package</h5>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Perfect for gifting! Buy any 2 services and get the 3rd one absolutely free.
                    Great for special occasions and celebrations.
                  </p>

                  <div className="bg-yellow-50 p-4 rounded-2xl mb-6">
                    <p className="text-sm text-yellow-800 font-semibold">
                      🎁 Perfect for gifts • Mix any services • Valid 6 months
                    </p>
                  </div>

                  <Link to="/booking">
                    <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white py-3 rounded-xl text-lg font-semibold shadow-lg">
                      <Heart className="mr-2 h-5 w-5" />
                      Gift Package
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Bottom CTA */}
          <motion.div
            className="text-center mt-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.p
              className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ⚡ Limited time offers - Book now before they expire! ⚡
            </motion.p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/booking">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black px-8 py-4 rounded-2xl text-lg font-bold shadow-2xl"
                  >
                    <Calendar className="mr-2 h-6 w-6" />
                    Book Any Offer Now
                  </Button>
                </motion.div>
              </Link>

              <motion.a
                href="tel:555-123-4567"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-2xl text-lg font-bold backdrop-blur-sm"
                >
                  <Phone className="mr-2 h-6 w-6" />
                  Call for Details
                </Button>
              </motion.a>
            </div>
          </motion.div>
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
