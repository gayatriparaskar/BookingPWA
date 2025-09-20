import { RequestHandler } from "express";
import { db } from "../database";
import { DashboardStats, RevenueReport, ApiResponse } from "@shared/types";

export const getDashboardStats: RequestHandler = (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const thisWeek = new Date();
    thisWeek.setDate(thisWeek.getDate() - thisWeek.getDay());
    const weekStart = thisWeek.toISOString().split('T')[0];
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    const monthStart = thisMonth.toISOString().split('T')[0];

    const allBookings = db.getAllBookings();

    // Today's bookings
    const todayBookings = allBookings.filter(
      b => b.appointment_date === today && b.status === 'confirmed'
    ).length;

    // This week's bookings
    const weekBookings = allBookings.filter(
      b => b.appointment_date >= weekStart && b.appointment_date <= today && b.status === 'confirmed'
    ).length;

    // This month's bookings
    const monthBookings = allBookings.filter(
      b => b.appointment_date >= monthStart && b.status === 'confirmed'
    ).length;

    // Month revenue
    const monthRevenue = allBookings
      .filter(b => b.appointment_date >= monthStart && ['confirmed', 'completed'].includes(b.status))
      .reduce((sum, b) => sum + b.total_price, 0);

    // Total clients
    const totalClients = db.getAllClients().length;

    // Active staff
    const activeStaff = db.getAllStaff().length;

    // Upcoming bookings (next 7 days)
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextWeekStr = nextWeek.toISOString().split('T')[0];
    
    const upcomingBookings = allBookings
      .filter(b => b.appointment_date >= today && b.appointment_date <= nextWeekStr && b.status === 'confirmed')
      .sort((a, b) => a.appointment_date.localeCompare(b.appointment_date) || a.appointment_time.localeCompare(b.appointment_time))
      .slice(0, 10);

    const stats: DashboardStats = {
      today_bookings: todayBookings,
      week_bookings: weekBookings,
      month_bookings: monthBookings,
      month_revenue: Number(monthRevenue.toFixed(2)),
      total_clients: totalClients,
      active_staff: activeStaff,
      unread_notifications: 0
    };

    res.json({
      success: true,
      data: {
        stats,
        upcoming_bookings: upcomingBookings
      }
    } as ApiResponse);

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

export const getAllBookings: RequestHandler = (req, res) => {
  try {
    const { status, date_from, date_to } = req.query;
    
    let bookings = db.getAllBookings();

    // Filter by status
    if (status && typeof status === 'string') {
      bookings = bookings.filter(b => b.status === status);
    }

    // Filter by date range
    if (date_from && typeof date_from === 'string') {
      bookings = bookings.filter(b => b.appointment_date >= date_from);
    }
    if (date_to && typeof date_to === 'string') {
      bookings = bookings.filter(b => b.appointment_date <= date_to);
    }

    // Sort by date and time
    bookings.sort((a, b) => 
      a.appointment_date.localeCompare(b.appointment_date) || 
      a.appointment_time.localeCompare(b.appointment_time)
    );

    res.json({
      success: true,
      data: bookings
    } as ApiResponse);

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

export const getAllClients: RequestHandler = (req, res) => {
  try {
    const { search } = req.query;
    
    let clients = db.getAllClients();

    // Filter by search term
    if (search && typeof search === 'string') {
      const searchLower = search.toLowerCase();
      clients = clients.filter(c => 
        c.full_name.toLowerCase().includes(searchLower) ||
        c.email.toLowerCase().includes(searchLower) ||
        c.phone.includes(search)
      );
    }

    // Sort by name
    clients.sort((a, b) => a.full_name.localeCompare(b.full_name));

    res.json({
      success: true,
      data: clients
    } as ApiResponse);

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

export const getClient: RequestHandler = (req, res) => {
  try {
    const clientId = parseInt(req.params.client_id);
    
    const client = db.getClientById(clientId);
    if (!client) {
      return res.status(404).json({
        success: false,
        error: 'Client not found'
      } as ApiResponse);
    }

    const bookings = db.getBookingsByClient(clientId);

    res.json({
      success: true,
      data: {
        client,
        bookings
      }
    } as ApiResponse);

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};

export const getRevenueReport: RequestHandler = (req, res) => {
  try {
    const { date_from, date_to } = req.query;
    
    if (!date_from || !date_to) {
      return res.status(400).json({
        success: false,
        error: 'Both date_from and date_to parameters are required'
      } as ApiResponse);
    }

    const bookings = db.getBookingsByDateRange(date_from as string, date_to as string)
      .filter(b => ['confirmed', 'completed'].includes(b.status));

    const totalRevenue = bookings.reduce((sum, b) => sum + b.total_price, 0);
    const totalBookings = bookings.length;

    // Group by service
    const serviceBreakdown: Record<string, { revenue: number; bookings: number }> = {};
    for (const booking of bookings) {
      const serviceName = booking.service?.name || 'Unknown';
      if (!serviceBreakdown[serviceName]) {
        serviceBreakdown[serviceName] = { revenue: 0, bookings: 0 };
      }
      serviceBreakdown[serviceName].revenue += booking.total_price;
      serviceBreakdown[serviceName].bookings += 1;
    }

    // Group by staff
    const staffBreakdown: Record<string, { revenue: number; bookings: number }> = {};
    for (const booking of bookings) {
      const staffName = booking.staff?.name || 'Unknown';
      if (!staffBreakdown[staffName]) {
        staffBreakdown[staffName] = { revenue: 0, bookings: 0 };
      }
      staffBreakdown[staffName].revenue += booking.total_price;
      staffBreakdown[staffName].bookings += 1;
    }

    const report: RevenueReport = {
      date_from: date_from as string,
      date_to: date_to as string,
      total_revenue: Number(totalRevenue.toFixed(2)),
      total_bookings: totalBookings,
      average_booking_value: Number((totalRevenue / (totalBookings || 1)).toFixed(2)),
      service_breakdown: serviceBreakdown,
      staff_breakdown: staffBreakdown
    };

    res.json({
      success: true,
      data: report
    } as ApiResponse);

  } catch (error) {
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    } as ApiResponse);
  }
};
