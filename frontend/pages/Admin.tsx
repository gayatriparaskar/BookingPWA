import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Users, DollarSign, Clock, ArrowLeft, TrendingUp,
  Sparkles, Star, Phone, Mail, MapPin, Award, BarChart3,
  Eye, Filter, Search, RefreshCw, AlertCircle, LogOut,
  Menu, X, LayoutDashboard, UserCheck, Settings, Gift,
  Edit, Trash2, Plus, Save, XCircle, CheckCircle, Bell, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { DashboardStats, Booking, Client } from '@shared/types';
import { useAuth } from '@/contexts/AuthContext';

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

export default function Admin() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState('dashboard');

  // CRUD data states
  const [users, setUsers] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [team, setTeam] = useState<any[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);

  // Modal and form states
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'create' | 'edit'>('create');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [currentEntity, setCurrentEntity] = useState<'users' | 'services' | 'team' | 'offers' | 'bookings'>('users');

  // Notification states
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [pendingBookingsCount, setPendingBookingsCount] = useState(0);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, route: 'overview' },
    { id: 'bookings', label: 'Bookings', icon: Calendar, route: 'bookings' },
    { id: 'users', label: 'User List', icon: Users, route: 'clients' },
    { id: 'services', label: 'Services', icon: Sparkles, route: 'services' },
    { id: 'team', label: 'Team', icon: UserCheck, route: 'team' },
    { id: 'offers', label: 'Offers', icon: Gift, route: 'offers' }
  ];

  useEffect(() => {
    fetchDashboardData();
    // Initialize data for all routes
    fetchUsers();
    fetchServices();
    fetchTeam();
    fetchOffers();
    fetchBookings();
    fetchPendingBookings();

    // Set up real-time polling for new bookings
    const pollInterval = setInterval(() => {
      fetchPendingBookings();
    }, 10000); // Poll every 10 seconds

    // Add click outside listener for notifications
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showNotifications && !target.closest('.notification-dropdown') && !target.closest('.notification-button')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      clearInterval(pollInterval);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [pendingBookingsCount, showNotifications]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleRouteChange = (routeId: string, tabValue: string) => {
    setActiveRoute(routeId);
    setActiveTab(tabValue);
    setSidebarOpen(false);

    // Fetch data based on route
    if (routeId === 'users') {
      fetchUsers();
    } else if (routeId === 'services') {
      fetchServices();
    } else if (routeId === 'team') {
      fetchTeam();
    } else if (routeId === 'offers') {
      fetchOffers();
    } else if (routeId === 'bookings') {
      fetchBookings();
    }
  };

  // Fetch functions
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setUsers(data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/admin/services', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setServices(data.data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchTeam = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/admin/team', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setTeam(data.data);
    } catch (error) {
      console.error('Error fetching team:', error);
    }
  };

  const fetchOffers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/admin/offers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setOffers(data.data);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/admin/bookings-manage', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) setBookings(data.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchPendingBookings = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/admin/pending-bookings', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        const currentCount = pendingBookingsCount;
        const newCount = data.count;

        // If there are new pending bookings, show notification
        if (newCount > currentCount) {
          const newBookings = data.data.slice(currentCount);
          newBookings.forEach((booking: any) => {
            addNotification({
              id: Date.now() + Math.random(),
              type: 'new_booking',
              title: 'New Booking Request',
              message: `${booking.client_name} has booked ${booking.service_name}`,
              booking: booking,
              timestamp: new Date().toISOString()
            });
          });
        }

        setPendingBookingsCount(newCount);
      }
    } catch (error) {
      console.error('Error fetching pending bookings:', error);
    }
  };

  const addNotification = (notification: any) => {
    setNotifications(prev => [notification, ...prev].slice(0, 10)); // Keep last 10 notifications
  };

  const updateBookingStatus = async (bookingId: number, status: 'confirmed' | 'rejected', notes?: string) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status, notes })
      });

      if (response.ok) {
        fetchBookings();
        fetchPendingBookings(); // Update pending count

        // Add notification for status update
        const booking = bookings.find(b => b.id === bookingId);
        if (booking) {
          addNotification({
            id: Date.now() + Math.random(),
            type: 'status_update',
            title: `Booking ${status.charAt(0).toUpperCase() + status.slice(1)}`,
            message: `${booking.client_name}'s booking has been ${status}`,
            timestamp: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  // CRUD operations
  const handleCreate = (entity: 'users' | 'services' | 'team' | 'offers' | 'bookings') => {
    setCurrentEntity(entity as any);
    setModalType('create');
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item: any, entity: 'users' | 'services' | 'team' | 'offers' | 'bookings') => {
    setCurrentEntity(entity as any);
    setModalType('edit');
    setEditingItem(item);
    setShowModal(true);
  };

  const handleDelete = async (id: number, entity: 'users' | 'services' | 'team' | 'offers' | 'bookings') => {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const endpoint = entity === 'bookings' ? 'bookings-manage' : entity;
      const response = await fetch(`/api/admin/${endpoint}/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        // Refresh data
        if (entity === 'users') fetchUsers();
        else if (entity === 'services') fetchServices();
        else if (entity === 'team') fetchTeam();
        else if (entity === 'offers') fetchOffers();
        else if (entity === 'bookings') fetchBookings();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleSave = async (formData: any) => {
    try {
      const token = localStorage.getItem('authToken');
      const endpoint = currentEntity === 'bookings' ? 'bookings-manage' : currentEntity;
      const url = modalType === 'create'
        ? `/api/admin/${endpoint}`
        : `/api/admin/${endpoint}/${editingItem.id}`;

      const method = modalType === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowModal(false);
        // Refresh data
        if (currentEntity === 'users') fetchUsers();
        else if (currentEntity === 'services') fetchServices();
        else if (currentEntity === 'team') fetchTeam();
        else if (currentEntity === 'offers') fetchOffers();
        else if (currentEntity === 'bookings') fetchBookings();
      }
    } catch (error) {
      console.error('Error saving item:', error);
    }
  };

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Get authentication token
      const token = localStorage.getItem('authToken');
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Fetch all data with proper error handling
      const [statsResponse, bookingsResponse, clientsResponse] = await Promise.all([
        fetch('/api/admin/dashboard/stats', { headers }),
        fetch('/api/admin/bookings', { headers }),
        fetch('/api/admin/clients', { headers })
      ]);

      // Check for authentication errors
      if (statsResponse.status === 401 || bookingsResponse.status === 401 || clientsResponse.status === 401) {
        setError('Authentication failed. Please log in again.');
        logout();
        navigate('/login');
        return;
      }

      if (statsResponse.status === 403 || bookingsResponse.status === 403 || clientsResponse.status === 403) {
        setError('Access denied. Admin privileges required.');
        return;
      }

      // Parse responses individually with error checking
      const statsRes = statsResponse.ok ? await statsResponse.json() : { success: false, message: `Error: ${statsResponse.status}` };
      const bookingsRes = bookingsResponse.ok ? await bookingsResponse.json() : { success: false, message: `Error: ${bookingsResponse.status}` };
      const clientsRes = clientsResponse.ok ? await clientsResponse.json() : { success: false, message: `Error: ${clientsResponse.status}` };

      if (statsRes.success) {
        setStats(statsRes.data.stats);
        setUpcomingBookings(statsRes.data.upcoming_bookings);
      } else {
        console.warn('Failed to fetch stats:', statsRes.message);
      }

      if (bookingsRes.success) {
        setAllBookings(bookingsRes.data);
      } else {
        console.warn('Failed to fetch bookings:', bookingsRes.message);
      }

      if (clientsRes.success) {
        setClients(clientsRes.data);
      } else {
        console.warn('Failed to fetch clients:', clientsRes.message);
      }

      // If all requests failed, show error
      if (!statsRes.success && !bookingsRes.success && !clientsRes.success) {
        setError('Failed to load dashboard data. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Network error occurred. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'no_show': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredClients = clients.filter(client =>
    client.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const getTodaysBookings = () => {
    const today = new Date().toISOString().split('T')[0];
    return bookings.filter(booking => booking.appointment_date === today).length;
  };

  const getThisWeekBookings = () => {
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    const weekEnd = new Date(today.setDate(today.getDate() - today.getDay() + 6));

    return bookings.filter(booking => {
      const bookingDate = new Date(booking.appointment_date);
      return bookingDate >= weekStart && bookingDate <= weekEnd;
    }).length;
  };

  const getMonthlyRevenue = () => {
    const today = new Date();
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    return bookings.filter(booking => {
      const bookingDate = new Date(booking.appointment_date);
      return bookingDate >= monthStart && bookingDate <= monthEnd && booking.status === 'completed';
    }).reduce((total, booking) => total + (booking.total_price || 0), 0);
  };

  const statCards = [
    {
      title: "Today's Bookings",
      value: getTodaysBookings(),
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'from-blue-50 to-blue-100'
    },
    {
      title: "This Week",
      value: getThisWeekBookings(),
      icon: TrendingUp,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'from-emerald-50 to-emerald-100'
    },
    {
      title: "Monthly Revenue",
      value: `$${getMonthlyRevenue()}`,
      icon: DollarSign,
      color: 'from-rose-500 to-pink-600',
      bgColor: 'from-rose-50 to-pink-100'
    },
    {
      title: "Total Clients",
      value: users.length,
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'from-purple-50 to-purple-100'
    }
  ];

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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Dashboard</h2>
          <p className="text-gray-600">Fetching the latest salon data...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4">
        <motion.div
          className="max-w-md w-full text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <AlertCircle className="h-8 w-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Error</h2>

          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>

          <div className="space-y-3">
            <Button
              onClick={() => {
                setError(null);
                fetchDashboardData();
              }}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>

            <Link to="/">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex">
      {/* Sidebar */}
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-40 w-72 h-screen bg-white shadow-2xl border-r border-gray-200`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Admin Panel</h2>
                  <p className="text-sm text-gray-500">Luxe Salon</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {sidebarItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => handleRouteChange(item.id, item.route)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 text-left ${
                  activeRoute === item.id
                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            ))}
          </nav>

          {/* User Info & Logout */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'A'}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{user?.name || 'Admin'}</p>
                <p className="text-sm text-gray-500">Administrator</p>
              </div>
            </div>
            <motion.button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Enhanced Header */}
        <motion.header 
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="bg-white/80 backdrop-blur-lg shadow-xl border-b border-gray-200/50 sticky top-0 z-20"
        >
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Menu className="h-5 w-5 text-gray-600" />
                </button>
                
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
                
                <div className="flex items-center space-x-3">
                  <div>
                    <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                      {sidebarItems.find(item => item.id === activeRoute)?.label || 'Dashboard'}
                    </h1>
                    <p className="text-sm text-gray-500">Luxe Salon Management</p>
                  </div>
                </div>
              </div>
              
              <motion.div 
                className="flex items-center space-x-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Button
                      onClick={() => setShowNotifications(!showNotifications)}
                      variant="outline"
                      size="sm"
                      className="relative notification-button"
                    >
                      <Bell className="h-4 w-4" />
                      {notifications.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {notifications.length}
                        </span>
                      )}
                    </Button>

                    {/* Notifications Dropdown */}
                    {showNotifications && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-96 overflow-y-auto notification-dropdown"
                      >
                        <div className="p-4 border-b border-gray-200">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">Notifications</h3>
                            <span className="text-sm text-gray-500">{notifications.length} new</span>
                          </div>
                        </div>
                        <div className="max-h-64 overflow-y-auto">
                          {notifications.length > 0 ? (
                            notifications.map((notification) => (
                              <div key={notification.id} className="p-4 border-b border-gray-100 hover:bg-gray-50">
                                <div className="flex items-start space-x-3">
                                  <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center">
                                    <Bell className="h-4 w-4 text-rose-600" />
                                  </div>
                                  <div className="flex-1">
                                    <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
                                    <p className="text-gray-600 text-sm">{notification.message}</p>
                                    <p className="text-gray-400 text-xs mt-1">
                                      {new Date(notification.timestamp).toLocaleTimeString()}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="p-4 text-center text-gray-500">
                              No new notifications
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <Button
                    onClick={fetchDashboardData}
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    <span className="hidden sm:inline">Refresh</span>
                  </Button>
                </div>
                
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium text-gray-700">
                    {new Date().toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                  <p className="text-xs text-gray-500">Last updated: {new Date().toLocaleTimeString()}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.header>

        {/* Main Content Area */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {/* Enhanced Stats Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {statCards.map((stat, index) => (
              <motion.div
                key={stat.title}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 overflow-hidden relative">
                  <div className={`absolute inset-0 bg-gradient-to-br ${stat.bgColor} opacity-50`}></div>
                  <CardContent className="p-6 relative">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                        <motion.p 
                          className="text-3xl font-bold text-gray-900"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.5 + index * 0.1, type: "spring", stiffness: 200 }}
                        >
                          {stat.value}
                        </motion.p>
                      </div>
                      <motion.div 
                        className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <stat.icon className="h-7 w-7 text-white" />
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Content based on active route */}
          {activeRoute === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
                <TabsList className="grid w-full grid-cols-3 bg-white rounded-2xl shadow-lg p-2 border-0">
                  {[
                    { value: 'overview', label: 'Overview', icon: BarChart3 },
                    { value: 'bookings', label: 'All Bookings', icon: Calendar },
                    { value: 'clients', label: 'Clients', icon: Users }
                  ].map((tab) => (
                    <TabsTrigger 
                      key={tab.value}
                      value={tab.value} 
                      className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-600 data-[state=active]:text-white rounded-xl py-3 px-6 transition-all duration-300"
                    >
                      <tab.icon className="h-4 w-4" />
                      <span className="font-medium">{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TabsContent value="overview" className="space-y-8">
                  {/* Pending Bookings Management */}
                  <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-6">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl flex items-center space-x-3">
                          <Calendar className="h-6 w-6 text-rose-500" />
                          <span>Pending Bookings</span>
                          {pendingBookingsCount > 0 && (
                            <Badge className="bg-red-100 text-red-800 ml-2">
                              {pendingBookingsCount} require attention
                            </Badge>
                          )}
                        </CardTitle>
                        <Button
                          onClick={() => handleRouteChange('bookings', 'bookings')}
                          variant="outline"
                          size="sm"
                        >
                          View All Bookings
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {bookings.filter(b => b.status === 'pending').length > 0 ? (
                        <div className="space-y-4">
                          {bookings.filter(b => b.status === 'pending').slice(0, 3).map((booking, index) => (
                            <motion.div
                              key={booking.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center justify-between p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200 hover:shadow-lg transition-all duration-300"
                              whileHover={{ scale: 1.02 }}
                            >
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl flex items-center justify-center">
                                  <Calendar className="h-6 w-6 text-yellow-600" />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 text-lg">{booking.client_name}</p>
                                  <p className="text-gray-600">{booking.service_name}</p>
                                  <p className="text-sm text-gray-500">with {booking.staff_name}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-4">
                                <div className="text-right">
                                  <p className="font-semibold text-gray-900">
                                    {new Date(booking.appointment_date).toLocaleDateString()}
                                  </p>
                                  <p className="text-gray-600">{booking.appointment_time}</p>
                                  <p className="text-lg font-bold text-gray-900">${booking.total_price}</p>
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Accept
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateBookingStatus(booking.id, 'rejected', 'Rejected by admin')}
                                    className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              </div>
                            </motion.div>
                          ))}
                          {bookings.filter(b => b.status === 'pending').length > 3 && (
                            <motion.div className="text-center py-4">
                              <Button
                                onClick={() => handleRouteChange('bookings', 'bookings')}
                                variant="outline"
                              >
                                View {bookings.filter(b => b.status === 'pending').length - 3} More Pending Bookings
                              </Button>
                            </motion.div>
                          )}
                        </div>
                      ) : (
                        <motion.div
                          className="text-center py-12"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <CheckCircle className="h-16 w-16 text-green-300 mx-auto mb-4" />
                          <p className="text-xl text-gray-500">No pending bookings</p>
                          <p className="text-gray-400">All bookings are processed</p>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Upcoming Confirmed Appointments */}
                  <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                    <CardHeader className="pb-6">
                      <CardTitle className="text-2xl flex items-center space-x-3">
                        <Calendar className="h-6 w-6 text-rose-500" />
                        <span>Upcoming Appointments</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {bookings.filter(b => b.status === 'confirmed').length > 0 ? (
                        <div className="space-y-4">
                          {bookings.filter(b => b.status === 'confirmed').slice(0, 5).map((booking, index) => (
                            <motion.div
                              key={booking.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300"
                              whileHover={{ scale: 1.02 }}
                            >
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl flex items-center justify-center">
                                  <Calendar className="h-6 w-6 text-rose-600" />
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 text-lg">{booking.client_name}</p>
                                  <p className="text-gray-600">{booking.service_name}</p>
                                  <p className="text-sm text-gray-500">with {booking.staff_name}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-900">
                                  {new Date(booking.appointment_date).toLocaleDateString()}
                                </p>
                                <p className="text-gray-600">{booking.appointment_time}</p>
                                <Badge className={`${getStatusBadgeColor(booking.status)} mt-2`}>
                                  {booking.status}
                                </Badge>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <motion.div
                          className="text-center py-12"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                          <p className="text-xl text-gray-500">No upcoming appointments</p>
                          <p className="text-gray-400">New bookings will appear here</p>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                    <TabsContent value="bookings" className="space-y-8">
                      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                        <CardHeader className="pb-6">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl flex items-center space-x-3">
                              <Calendar className="h-6 w-6 text-rose-500" />
                              <span>All Bookings</span>
                            </CardTitle>
                            <div className="flex items-center space-x-2">
                              <Filter className="h-4 w-4 text-gray-400" />
                              <span className="text-sm text-gray-500">Total: {allBookings.length}</span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {allBookings.length > 0 ? (
                            <div className="space-y-4">
                              {allBookings.slice(0, 10).map((booking, index) => (
                                <motion.div 
                                  key={booking.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300"
                                  whileHover={{ scale: 1.01 }}
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center">
                                      <Users className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                      <p className="font-semibold text-gray-900">{booking.client?.full_name}</p>
                                      <p className="text-sm text-gray-600">{booking.service?.name}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="text-center md:text-left">
                                    <p className="font-medium text-gray-900">
                                      {new Date(booking.appointment_date).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-gray-600">{booking.appointment_time}</p>
                                  </div>
                                  
                                  <div className="text-center md:text-left">
                                    <p className="font-medium text-gray-900">{booking.staff?.name}</p>
                                    <p className="text-sm text-gray-600">{booking.duration_minutes} min</p>
                                  </div>
                                  
                                  <div className="text-center md:text-right">
                                    <p className="font-bold text-lg text-gray-900">${booking.total_price}</p>
                                    <Badge className={`${getStatusBadgeColor(booking.status)} mt-1`}>
                                      {booking.status}
                                    </Badge>
                                  </div>
                                </motion.div>
                              ))}
                              
                              {allBookings.length > 10 && (
                                <motion.div 
                                  className="text-center py-6 text-gray-500 bg-gray-50 rounded-xl"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.5 }}
                                >
                                  <Eye className="h-5 w-5 mx-auto mb-2" />
                                  <p>Showing first 10 bookings. Total: {allBookings.length}</p>
                                </motion.div>
                              )}
                            </div>
                          ) : (
                            <motion.div 
                              className="text-center py-12"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                              <p className="text-xl text-gray-500">No bookings found</p>
                              <p className="text-gray-400">Bookings will appear here once clients start booking</p>
                            </motion.div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="clients" className="space-y-8">
                      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                        <CardHeader className="pb-6">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-2xl flex items-center space-x-3">
                              <Users className="h-6 w-6 text-rose-500" />
                              <span>Client Directory</span>
                            </CardTitle>
                            <div className="flex items-center space-x-4">
                              <div className="relative">
                                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <Input
                                  placeholder="Search clients..."
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                  className="pl-10 pr-4 py-2 rounded-xl border-gray-200 focus:border-rose-500"
                                />
                              </div>
                              <span className="text-sm text-gray-500">
                                {filteredClients.length} of {clients.length}
                              </span>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          {filteredClients.length > 0 ? (
                            <div className="space-y-4">
                              {filteredClients.map((client, index) => (
                                <motion.div 
                                  key={client.id}
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="flex items-center justify-between p-6 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300"
                                  whileHover={{ scale: 1.01 }}
                                >
                                  <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center">
                                      <span className="text-lg font-bold text-purple-600">
                                        {client.full_name.split(' ').map(n => n[0]).join('')}
                                      </span>
                                    </div>
                                    <div>
                                      <p className="font-semibold text-gray-900 text-lg">{client.full_name}</p>
                                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                                        <div className="flex items-center space-x-1">
                                          <Mail className="h-4 w-4" />
                                          <span>{client.email}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <Phone className="h-4 w-4" />
                                          <span>{client.phone}</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <p className="text-sm text-gray-600 mb-1">
                                      Joined: {new Date(client.created_at).toLocaleDateString()}
                                    </p>
                                    {client.last_visit && (
                                      <p className="text-sm text-gray-600">
                                        Last visit: {new Date(client.last_visit).toLocaleDateString()}
                                      </p>
                                    )}
                                    <Badge variant="secondary" className="mt-2 bg-purple-100 text-purple-800">
                                      Client
                                    </Badge>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          ) : (
                            <motion.div 
                              className="text-center py-12"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                            >
                              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                              <p className="text-xl text-gray-500">
                                {searchTerm ? 'No clients found' : 'No clients yet'}
                              </p>
                              <p className="text-gray-400">
                                {searchTerm ? 'Try adjusting your search' : 'New clients will appear here'}
                              </p>
                            </motion.div>
                          )}
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </Tabs>
            </motion.div>
          )}

          {/* Booking Management - Table Format */}
          {activeRoute === 'bookings' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl flex items-center space-x-3">
                      <Calendar className="h-6 w-6 text-rose-500" />
                      <span>Booking Management</span>
                      {pendingBookingsCount > 0 && (
                        <Badge className="bg-red-100 text-red-800 ml-2">
                          {pendingBookingsCount} pending
                        </Badge>
                      )}
                    </CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={fetchBookings}
                        variant="outline"
                        size="sm"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Client</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Service</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Staff</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Date & Time</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Price</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((booking, index) => (
                          <motion.tr
                            key={booking.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-4 px-4">
                              <div>
                                <span className="font-medium text-gray-900">{booking.client_name}</span>
                                <p className="text-sm text-gray-500">{booking.client_email}</p>
                                <p className="text-sm text-gray-500">{booking.client_phone}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <div>
                                <span className="font-medium text-gray-900">{booking.service_name}</span>
                                <p className="text-sm text-gray-500">{booking.duration_minutes} min</p>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-gray-600">{booking.staff_name}</td>
                            <td className="py-4 px-4">
                              <div>
                                <span className="font-medium text-gray-900">
                                  {new Date(booking.appointment_date).toLocaleDateString()}
                                </span>
                                <p className="text-sm text-gray-500">{booking.appointment_time}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-gray-600 font-medium">${booking.total_price}</td>
                            <td className="py-4 px-4">
                              <Badge
                                className={
                                  booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                  booking.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                  booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                  'bg-gray-100 text-gray-800'
                                }
                              >
                                {booking.status}
                              </Badge>
                            </td>
                            <td className="py-4 px-4">
                              {booking.status === 'pending' ? (
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                  >
                                    <Check className="h-4 w-4 mr-1" />
                                    Accept
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => updateBookingStatus(booking.id, 'rejected', 'Rejected by admin')}
                                    className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                                  >
                                    <X className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex space-x-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEdit(booking, 'bookings')}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleDelete(booking.id, 'bookings')}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>

                    {bookings.length === 0 && (
                      <motion.div
                        className="text-center py-12"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-xl text-gray-500">No bookings found</p>
                        <p className="text-gray-400">Bookings will appear here when clients make appointments</p>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* User List - Table Format */}
          {activeRoute === 'users' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl flex items-center space-x-3">
                      <Users className="h-6 w-6 text-rose-500" />
                      <span>User Management</span>
                    </CardTitle>
                    <Button
                      onClick={() => handleCreate('users')}
                      className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add User
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Phone</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Bookings</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Total Spent</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user, index) => (
                          <motion.tr
                            key={user.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center">
                                  <span className="text-sm font-bold text-purple-600">
                                    {user.full_name.split(' ').map((n: string) => n[0]).join('')}
                                  </span>
                                </div>
                                <span className="font-medium text-gray-900">{user.full_name}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-gray-600">{user.email}</td>
                            <td className="py-4 px-4 text-gray-600">{user.phone}</td>
                            <td className="py-4 px-4">
                              <Badge className={user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                {user.status}
                              </Badge>
                            </td>
                            <td className="py-4 px-4 text-gray-600">{user.total_bookings}</td>
                            <td className="py-4 px-4 text-gray-600">${user.total_spent}</td>
                            <td className="py-4 px-4">
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(user, 'users')}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDelete(user.id, 'users')}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Services - Card Format */}
          {activeRoute === 'services' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl font-bold text-gray-900 flex items-center space-x-3">
                  <Sparkles className="h-8 w-8 text-rose-500" />
                  <span>Service Management</span>
                </h2>
                <Button
                  onClick={() => handleCreate('services')}
                  className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, index) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="border-0 shadow-xl bg-white overflow-hidden hover:shadow-2xl transition-all duration-300">
                      <div className="relative h-48">
                        <img
                          src={service.image}
                          alt={service.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge className={service.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {service.status}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold text-gray-900">{service.name}</h3>
                          <span className="text-2xl font-bold text-rose-600">${service.price}</span>
                        </div>
                        <Badge className="mb-3 bg-blue-100 text-blue-800">{service.category}</Badge>
                        <p className="text-gray-600 mb-4 text-sm">{service.description}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {service.duration_minutes} min
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(service, 'services')}
                            className="flex-1"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(service.id, 'services')}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Team - Table Format */}
          {activeRoute === 'team' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl flex items-center space-x-3">
                      <UserCheck className="h-6 w-6 text-rose-500" />
                      <span>Team Management</span>
                    </CardTitle>
                    <Button
                      onClick={() => handleCreate('team')}
                      className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Team Member
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Member</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Role</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Experience</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Rating</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {team.map((member, index) => (
                          <motion.tr
                            key={member.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={member.image}
                                  alt={member.name}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                  <span className="font-medium text-gray-900">{member.name}</span>
                                  <p className="text-sm text-gray-500">{member.specialty}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-gray-600">{member.role}</td>
                            <td className="py-4 px-4">
                              <div className="text-sm">
                                <p className="text-gray-600">{member.email}</p>
                                <p className="text-gray-500">{member.phone}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-gray-600">{member.experience_years} years</td>
                            <td className="py-4 px-4">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                                <span className="text-gray-600">{member.rating}</span>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <Badge className={member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                {member.status}
                              </Badge>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(member, 'team')}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDelete(member.id, 'team')}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Offers - Table Format */}
          {activeRoute === 'offers' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl flex items-center space-x-3">
                      <Gift className="h-6 w-6 text-rose-500" />
                      <span>Offers Management</span>
                    </CardTitle>
                    <Button
                      onClick={() => handleCreate('offers')}
                      className="bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Offer
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Title</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Code</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Discount</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Valid Until</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Usage</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {offers.map((offer, index) => (
                          <motion.tr
                            key={offer.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                          >
                            <td className="py-4 px-4">
                              <div>
                                <span className="font-medium text-gray-900">{offer.title}</span>
                                <p className="text-sm text-gray-500">{offer.description}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4">
                              <Badge variant="secondary" className="bg-gray-100 text-gray-800 font-mono">
                                {offer.code}
                              </Badge>
                            </td>
                            <td className="py-4 px-4 text-gray-600">
                              {offer.discount_percentage > 0
                                ? `${offer.discount_percentage}%`
                                : `$${offer.discount_amount}`
                              }
                            </td>
                            <td className="py-4 px-4 text-gray-600">
                              {new Date(offer.end_date).toLocaleDateString()}
                            </td>
                            <td className="py-4 px-4 text-gray-600">
                              {offer.used_count}/{offer.usage_limit}
                            </td>
                            <td className="py-4 px-4">
                              <Badge className={offer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                                {offer.status}
                              </Badge>
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEdit(offer, 'offers')}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDelete(offer.id, 'offers')}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      {/* Modal for Create/Edit Forms */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">
                  {modalType === 'create' ? 'Add New' : 'Edit'} {currentEntity.slice(0, -1).charAt(0).toUpperCase() + currentEntity.slice(1, -1)}
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <XCircle className="h-6 w-6 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <CRUDForm
                entity={currentEntity}
                editingItem={editingItem}
                onSave={handleSave}
                onCancel={() => setShowModal(false)}
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

// CRUD Form Component
const CRUDForm = ({ entity, editingItem, onSave, onCancel }: {
  entity: 'users' | 'services' | 'team' | 'offers' | 'bookings';
  editingItem: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState(editingItem || {});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const renderFormFields = () => {
    switch (entity) {
      case 'users':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <Input
                  value={formData.full_name || ''}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Enter email"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <Input
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status || 'active'}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </>
        );

      case 'services':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter service name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={formData.category || 'Hair'}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="Hair">Hair</option>
                  <option value="Skincare">Skincare</option>
                  <option value="Spa">Spa</option>
                  <option value="Nails">Nails</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter service description"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price ($)</label>
                <Input
                  type="number"
                  value={formData.price || ''}
                  onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                  placeholder="Enter price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (min)</label>
                <Input
                  type="number"
                  value={formData.duration_minutes || ''}
                  onChange={(e) => setFormData({...formData, duration_minutes: parseInt(e.target.value)})}
                  placeholder="Enter duration"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status || 'active'}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
              <Input
                value={formData.image || ''}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                placeholder="Enter image URL"
              />
            </div>
          </>
        );

      case 'team':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <Input
                  value={formData.name || ''}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <Input
                  value={formData.role || ''}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  placeholder="Enter role"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <Input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="Enter email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <Input
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="Enter phone"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Specialty</label>
              <Input
                value={formData.specialty || ''}
                onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                placeholder="Enter specialty"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Experience (years)</label>
                <Input
                  type="number"
                  value={formData.experience_years || ''}
                  onChange={(e) => setFormData({...formData, experience_years: parseInt(e.target.value)})}
                  placeholder="Enter years"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <Input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={formData.rating || ''}
                  onChange={(e) => setFormData({...formData, rating: parseFloat(e.target.value)})}
                  placeholder="Enter rating"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status || 'active'}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Schedule</label>
                <Input
                  value={formData.schedule || ''}
                  onChange={(e) => setFormData({...formData, schedule: e.target.value})}
                  placeholder="e.g., Mon-Fri: 9AM-6PM"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <Input
                  value={formData.image || ''}
                  onChange={(e) => setFormData({...formData, image: e.target.value})}
                  placeholder="Enter image URL"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
              <textarea
                value={formData.bio || ''}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                placeholder="Enter bio"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
          </>
        );

      case 'offers':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                <Input
                  value={formData.title || ''}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter offer title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Code</label>
                <Input
                  value={formData.code || ''}
                  onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                  placeholder="Enter offer code"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Enter offer description"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount Percentage (%)</label>
                <Input
                  type="number"
                  value={formData.discount_percentage || ''}
                  onChange={(e) => setFormData({...formData, discount_percentage: parseInt(e.target.value) || 0})}
                  placeholder="Enter percentage (0 if using amount)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount Amount ($)</label>
                <Input
                  type="number"
                  value={formData.discount_amount || ''}
                  onChange={(e) => setFormData({...formData, discount_amount: parseInt(e.target.value) || 0})}
                  placeholder="Enter amount (0 if using percentage)"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <Input
                  type="date"
                  value={formData.start_date || ''}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                <Input
                  type="date"
                  value={formData.end_date || ''}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Usage Limit</label>
                <Input
                  type="number"
                  value={formData.usage_limit || ''}
                  onChange={(e) => setFormData({...formData, usage_limit: parseInt(e.target.value)})}
                  placeholder="Enter usage limit"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Applicable Services</label>
                <Input
                  value={formData.applicable_services || ''}
                  onChange={(e) => setFormData({...formData, applicable_services: e.target.value})}
                  placeholder="e.g., All services, Hair only"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status || 'active'}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </>
        );

      case 'bookings':
        return (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client Name</label>
                <Input
                  value={formData.client_name || ''}
                  onChange={(e) => setFormData({...formData, client_name: e.target.value})}
                  placeholder="Enter client name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client Email</label>
                <Input
                  type="email"
                  value={formData.client_email || ''}
                  onChange={(e) => setFormData({...formData, client_email: e.target.value})}
                  placeholder="Enter client email"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Client Phone</label>
                <Input
                  value={formData.client_phone || ''}
                  onChange={(e) => setFormData({...formData, client_phone: e.target.value})}
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service Name</label>
                <Input
                  value={formData.service_name || ''}
                  onChange={(e) => setFormData({...formData, service_name: e.target.value})}
                  placeholder="Enter service name"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Staff Name</label>
                <Input
                  value={formData.staff_name || ''}
                  onChange={(e) => setFormData({...formData, staff_name: e.target.value})}
                  placeholder="Enter staff name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                <Input
                  type="number"
                  value={formData.duration_minutes || ''}
                  onChange={(e) => setFormData({...formData, duration_minutes: parseInt(e.target.value)})}
                  placeholder="Enter duration"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Date</label>
                <Input
                  type="date"
                  value={formData.appointment_date || ''}
                  onChange={(e) => setFormData({...formData, appointment_date: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Time</label>
                <Input
                  type="time"
                  value={formData.appointment_time || ''}
                  onChange={(e) => setFormData({...formData, appointment_time: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Price ($)</label>
                <Input
                  type="number"
                  value={formData.total_price || ''}
                  onChange={(e) => setFormData({...formData, total_price: parseInt(e.target.value)})}
                  placeholder="Enter price"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => setFormData({...formData, notes: e.target.value})}
                placeholder="Enter any notes"
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {renderFormFields()}

      <div className="flex space-x-4 pt-6 border-t border-gray-200">
        <Button
          type="submit"
          className="flex-1 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white"
        >
          <Save className="h-4 w-4 mr-2" />
          Save {entity.slice(0, -1).charAt(0).toUpperCase() + entity.slice(1, -1)}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          <XCircle className="h-4 w-4 mr-2" />
          Cancel
        </Button>
      </div>
    </form>
  );
};
