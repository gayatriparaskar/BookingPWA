import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { getAllServices, getAllStaff, createBooking, getUserBookings, getAvailableSlots as getBookingSlots } from "./routes/booking";
import { getDashboardStats, getAllBookings, getAllClients, getClient, getRevenueReport } from "./routes/admin";
import { login, signup, getCurrentUser, logout, getAllUsers, authenticateToken } from "./routes/auth";
import {
  getUsers, createUser, updateUser, deleteUser,
  getServices, createService, updateService, deleteService,
  getTeam, createTeamMember, updateTeamMember, deleteTeamMember,
  getOffers, createOffer, updateOffer, deleteOffer,
  getBookings, updateBookingStatus, createBooking as createAdminBooking, deleteBooking, getPendingBookings, getAvailableSlots as getAdminSlots
} from "./routes/admin-crud";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/login", login);
  app.post("/api/auth/signup", signup);
  app.post("/api/auth/logout", logout);
  app.get("/api/auth/me", authenticateToken, getCurrentUser);
  app.get("/api/auth/users", authenticateToken, getAllUsers);

  // Booking routes
  app.get("/api/services", getAllServices);
  app.get("/api/staff", getAllStaff);
  app.post("/api/bookings", createBooking);
  app.get("/api/user-bookings", getUserBookings);
  app.get("/api/available-slots", getBookingSlots);

  // Admin routes (protected)
  app.get("/api/admin/dashboard/stats", authenticateToken, getDashboardStats);
  app.get("/api/admin/bookings", authenticateToken, getAllBookings);
  app.get("/api/admin/clients", authenticateToken, getAllClients);
  app.get("/api/admin/clients/:client_id", authenticateToken, getClient);
  app.get("/api/admin/reports/revenue", authenticateToken, getRevenueReport);

  // Admin CRUD routes (protected)
  // Users
  app.get("/api/admin/users", authenticateToken, getUsers);
  app.post("/api/admin/users", authenticateToken, createUser);
  app.put("/api/admin/users/:id", authenticateToken, updateUser);
  app.delete("/api/admin/users/:id", authenticateToken, deleteUser);

  // Services
  app.get("/api/admin/services", authenticateToken, getServices);
  app.post("/api/admin/services", authenticateToken, createService);
  app.put("/api/admin/services/:id", authenticateToken, updateService);
  app.delete("/api/admin/services/:id", authenticateToken, deleteService);

  // Team
  app.get("/api/admin/team", authenticateToken, getTeam);
  app.post("/api/admin/team", authenticateToken, createTeamMember);
  app.put("/api/admin/team/:id", authenticateToken, updateTeamMember);
  app.delete("/api/admin/team/:id", authenticateToken, deleteTeamMember);

  // Offers
  app.get("/api/admin/offers", authenticateToken, getOffers);
  app.post("/api/admin/offers", authenticateToken, createOffer);
  app.put("/api/admin/offers/:id", authenticateToken, updateOffer);
  app.delete("/api/admin/offers/:id", authenticateToken, deleteOffer);

  // Booking Management
  app.get("/api/admin/bookings-manage", authenticateToken, getBookings);
  app.put("/api/admin/bookings/:id/status", authenticateToken, updateBookingStatus);
  app.post("/api/admin/bookings-manage", authenticateToken, createAdminBooking);
  app.delete("/api/admin/bookings-manage/:id", authenticateToken, deleteBooking);
  app.get("/api/admin/pending-bookings", authenticateToken, getPendingBookings);
  app.get("/api/admin/available-slots", authenticateToken, getAdminSlots);

  return app;
}
