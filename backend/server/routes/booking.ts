import { RequestHandler } from "express";
import { db } from "../database";
import { BookingRequest, ApiResponse, Service as SharedService, Staff as SharedStaff } from "@shared/types";
import { bookings, services as adminServices, team as adminTeam } from "./admin-crud";

export const getAllServices: RequestHandler = (req, res) => {
  try {
    // Map admin services to shared Service shape and include only active
    const mapped: SharedService[] = adminServices
      .filter((s: any) => (s.status ?? 'active') !== 'inactive')
      .map((s: any) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        duration_minutes: s.duration_minutes,
        price: s.price,
        category: s.category,
        is_active: true,
        created_at: s.created_at || new Date().toISOString()
      }));

    res.json({
      success: true,
      data: mapped
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

export const getAllStaff: RequestHandler = (req, res) => {
  try {
    const mapped: SharedStaff[] = adminTeam
      .filter((m: any) => (m.status ?? 'active') !== 'inactive')
      .map((m: any) => ({
        id: m.id,
        name: m.name,
        email: m.email,
        phone: m.phone,
        role: m.role,
        specialty: m.specialty,
        rating: m.rating,
        experience_years: m.experience_years,
        bio: m.bio,
        is_active: true,
        created_at: m.created_at || new Date().toISOString()
      }));

    res.json({
      success: true,
      data: mapped
    } as ApiResponse);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

export const createBooking: RequestHandler = (req, res) => {
  try {
    const bookingData = req.body as BookingRequest;
    
    // Validate required fields
    const requiredFields = ['client_name', 'client_phone', 'service_id', 'staff_id', 'appointment_date', 'appointment_time'];
    for (const field of requiredFields) {
      if (!(field in bookingData)) {
        return res.status(400).json({
          success: false,
          error: `Missing required field: ${field}`
        } as ApiResponse);
      }
    }

    // Check if service exists (support admin-managed services)
    const serviceFromDb = db.getServiceById(bookingData.service_id);
    const service = serviceFromDb || (adminServices.find((s: any) => s.id === bookingData.service_id && (s.status ?? 'active') !== 'inactive') ? {
      id: bookingData.service_id,
      name: adminServices.find((s: any) => s.id === bookingData.service_id)!.name,
      description: adminServices.find((s: any) => s.id === bookingData.service_id)!.description,
      duration_minutes: adminServices.find((s: any) => s.id === bookingData.service_id)!.duration_minutes,
      price: adminServices.find((s: any) => s.id === bookingData.service_id)!.price,
      category: adminServices.find((s: any) => s.id === bookingData.service_id)!.category,
      is_active: true,
      created_at: new Date().toISOString()
    } as any : undefined);
    if (!service) {
      return res.status(404).json({
        success: false,
        error: 'Service not found'
      } as ApiResponse);
    }

    // Check if staff exists (support admin-managed team)
    const staffFromDb = db.getStaffById(bookingData.staff_id);
    const staff = staffFromDb || (adminTeam.find((m: any) => m.id === bookingData.staff_id && (m.status ?? 'active') !== 'inactive') ? {
      id: bookingData.staff_id,
      name: adminTeam.find((m: any) => m.id === bookingData.staff_id)!.name,
      email: adminTeam.find((m: any) => m.id === bookingData.staff_id)!.email,
      phone: adminTeam.find((m: any) => m.id === bookingData.staff_id)!.phone,
      role: adminTeam.find((m: any) => m.id === bookingData.staff_id)!.role,
      specialty: adminTeam.find((m: any) => m.id === bookingData.staff_id)!.specialty,
      rating: adminTeam.find((m: any) => m.id === bookingData.staff_id)!.rating,
      experience_years: adminTeam.find((m: any) => m.id === bookingData.staff_id)!.experience_years,
      bio: adminTeam.find((m: any) => m.id === bookingData.staff_id)!.bio,
      is_active: true,
      created_at: new Date().toISOString()
    } as any : undefined);
    if (!staff) {
      return res.status(404).json({
        success: false,
        error: 'Staff member not found'
      } as ApiResponse);
    }

    // Find or create client (prefer email when provided, fallback to phone)
    let client = bookingData.client_email ? db.getClientByEmail(bookingData.client_email) : undefined;
    if (!client) {
      client = db.getClientByPhone(bookingData.client_phone);
    }
    if (!client) {
      client = db.createClient({
        full_name: bookingData.client_name,
        email: bookingData.client_email || `${bookingData.client_phone}@no-email.local`,
        phone: bookingData.client_phone
      });
    }

    // Create booking
    const booking = db.createBooking({
      client_id: client.id,
      service_id: bookingData.service_id,
      staff_id: bookingData.staff_id,
      appointment_date: bookingData.appointment_date,
      appointment_time: bookingData.appointment_time,
      duration_minutes: service.duration_minutes,
      total_price: service.price,
      status: 'pending', // Changed to pending for admin approval
      special_requests: bookingData.special_requests
    });

    // Also add to admin-crud bookings array for admin management
    const getNextId = (array: any[]) => Math.max(...array.map(item => item.id), 0) + 1;

    const adminBooking = {
      id: getNextId(bookings),
      client_name: bookingData.client_name,
      client_email: bookingData.client_email,
      client_phone: bookingData.client_phone,
      service_name: service.name,
      staff_name: staff.name,
      appointment_date: bookingData.appointment_date,
      appointment_time: bookingData.appointment_time,
      duration_minutes: service.duration_minutes,
      total_price: service.price,
      status: 'pending',
      notes: bookingData.special_requests || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    bookings.push(adminBooking);



    res.status(201).json({
      success: true,
      data: booking,
      message: 'Booking created successfully'
    } as ApiResponse);

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

// Get bookings for a specific user (by phone)
export const getUserBookings: RequestHandler = (req, res) => {
  try {
    const { user_phone } = req.query;

    if (!user_phone) {
      return res.status(400).json({
        success: false,
        error: 'User phone number is required'
      } as ApiResponse);
    }

    // Get all bookings from database
    const allBookings = db.getAllBookings();

    // Filter bookings by matching client phone
    const userBookings = allBookings.filter(booking => {
      const client = db.getClientById(booking.client_id);
      return client && client.phone === user_phone;
    });

    // Enrich bookings with service and staff details
    const enrichedBookings = userBookings.map(booking => {
      const serviceDb = db.getServiceById(booking.service_id);
      const staffDb = db.getStaffById(booking.staff_id);
      const client = db.getClientById(booking.client_id);

      const serviceAdmin = adminServices.find((s: any) => s.id === booking.service_id);
      const staffAdmin = adminTeam.find((m: any) => m.id === booking.staff_id);

      return {
        ...booking,
        service_name: serviceDb?.name || serviceAdmin?.name || 'Unknown Service',
        service_price: serviceDb?.price || serviceAdmin?.price || 0,
        staff_name: staffDb?.name || staffAdmin?.name || 'Unknown Staff',
        client_name: client?.full_name || 'Unknown Client',
        client_email: client?.email || '',
        client_phone: client?.phone || ''
      };
    });

    res.json({
      success: true,
      data: enrichedBookings
    } as ApiResponse);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

export const getAvailableSlots: RequestHandler = (req, res) => {
  try {
    const { date, staff_id, service_id } = req.query;

    // Debug logging
    console.log('Available slots request:', req.query);
    console.log('Parameters received:', { date, staff_id, service_id });

    if (!date || !staff_id || !service_id) {
      const missingParams = [];
      if (!date) missingParams.push('date');
      if (!staff_id) missingParams.push('staff_id');
      if (!service_id) missingParams.push('service_id');

      const errorMsg = `Missing required parameters: ${missingParams.join(', ')}. Received: ${JSON.stringify(req.query)}`;
      console.error('Available slots error:', errorMsg);

      return res.status(400).json({
        success: false,
        error: errorMsg
      } as ApiResponse);
    }

    // Get service to know duration (support admin-managed services)
    console.log('Looking up service with ID:', service_id);
    const serviceFromDb = db.getServiceById(Number(service_id));
    const service = serviceFromDb || adminServices.find((s: any) => s.id === Number(service_id) && (s.status ?? 'active') !== 'inactive');
    console.log('Found service:', service);

    if (!service) {
      console.error('Service not found for ID:', service_id);
      return res.status(404).json({
        success: false,
        error: `Service not found for ID: ${service_id}`
      } as ApiResponse);
    }

    // Check if staff exists (support admin-managed team)
    console.log('Looking up staff with ID:', staff_id);
    const staffFromDb = db.getStaffById(Number(staff_id));
    const staffMember = staffFromDb || adminTeam.find((m: any) => m.id === Number(staff_id) && (m.status ?? 'active') !== 'inactive');
    console.log('Found staff member:', staffMember);

    if (!staffMember) {
      console.error('Staff member not found for ID:', staff_id);
      return res.status(404).json({
        success: false,
        error: `Staff member not found for ID: ${staff_id}`
      } as ApiResponse);
    }

    // Simply generate time slots from 9 AM to 6 PM (all available)
    const timeSlots: Array<{time: string, available: boolean}> = [];
    const startHour = 9;
    const endHour = 18;
    const slotDuration = 30; // 30-minute slots

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        // Convert to 12-hour format for frontend display
        const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
        const period = hour >= 12 ? 'PM' : 'AM';
        const time12h = `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;

        timeSlots.push({
          time: time12h,
          available: true
        });
      }
    }

    res.json({
      success: true,
      data: timeSlots
    } as ApiResponse);

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};
