# Vercel Deployment Guide

This project is now ready for deployment on Vercel. Follow these steps to deploy:

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. Git repository (GitHub, GitLab, or Bitbucket)

## Deployment Steps

### 1. Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your Git repository
4. Vercel will automatically detect the project structure

### 2. Configure Build Settings

The project is already configured with the correct settings in `vercel.json`:

- **Build Command**: `cd frontend && npm run build`
- **Output Directory**: `frontend/dist`
- **Functions Directory**: `api/` (automatically detected)

### 3. Environment Variables

Set these environment variables in your Vercel project settings:

```
NODE_ENV=production
PING_MESSAGE=Hello from Vercel
```

To add environment variables:
1. Go to your project in Vercel Dashboard
2. Click on "Settings" tab
3. Click on "Environment Variables"
4. Add the variables above

### 4. Deploy

1. Click "Deploy" button
2. Vercel will automatically build and deploy your project
3. You'll get a live URL once deployment is complete

## Project Structure

- **Frontend**: React + Vite app in `frontend/` directory
- **API**: Serverless functions in `api/` directory
- **Build Output**: `frontend/dist/` directory

## API Endpoints

The following API endpoints are available:

- `GET /api/services` - Get all services
- `GET /api/staff` - Get all staff members
- `GET /api/available-slots?date=YYYY-MM-DD&service_id=ID` - Get available time slots
- `GET /api/bookings?user_id=ID` - Get user bookings
- `POST /api/bookings` - Create new booking
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Get current user (requires Authorization header)
- `GET /api/demo` - Demo endpoint
- `GET /api/ping` - Health check

## CORS Configuration

All API endpoints are configured with CORS headers to allow cross-origin requests from the frontend.

## Troubleshooting

### Build Issues

If you encounter build issues:

1. Check that all dependencies are installed
2. Ensure TypeScript compilation is successful
3. Verify that the frontend build completes without errors

### API Issues

If API endpoints are not working:

1. Check the Vercel function logs in the dashboard
2. Verify that all API files are in the `api/` directory
3. Ensure proper CORS headers are set

### Environment Variables

If environment variables are not working:

1. Check that variables are set in Vercel project settings
2. Ensure variable names match exactly (case-sensitive)
3. Redeploy after adding new environment variables

## Local Development

To run locally:

```bash
# Install dependencies
npm run install:all

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173` and the API will be available at `http://localhost:3000`.

## Production Notes

- The project uses in-memory storage for demo purposes
- For production, replace with a proper database
- Implement proper authentication and security measures
- Add input validation and error handling
- Consider rate limiting for API endpoints