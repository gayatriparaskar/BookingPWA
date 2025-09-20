# Luxe Salon - Booking System

A modern, fully responsive salon booking system with React frontend and Node.js backend.

## 🏗️ Project Structure

```
luxe-salon/
├── frontend/                 # React TypeScript Frontend
│   ├── components/          # Reusable UI components
│   ├── pages/              # React pages/routes
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── netlify/            # Netlify deployment config
│   ├── public/             # Static assets
│   ├── package.json        # Frontend dependencies
│   ├── vite.config.ts      # Frontend build config
│   └── tsconfig.json       # Frontend TypeScript config
│
├── backend/                 # Node.js Backend
│   ├── server/             # Express server
│   │   ├── routes/         # API route handlers
│   │   ├── database.ts     # Database layer
│   │   ├── index.ts        # Server entry point
│   │   └── node-build.ts   # Production build entry
│   ├── shared/             # Shared types & utilities
│   ├── package.json        # Backend dependencies
│   └── tsconfig.json       # Backend TypeScript config
│
├── dist/                   # Build output
│   ├── spa/               # Frontend build
│   └── server/            # Backend build
│
├── package.json            # Root package.json (monorepo)
├── vite.config.ts          # Main Vite config
├── vite.config.server.ts   # Server build config
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd luxe-salon
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

### Development

**Start both frontend and backend in development mode:**
```bash
npm run dev
```

This will start:
- Frontend dev server on `http://localhost:8080`
- Backend API server on `http://localhost:3000`

**Or run them separately:**
```bash
# Frontend only
npm run dev:frontend

# Backend only  
npm run dev:backend
```

### Building for Production

**Build both frontend and backend:**
```bash
npm run build
```

**Or build them separately:**
```bash
# Frontend only
npm run build:frontend

# Backend only
npm run build:backend
```

### Starting Production Server
```bash
npm start
```

## 📱 Features

### Frontend Features
- **Fully Mobile Responsive** - Works on all device sizes
- **Modern React 18** with TypeScript
- **Framer Motion Animations** - Smooth, professional animations
- **Mobile Navigation** - Hamburger menu with smooth transitions
- **Service Booking** - Individual service and staff member booking
- **Gallery System** - Category-based image gallery with lightbox
- **Offers System** - Dedicated offers page with promotional deals
- **Real-time Updates** - Live booking availability
- **Admin Dashboard** - Booking management interface

### Backend Features
- **Express.js API** - RESTful API endpoints
- **TypeScript** - Full type safety
- **In-memory Database** - Sample data with CRUD operations
- **CORS Enabled** - Cross-origin resource sharing
- **Booking Management** - Time slot availability system
- **Admin Operations** - Statistics and management endpoints

## 🎨 Design System

- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide Icons** - Beautiful, consistent icons
- **Responsive Design** - Mobile-first approach
- **Glass Morphism** - Modern backdrop blur effects
- **Gradient Themes** - Rose, pink, and purple color schemes

## 📦 Key Dependencies

### Frontend
- React 18 + TypeScript
- Framer Motion (animations)
- React Router 6 (routing)
- Radix UI (components)
- Tailwind CSS (styling)
- Tanstack Query (state management)

### Backend
- Express.js (server)
- TypeScript (type safety)
- CORS (cross-origin requests)

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=3000
```

### Netlify Deployment
The frontend is configured for Netlify deployment with:
- Build command: `npm run build:frontend`
- Publish directory: `dist/spa`
- Redirects configured for SPA routing

## 📚 API Endpoints

### Services
- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get service by ID

### Staff
- `GET /api/staff` - Get all staff members
- `GET /api/staff/:id` - Get staff member by ID

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking
- `GET /api/available-slots` - Get available time slots

### Admin
- `GET /api/admin/stats` - Get booking statistics
- `GET /api/admin/bookings` - Get bookings for admin
- `GET /api/admin/clients` - Get client directory

## 🔀 Routing

### Frontend Routes
- `/` - Homepage with hero, services, team, gallery
- `/offers` - Dedicated offers and promotions page
- `/booking` - Service and staff booking interface
- `/gallery` - Photo gallery with category filtering
- `/my-bookings` - User's booking history
- `/admin` - Admin dashboard

## 🎯 Mobile Responsiveness

The application is fully responsive with:
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Mobile Navigation**: Hamburger menu with smooth animations
- **Responsive Grids**: Adaptive layouts for all screen sizes
- **Touch-Friendly**: Optimized for mobile interactions
- **Content Scaling**: Typography and spacing adapt to screen size

## 🚀 Deployment

### Frontend (Netlify)
1. Connect repository to Netlify
2. Set build command: `npm run build:frontend`
3. Set publish directory: `dist/spa`
4. Deploy

### Backend (Any Node.js host)
1. Build: `npm run build:backend`
2. Start: `npm start`
3. Ensure PORT environment variable is set

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
