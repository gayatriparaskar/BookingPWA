# Vercel Deployment Guide

This guide explains how to deploy your BookingPWA application to Vercel.

## Changes Made for Vercel

### 1. Updated Build Configuration
- Modified `vite.config.ts` to output to `../dist` instead of `../dist/spa`
- Added `build:vercel` script in `package.json`
- Created `vercel.json` configuration file

### 2. API Functions
Created Vercel serverless functions in the `api/` directory:
- `api/ping.ts` - Simple ping endpoint
- `api/demo.ts` - Demo endpoint
- `api/services.ts` - Get all services
- `api/staff.ts` - Get all staff members
- `api/bookings.ts` - Create and get bookings
- `api/available-slots.ts` - Get available time slots
- `api/auth/login.ts` - User login
- `api/auth/signup.ts` - User registration
- `api/auth/me.ts` - Get current user

### 3. Vercel Configuration
The `vercel.json` file includes:
- Build command: `npm run build:vercel`
- Output directory: `dist`
- API routing for serverless functions
- SPA routing for React app

## Deployment Steps

### Option 1: Deploy via Vercel CLI
1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

### Option 2: Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Vercel will automatically detect the configuration
4. Click "Deploy"

## Environment Variables
If you need to set environment variables:
1. Go to your project dashboard on Vercel
2. Navigate to Settings > Environment Variables
3. Add any required variables (e.g., `PING_MESSAGE`)

## Important Notes

### Database
The current implementation uses in-memory storage for demo purposes. For production:
1. Replace with a real database (PostgreSQL, MongoDB, etc.)
2. Update the API functions to use database connections
3. Consider using Vercel's database integrations

### Authentication
The current auth system uses simple token storage. For production:
1. Implement proper JWT tokens with secrets
2. Use secure password hashing (bcrypt)
3. Add token expiration and refresh logic

### API Limitations
- Vercel serverless functions have execution time limits
- Consider upgrading to Vercel Pro for longer execution times
- For complex operations, consider using Vercel's Edge Functions

## Troubleshooting

### Build Errors
- Ensure all dependencies are installed: `npm run install:all`
- Check that the build command works locally: `npm run build:vercel`

### API Errors
- Check Vercel function logs in the dashboard
- Ensure all API routes are properly configured in `vercel.json`

### Routing Issues
- The SPA routing should work with the current configuration
- If you have issues, check the `routes` section in `vercel.json`

## Development vs Production

### Development
- Uses Express server with hot reload
- Run with: `npm run dev`

### Production (Vercel)
- Uses serverless functions
- Deploy with: `vercel` or via dashboard

The application will work the same way in both environments, but the backend implementation differs.
