export interface Service {
  id: number;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  category: string;
  is_active: boolean;
  created_at: string;
}

export interface Staff {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
  specialty: string;
  rating: number;
  experience_years: number;
  bio: string;
  is_active: boolean;
  created_at: string;
}

export interface Client {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  date_of_birth?: string;
  address?: string;
  notes?: string;
  created_at: string;
  last_visit?: string;
}

export interface Booking {
  id: number;
  client_id: number;
  service_id: number;
  staff_id: number;
  appointment_date: string;
  appointment_time: string;
  duration_minutes: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'rejected' | 'completed' | 'cancelled' | 'no_show';
  special_requests?: string;
  created_at: string;
  updated_at: string;
  client?: Client;
  service?: Service;
  staff?: Staff;
}

export interface AdminNotification {
  id: number;
  booking_id: number;
  notification_type: 'new_booking' | 'cancellation' | 'modification';
  message: string;
  is_read: boolean;
  created_at: string;
  booking?: Booking;
}

export interface DashboardStats {
  today_bookings: number;
  week_bookings: number;
  month_bookings: number;
  month_revenue: number;
  total_clients: number;
  active_staff: number;
  unread_notifications: number;
}

export interface RevenueReport {
  date_from: string;
  date_to: string;
  total_revenue: number;
  total_bookings: number;
  average_booking_value: number;
  service_breakdown: Record<string, { revenue: number; bookings: number }>;
  staff_breakdown: Record<string, { revenue: number; bookings: number }>;
}

export interface BookingRequest {
  client_name: string;
  client_email: string;
  client_phone: string;
  service_id: number;
  staff_id: number;
  appointment_date: string;
  appointment_time: string;
  special_requests?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
