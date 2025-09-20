import type { VercelRequest, VercelResponse } from '@vercel/node';

// Mock bookings data
const bookings = [
  {
    id: '1',
    user_id: '2',
    service_id: '1',
    staff_id: '1',
    date: '2024-01-15',
    time: '10:00',
    status: 'confirmed',
    notes: 'Regular haircut',
    created_at: new Date().toISOString()
  },
  {
    id: '2',
    user_id: '2',
    service_id: '2',
    staff_id: '2',
    date: '2024-01-20',
    time: '14:00',
    status: 'pending',
    notes: 'Deep cleansing facial',
    created_at: new Date().toISOString()
  }
];

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    // Get user bookings
    try {
      const { user_id } = req.query;
      
      if (!user_id) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      const userBookings = bookings.filter(booking => booking.user_id === user_id);
      
      res.json({
        success: true,
        data: userBookings
      });
    } catch (error) {
      console.error('Get bookings error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else if (req.method === 'POST') {
    // Create new booking
    try {
      const { user_id, service_id, staff_id, date, time, notes } = req.body;

      if (!user_id || !service_id || !staff_id || !date || !time) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields'
        });
      }

      const newBooking = {
        id: (bookings.length + 1).toString(),
        user_id,
        service_id,
        staff_id,
        date,
        time,
        status: 'pending',
        notes: notes || '',
        created_at: new Date().toISOString()
      };

      bookings.push(newBooking);

      res.status(201).json({
        success: true,
        data: newBooking
      });
    } catch (error) {
      console.error('Create booking error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
