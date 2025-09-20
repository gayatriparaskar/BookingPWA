import { Request, Response } from 'express';

// Dummy data for all entities
let users = [
  {
    id: 1,
    full_name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '9876543210',
    role: 'user',
    status: 'active',
    created_at: '2024-01-15',
    last_visit: '2024-12-20',
    total_bookings: 5,
    total_spent: 450
  },
  {
    id: 2,
    full_name: 'Jane Smith',
    email: 'jane.smith@email.com',
    phone: '8765432109',
    role: 'user',
    status: 'active',
    created_at: '2024-02-10',
    last_visit: '2024-12-18',
    total_bookings: 8,
    total_spent: 720
  },
  {
    id: 3,
    full_name: 'Mike Johnson',
    email: 'mike.johnson@email.com',
    phone: '7654321098',
    role: 'user',
    status: 'inactive',
    created_at: '2024-03-05',
    last_visit: '2024-11-15',
    total_bookings: 3,
    total_spent: 290
  },
  {
    id: 4,
    full_name: 'Sarah Wilson',
    email: 'sarah.wilson@email.com',
    phone: '6543210987',
    role: 'user',
    status: 'active',
    created_at: '2024-04-20',
    last_visit: '2024-12-19',
    total_bookings: 12,
    total_spent: 980
  }
];

export let services = [
  {
    id: 1,
    name: 'Classic Hair Cut',
    category: 'Hair',
    description: 'Professional hair cutting and styling for all hair types',
    price: 65,
    duration_minutes: 60,
    status: 'active',
    image: 'https://images.pexels.com/photos/8468129/pexels-photo-8468129.jpeg',
    created_at: '2024-01-01'
  },
  {
    id: 2,
    name: 'Hair Coloring',
    category: 'Hair',
    description: 'Full hair coloring service with premium products',
    price: 120,
    duration_minutes: 180,
    status: 'active',
    image: 'https://images.pexels.com/photos/8468125/pexels-photo-8468125.jpeg',
    created_at: '2024-01-01'
  },
  {
    id: 3,
    name: 'Deep Cleansing Facial',
    category: 'Skincare',
    description: 'Rejuvenating facial treatment for all skin types',
    price: 85,
    duration_minutes: 90,
    status: 'active',
    image: 'https://images.pexels.com/photos/6663371/pexels-photo-6663371.jpeg',
    created_at: '2024-01-01'
  },
  {
    id: 4,
    name: 'Luxury Spa Package',
    category: 'Spa',
    description: 'Complete relaxation package including massage and aromatherapy',
    price: 200,
    duration_minutes: 240,
    status: 'active',
    image: 'https://images.pexels.com/photos/6187645/pexels-photo-6187645.jpeg',
    created_at: '2024-01-01'
  },
  {
    id: 5,
    name: 'Manicure & Pedicure',
    category: 'Nails',
    description: 'Complete nail care service with gel polish',
    price: 55,
    duration_minutes: 75,
    status: 'inactive',
    image: 'https://images.pexels.com/photos/6045539/pexels-photo-6045539.jpeg',
    created_at: '2024-01-01'
  }
];

export let team = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Senior Hair Stylist',
    email: 'sarah.johnson@luxesalon.com',
    phone: '9876543210',
    specialty: 'Hair cutting, coloring, and styling',
    experience_years: 8,
    rating: 4.9,
    status: 'active',
    bio: 'Expert in modern hair techniques with a passion for creating stunning transformations.',
    image: 'https://images.pexels.com/photos/7440131/pexels-photo-7440131.jpeg',
    schedule: 'Mon-Fri: 9AM-6PM',
    total_clients: 150,
    created_at: '2024-01-01'
  },
  {
    id: 2,
    name: 'Maria Garcia',
    role: 'Spa Specialist',
    email: 'maria.garcia@luxesalon.com',
    phone: '8765432109',
    specialty: 'Facial treatments and skincare',
    experience_years: 6,
    rating: 4.8,
    status: 'active',
    bio: 'Certified esthetician specializing in anti-aging and therapeutic treatments.',
    image: 'https://images.pexels.com/photos/5128220/pexels-photo-5128220.jpeg',
    schedule: 'Tue-Sat: 10AM-7PM',
    total_clients: 120,
    created_at: '2024-01-01'
  },
  {
    id: 3,
    name: 'Emma Wilson',
    role: 'Nail Artist',
    email: 'emma.wilson@luxesalon.com',
    phone: '7654321098',
    specialty: 'Nail art and design',
    experience_years: 4,
    rating: 4.7,
    status: 'active',
    bio: 'Creative nail artist with expertise in intricate designs and nail health.',
    image: 'https://images.pexels.com/photos/5240817/pexels-photo-5240817.jpeg',
    schedule: 'Wed-Sun: 11AM-8PM',
    total_clients: 95,
    created_at: '2024-01-01'
  },
  {
    id: 4,
    name: 'Lisa Chen',
    role: 'Massage Therapist',
    email: 'lisa.chen@luxesalon.com',
    phone: '6543210987',
    specialty: 'Therapeutic and relaxation massage',
    experience_years: 10,
    rating: 4.9,
    status: 'inactive',
    bio: 'Licensed massage therapist specializing in stress relief and muscle therapy.',
    image: 'https://images.pexels.com/photos/3998427/pexels-photo-3998427.jpeg',
    schedule: 'Mon-Thu: 8AM-5PM',
    total_clients: 200,
    created_at: '2024-01-01'
  }
];

export let bookings = [
  {
    id: 1,
    client_name: 'John Doe',
    client_email: 'john.doe@email.com',
    client_phone: '9876543210',
    service_name: 'Classic Hair Cut',
    staff_name: 'Sarah Johnson',
    appointment_date: '2024-12-25',
    appointment_time: '10:00 AM',
    duration_minutes: 60,
    total_price: 65,
    status: 'pending',
    notes: 'First time client',
    created_at: '2024-12-24T08:30:00Z',
    updated_at: '2024-12-24T08:30:00Z'
  },
  {
    id: 2,
    client_name: 'Jane Smith',
    client_email: 'jane.smith@email.com',
    client_phone: '8765432109',
    service_name: 'Hair Coloring',
    staff_name: 'Sarah Johnson',
    appointment_date: '2024-12-26',
    appointment_time: '2:00 PM',
    duration_minutes: 180,
    total_price: 120,
    status: 'confirmed',
    notes: 'Regular client, prefers platinum blonde',
    created_at: '2024-12-23T14:20:00Z',
    updated_at: '2024-12-24T09:15:00Z'
  },
  {
    id: 3,
    client_name: 'Mike Johnson',
    client_email: 'mike.johnson@email.com',
    client_phone: '7654321098',
    service_name: 'Deep Cleansing Facial',
    staff_name: 'Maria Garcia',
    appointment_date: '2024-12-27',
    appointment_time: '11:30 AM',
    duration_minutes: 90,
    total_price: 85,
    status: 'pending',
    notes: 'Sensitive skin, use gentle products',
    created_at: '2024-12-24T10:45:00Z',
    updated_at: '2024-12-24T10:45:00Z'
  },
  {
    id: 4,
    client_name: 'Sarah Wilson',
    client_email: 'sarah.wilson@email.com',
    client_phone: '6543210987',
    service_name: 'Luxury Spa Package',
    staff_name: 'Lisa Chen',
    appointment_date: '2024-12-28',
    appointment_time: '9:00 AM',
    duration_minutes: 240,
    total_price: 200,
    status: 'rejected',
    notes: 'Schedule conflict',
    created_at: '2024-12-22T16:30:00Z',
    updated_at: '2024-12-23T11:20:00Z'
  },
  {
    id: 5,
    client_name: 'Emily Brown',
    client_email: 'emily.brown@email.com',
    client_phone: '5432109876',
    service_name: 'Manicure & Pedicure',
    staff_name: 'Emma Wilson',
    appointment_date: '2024-12-29',
    appointment_time: '3:30 PM',
    duration_minutes: 75,
    total_price: 55,
    status: 'pending',
    notes: 'Gel polish requested',
    created_at: '2024-12-24T12:15:00Z',
    updated_at: '2024-12-24T12:15:00Z'
  },
  {
    id: 6,
    client_name: 'Test User',
    client_email: 'test@example.com',
    client_phone: '1234567890',
    service_name: 'Classic Hair Cut',
    staff_name: 'Sarah Johnson',
    appointment_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Tomorrow
    appointment_time: '2:00 PM',
    duration_minutes: 60,
    total_price: 65,
    status: 'pending',
    notes: 'Test booking for end-to-end verification',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

let offers = [
  {
    id: 1,
    title: 'New Client Special',
    description: 'Get 20% off your first visit to Luxe Salon',
    discount_percentage: 20,
    discount_amount: 0,
    code: 'WELCOME20',
    status: 'active',
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    applicable_services: 'All services',
    usage_limit: 1,
    used_count: 45,
    created_at: '2024-01-01'
  },
  {
    id: 2,
    title: 'Spa Package Deal',
    description: 'Book any 2 spa services and get $50 off',
    discount_percentage: 0,
    discount_amount: 50,
    code: 'SPA50',
    status: 'active',
    start_date: '2024-01-15',
    end_date: '2024-03-15',
    applicable_services: 'Spa services only',
    usage_limit: 5,
    used_count: 12,
    created_at: '2024-01-15'
  },
  {
    id: 3,
    title: 'Hair Color Special',
    description: '15% off all hair coloring services',
    discount_percentage: 15,
    discount_amount: 0,
    code: 'COLOR15',
    status: 'inactive',
    start_date: '2024-02-01',
    end_date: '2024-02-29',
    applicable_services: 'Hair coloring only',
    usage_limit: 3,
    used_count: 8,
    created_at: '2024-02-01'
  },
  {
    id: 4,
    title: 'Weekend Special',
    description: 'Saturday and Sunday bookings get 10% off',
    discount_percentage: 10,
    discount_amount: 0,
    code: 'WEEKEND10',
    status: 'active',
    start_date: '2024-01-01',
    end_date: '2024-12-31',
    applicable_services: 'All services',
    usage_limit: 10,
    used_count: 23,
    created_at: '2024-01-01'
  }
];

// Helper function to get next ID
const getNextId = (array: any[]) => Math.max(...array.map(item => item.id), 0) + 1;

// USERS CRUD OPERATIONS
export const getUsers = (req: Request, res: Response) => {
  res.json({ success: true, data: users });
};

export const createUser = (req: Request, res: Response) => {
  const newUser = {
    id: getNextId(users),
    ...req.body,
    created_at: new Date().toISOString().split('T')[0],
    total_bookings: 0,
    total_spent: 0
  };
  users.push(newUser);
  res.json({ success: true, data: newUser });
};

export const updateUser = (req: Request, res: Response) => {
  const { id } = req.params;
  const userIndex = users.findIndex(user => user.id === parseInt(id));
  
  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  users[userIndex] = { ...users[userIndex], ...req.body };
  res.json({ success: true, data: users[userIndex] });
};

export const deleteUser = (req: Request, res: Response) => {
  const { id } = req.params;
  const userIndex = users.findIndex(user => user.id === parseInt(id));
  
  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: 'User not found' });
  }
  
  const deletedUser = users.splice(userIndex, 1)[0];
  res.json({ success: true, data: deletedUser });
};

// SERVICES CRUD OPERATIONS
export const getServices = (req: Request, res: Response) => {
  res.json({ success: true, data: services });
};

export const createService = (req: Request, res: Response) => {
  const newService = {
    id: getNextId(services),
    ...req.body,
    created_at: new Date().toISOString().split('T')[0]
  };
  services.push(newService);
  res.json({ success: true, data: newService });
};

export const updateService = (req: Request, res: Response) => {
  const { id } = req.params;
  const serviceIndex = services.findIndex(service => service.id === parseInt(id));
  
  if (serviceIndex === -1) {
    return res.status(404).json({ success: false, message: 'Service not found' });
  }
  
  services[serviceIndex] = { ...services[serviceIndex], ...req.body };
  res.json({ success: true, data: services[serviceIndex] });
};

export const deleteService = (req: Request, res: Response) => {
  const { id } = req.params;
  const serviceIndex = services.findIndex(service => service.id === parseInt(id));
  
  if (serviceIndex === -1) {
    return res.status(404).json({ success: false, message: 'Service not found' });
  }
  
  const deletedService = services.splice(serviceIndex, 1)[0];
  res.json({ success: true, data: deletedService });
};

// TEAM CRUD OPERATIONS
export const getTeam = (req: Request, res: Response) => {
  res.json({ success: true, data: team });
};

export const createTeamMember = (req: Request, res: Response) => {
  const newMember = {
    id: getNextId(team),
    ...req.body,
    created_at: new Date().toISOString().split('T')[0],
    total_clients: 0
  };
  team.push(newMember);
  res.json({ success: true, data: newMember });
};

export const updateTeamMember = (req: Request, res: Response) => {
  const { id } = req.params;
  const memberIndex = team.findIndex(member => member.id === parseInt(id));
  
  if (memberIndex === -1) {
    return res.status(404).json({ success: false, message: 'Team member not found' });
  }
  
  team[memberIndex] = { ...team[memberIndex], ...req.body };
  res.json({ success: true, data: team[memberIndex] });
};

export const deleteTeamMember = (req: Request, res: Response) => {
  const { id } = req.params;
  const memberIndex = team.findIndex(member => member.id === parseInt(id));
  
  if (memberIndex === -1) {
    return res.status(404).json({ success: false, message: 'Team member not found' });
  }
  
  const deletedMember = team.splice(memberIndex, 1)[0];
  res.json({ success: true, data: deletedMember });
};

// OFFERS CRUD OPERATIONS
export const getOffers = (req: Request, res: Response) => {
  res.json({ success: true, data: offers });
};

export const createOffer = (req: Request, res: Response) => {
  const newOffer = {
    id: getNextId(offers),
    ...req.body,
    created_at: new Date().toISOString().split('T')[0],
    used_count: 0
  };
  offers.push(newOffer);
  res.json({ success: true, data: newOffer });
};

export const updateOffer = (req: Request, res: Response) => {
  const { id } = req.params;
  const offerIndex = offers.findIndex(offer => offer.id === parseInt(id));
  
  if (offerIndex === -1) {
    return res.status(404).json({ success: false, message: 'Offer not found' });
  }
  
  offers[offerIndex] = { ...offers[offerIndex], ...req.body };
  res.json({ success: true, data: offers[offerIndex] });
};

export const deleteOffer = (req: Request, res: Response) => {
  const { id } = req.params;
  const offerIndex = offers.findIndex(offer => offer.id === parseInt(id));
  
  if (offerIndex === -1) {
    return res.status(404).json({ success: false, message: 'Offer not found' });
  }
  
  const deletedOffer = offers.splice(offerIndex, 1)[0];
  res.json({ success: true, data: deletedOffer });
};

// BOOKINGS CRUD OPERATIONS
export const getBookings = (req: Request, res: Response) => {
  res.json({ success: true, data: bookings });
};

export const updateBookingStatus = (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const bookingIndex = bookings.findIndex(booking => booking.id === parseInt(id));

  if (bookingIndex === -1) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  bookings[bookingIndex] = {
    ...bookings[bookingIndex],
    status,
    notes: notes || bookings[bookingIndex].notes,
    updated_at: new Date().toISOString()
  };

  res.json({ success: true, data: bookings[bookingIndex] });
};

export const createBooking = (req: Request, res: Response) => {
  const { staff_name, appointment_date, appointment_time, duration_minutes } = req.body;

  // Check for slot conflicts
  const conflictingBookings = bookings.filter(booking => {
    if (booking.staff_name !== staff_name || booking.appointment_date !== appointment_date) {
      return false;
    }

    // Convert times to minutes for comparison
    const existingStart = convertTimeToMinutes(booking.appointment_time);
    const existingEnd = existingStart + (booking.duration_minutes || 60);
    const newStart = convertTimeToMinutes(appointment_time);
    const newEnd = newStart + (duration_minutes || 60);

    // Check for overlap
    return (newStart < existingEnd && newEnd > existingStart) &&
           (booking.status === 'confirmed' || booking.status === 'pending');
  });

  if (conflictingBookings.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'This time slot is already booked. Please choose a different time.',
      conflictingBookings
    });
  }

  const newBooking = {
    id: getNextId(bookings),
    ...req.body,
    status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  bookings.push(newBooking);
  res.json({ success: true, data: newBooking });
};

// Helper function to convert time string to minutes
const convertTimeToMinutes = (timeString: string) => {
  const [time, period] = timeString.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  let totalMinutes = hours * 60 + minutes;

  if (period === 'PM' && hours !== 12) {
    totalMinutes += 12 * 60;
  } else if (period === 'AM' && hours === 12) {
    totalMinutes -= 12 * 60;
  }

  return totalMinutes;
};

export const deleteBooking = (req: Request, res: Response) => {
  const { id } = req.params;
  const bookingIndex = bookings.findIndex(booking => booking.id === parseInt(id));

  if (bookingIndex === -1) {
    return res.status(404).json({ success: false, message: 'Booking not found' });
  }

  const deletedBooking = bookings.splice(bookingIndex, 1)[0];
  res.json({ success: true, data: deletedBooking });
};

// Get pending bookings for real-time notifications
export const getPendingBookings = (req: Request, res: Response) => {
  const pendingBookings = bookings.filter(booking => booking.status === 'pending');
  res.json({ success: true, data: pendingBookings, count: pendingBookings.length });
};

// Get available slots for a staff member on a specific date
export const getAvailableSlots = (req: Request, res: Response) => {
  const { staff_name, appointment_date, duration = 60 } = req.query;

  if (!staff_name || !appointment_date) {
    return res.status(400).json({
      success: false,
      message: 'Staff name and appointment date are required'
    });
  }

  // Get existing bookings for this staff member on this date
  const existingBookings = bookings.filter(booking =>
    booking.staff_name === staff_name &&
    booking.appointment_date === appointment_date &&
    (booking.status === 'confirmed' || booking.status === 'pending')
  );

  // Generate available time slots (9 AM to 6 PM)
  const availableSlots = [];
  const startHour = 9; // 9 AM
  const endHour = 18; // 6 PM
  const slotDuration = parseInt(duration as string);

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) { // 30-minute intervals
      const slotTime = `${hour > 12 ? hour - 12 : hour === 0 ? 12 : hour}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
      const slotStart = convertTimeToMinutes(slotTime);
      const slotEnd = slotStart + slotDuration;

      // Check if this slot conflicts with existing bookings
      const hasConflict = existingBookings.some(booking => {
        const existingStart = convertTimeToMinutes(booking.appointment_time);
        const existingEnd = existingStart + (booking.duration_minutes || 60);
        return slotStart < existingEnd && slotEnd > existingStart;
      });

      if (!hasConflict && slotEnd <= endHour * 60) { // Don't go past business hours
        availableSlots.push({
          time: slotTime,
          available: true
        });
      }
    }
  }

  res.json({ success: true, data: availableSlots });
};
