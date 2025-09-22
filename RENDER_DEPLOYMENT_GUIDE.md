# Render Deployment Guide

This project is now configured for deployment on Render. Follow these steps to deploy your Luxe Salon booking application.

## Prerequisites

1. A Render account (sign up at https://render.com)
2. Git repository (GitHub, GitLab, or Bitbucket)
3. Your code pushed to the repository

## Deployment Steps

### 1. Connect Repository to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your Git repository
4. Select your repository and branch

### 2. Configure Service Settings

Use these settings in the Render dashboard:

- **Name**: `luxe-salon-app` (or your preferred name)
- **Environment**: `Node`
- **Region**: Choose closest to your users
- **Branch**: `main` (or your default branch)
- **Root Directory**: Leave empty (uses root)
- **Build Command**: `npm run build:render`
- **Start Command**: `npm run start`

### 3. Environment Variables

Set these environment variables in Render:

```
NODE_ENV=production
PING_MESSAGE=Hello from Render
```

To add environment variables:
1. Go to your service in Render Dashboard
2. Click on "Environment" tab
3. Add the variables above

### 4. Deploy

1. Click "Create Web Service"
2. Render will automatically build and deploy your project
3. You'll get a live URL once deployment is complete

## Project Structure for Render

- **Frontend**: React + Vite app built to `frontend/dist/`
- **Backend**: Express server built to `backend/dist/server/`
- **Static Files**: Served by Express server
- **API Routes**: Handled by Express server

## Build Process

The `npm run build:render` command:
1. Installs all dependencies (root, frontend, backend)
2. Builds the frontend React app to `frontend/dist/`
3. Builds the backend Express server to `backend/dist/server/`

## API Endpoints

The following API endpoints are available:

- `GET /api/ping` - Health check
- `GET /api/demo` - Demo endpoint
- `GET /api/services` - Get all services
- `GET /api/staff` - Get all staff members
- `GET /api/available-slots?date=YYYY-MM-DD&service_id=ID` - Get available time slots
- `GET /api/user-bookings?user_id=ID` - Get user bookings
- `POST /api/bookings` - Create new booking
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Get current user (requires Authorization header)
- `POST /api/auth/logout` - User logout
- `GET /api/auth/users` - Get all users (admin only)

### Admin Endpoints (Protected)

- `GET /api/admin/dashboard/stats` - Dashboard statistics
- `GET /api/admin/bookings` - All bookings
- `GET /api/admin/clients` - All clients
- `GET /api/admin/reports/revenue` - Revenue report
- Various CRUD endpoints for users, services, team, offers, and bookings

## CORS Configuration

All API endpoints are configured with CORS headers to allow cross-origin requests.

## Troubleshooting

### Build Issues

**Error: "Cannot find module '/opt/render/project/src/dist/server/node-build.mjs'"**
- This was fixed by updating the build process to properly create the server files
- The current configuration builds both frontend and backend correctly

**Error: "Command exited with 1"**
- Make sure the build command is set to `npm run build:render`
- Verify that all dependencies are installed correctly
- Check the build logs in Render dashboard

### Runtime Issues

**Error: "Cannot find module"**
- Ensure the build process completed successfully
- Check that the start command is `npm run start`
- Verify the file paths in the server configuration

**Frontend not loading**
- Check that the frontend build completed successfully
- Verify the static file serving configuration
- Ensure the frontend dist directory exists

### Common Solutions

1. **Clear Build Cache**: In Render dashboard, go to "Settings" → "Clear Build Cache" → "Clear Cache"
2. **Check Logs**: Review build and runtime logs in the Render dashboard
3. **Verify Environment Variables**: Ensure all required environment variables are set
4. **Test Locally**: Run `npm run build:render && npm run start` locally to verify

## Local Development

To run locally:

```bash
# Install dependencies
npm run install:all

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend at `http://localhost:3000`.

## Production Notes

- The project uses in-memory storage for demo purposes
- For production, replace with a proper database (PostgreSQL, MongoDB, etc.)
- Implement proper authentication and security measures
- Add input validation and error handling
- Consider rate limiting for API endpoints
- Set up proper logging and monitoring

## Render Configuration File

The project includes a `render.yaml` file for easy deployment configuration. You can use this file to deploy with a single command if you have the Render CLI installed.

## Health Check

The application includes a health check endpoint at `/api/ping` that Render can use to monitor the service status.

## Scaling

- Render automatically handles scaling based on traffic
- The free tier includes 750 hours per month
- Upgrade to paid plans for more resources and features