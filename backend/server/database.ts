import { Service, Staff, Client, Booking, AdminNotification } from '@shared/types';

// In-memory database for demo purposes
// In production, you would use a real database like PostgreSQL or MongoDB
export class Database {
  private static instance: Database;
  
  public services: Service[] = [];
  public staff: Staff[] = [];
  public clients: Client[] = [];
  public bookings: Booking[] = [];
  public notifications: AdminNotification[] = [];
  
  private nextServiceId = 1;
  private nextStaffId = 1;
  private nextClientId = 1;
  private nextBookingId = 1;
  private nextNotificationId = 1;

  private constructor() {
    this.initializeSampleData();
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  private initializeSampleData() {
    // Sample services
    this.services = [
      {
        id: this.nextServiceId++,
        name: 'Hair Cut & Style',
        description: 'Professional haircut and styling for all hair types',
        duration_minutes: 60,
        price: 65.0,
        category: 'Hair',
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: this.nextServiceId++,
        name: 'Hair Coloring',
        description: 'Professional hair coloring including highlights and balayage',
        duration_minutes: 180,
        price: 120.0,
        category: 'Hair',
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: this.nextServiceId++,
        name: 'Facial Treatment',
        description: 'Rejuvenating facial treatment for healthy, glowing skin',
        duration_minutes: 75,
        price: 85.0,
        category: 'Skincare',
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: this.nextServiceId++,
        name: 'Spa Package',
        description: 'Complete wellness package with multiple treatments',
        duration_minutes: 180,
        price: 200.0,
        category: 'Spa',
        is_active: true,
        created_at: new Date().toISOString()
      }
    ];

    // Sample staff
    this.staff = [
      {
        id: this.nextStaffId++,
        name: 'Sarah Johnson',
        email: 'sarah@luxesalon.com',
        phone: '(555) 123-4567',
        role: 'Master Stylist & Owner',
        specialty: 'Hair Cutting & Styling',
        rating: 4.9,
        experience_years: 8,
        bio: 'Sarah founded Luxe Salon with a vision to create a space where beauty and wellness converge.',
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: this.nextStaffId++,
        name: 'Maria Garcia',
        email: 'maria@luxesalon.com',
        phone: '(555) 123-4568',
        role: 'Color Specialist',
        specialty: 'Hair Coloring & Balayage',
        rating: 4.8,
        experience_years: 6,
        bio: 'Maria is our color expert, known for her artistic approach to hair coloring.',
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: this.nextStaffId++,
        name: 'Emma Wilson',
        email: 'emma@luxesalon.com',
        phone: '(555) 123-4569',
        role: 'Facial Specialist',
        specialty: 'Skincare & Facial Treatments',
        rating: 4.9,
        experience_years: 5,
        bio: 'Emma brings expertise in advanced skincare treatments.',
        is_active: true,
        created_at: new Date().toISOString()
      },
      {
        id: this.nextStaffId++,
        name: 'Lisa Chen',
        email: 'lisa@luxesalon.com',
        phone: '(555) 123-4570',
        role: 'Spa Therapist',
        specialty: 'Massage & Wellness',
        rating: 5.0,
        experience_years: 7,
        bio: 'Lisa specializes in therapeutic massage and wellness treatments.',
        is_active: true,
        created_at: new Date().toISOString()
      }
    ];
  }

  // Service methods
  public getAllServices(): Service[] {
    return this.services.filter(s => s.is_active);
  }

  public getServiceById(id: number): Service | undefined {
    return this.services.find(s => s.id === id);
  }

  public createService(serviceData: Omit<Service, 'id' | 'created_at'>): Service {
    const service: Service = {
      ...serviceData,
      id: this.nextServiceId++,
      created_at: new Date().toISOString()
    };
    this.services.push(service);
    return service;
  }

  // Staff methods
  public getAllStaff(): Staff[] {
    return this.staff.filter(s => s.is_active);
  }

  public getStaffById(id: number): Staff | undefined {
    return this.staff.find(s => s.id === id);
  }

  public createStaff(staffData: Omit<Staff, 'id' | 'created_at'>): Staff {
    const staff: Staff = {
      ...staffData,
      id: this.nextStaffId++,
      created_at: new Date().toISOString()
    };
    this.staff.push(staff);
    return staff;
  }

  // Client methods
  public getAllClients(): Client[] {
    return this.clients;
  }

  public getClientById(id: number): Client | undefined {
    return this.clients.find(c => c.id === id);
  }

  public getClientByEmail(email: string): Client | undefined {
    return this.clients.find(c => c.email === email);
  }

  public getClientByPhone(phone: string): Client | undefined {
    return this.clients.find(c => c.phone === phone);
  }

  public createClient(clientData: Omit<Client, 'id' | 'created_at'>): Client {
    const client: Client = {
      ...clientData,
      id: this.nextClientId++,
      created_at: new Date().toISOString()
    };
    this.clients.push(client);
    return client;
  }

  // Booking methods
  public getAllBookings(): Booking[] {
    return this.bookings.map(booking => ({
      ...booking,
      client: this.getClientById(booking.client_id),
      service: this.getServiceById(booking.service_id),
      staff: this.getStaffById(booking.staff_id)
    }));
  }

  public getBookingById(id: number): Booking | undefined {
    const booking = this.bookings.find(b => b.id === id);
    if (!booking) return undefined;
    
    return {
      ...booking,
      client: this.getClientById(booking.client_id),
      service: this.getServiceById(booking.service_id),
      staff: this.getStaffById(booking.staff_id)
    };
  }

  public createBooking(bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at' | 'client' | 'service' | 'staff'>): Booking {
    const now = new Date().toISOString();
    const booking: Booking = {
      ...bookingData,
      id: this.nextBookingId++,
      created_at: now,
      updated_at: now
    };
    this.bookings.push(booking);
    
    return {
      ...booking,
      client: this.getClientById(booking.client_id),
      service: this.getServiceById(booking.service_id),
      staff: this.getStaffById(booking.staff_id)
    };
  }

  public getBookingsByDateRange(startDate: string, endDate: string): Booking[] {
    return this.bookings
      .filter(b => b.appointment_date >= startDate && b.appointment_date <= endDate)
      .map(booking => ({
        ...booking,
        client: this.getClientById(booking.client_id),
        service: this.getServiceById(booking.service_id),
        staff: this.getStaffById(booking.staff_id)
      }));
  }

  public getBookingsByClient(clientId: number): Booking[] {
    return this.bookings
      .filter(b => b.client_id === clientId)
      .map(booking => ({
        ...booking,
        client: this.getClientById(booking.client_id),
        service: this.getServiceById(booking.service_id),
        staff: this.getStaffById(booking.staff_id)
      }));
  }
}

export const db = Database.getInstance();
