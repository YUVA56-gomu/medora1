# MEDORA - Healthcare Management System

## Overview

MEDORA is a comprehensive healthcare management system built with a full-stack TypeScript architecture. The application provides role-based dashboards for super admins, doctors, nurses, and patients, offering seamless healthcare workflow management with modern UI components and real-time interactions.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for fast development
- **UI Framework**: Tailwind CSS with shadcn/ui components for consistent design
- **State Management**: React Context API for authentication and data management
- **Routing**: React Router v6 for client-side navigation with protected routes
- **Data Fetching**: TanStack Query for server state management (prepared but not yet implemented)

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **Development**: Hot module replacement with Vite integration

### Authentication System
- Custom authentication context with role-based access control
- Mock user system for development (ready for real authentication integration)
- Protected routes based on user roles (super_admin, doctor, nurse, patient)

## Key Components

### Data Models (Shared Schema)
- **Users Table**: Basic user authentication with username/password
- **Type System**: Comprehensive TypeScript interfaces for User, Appointment, MedicalRecord, Notification, Task, and DashboardStats

### Role-Based Dashboards
1. **Super Admin Dashboard**: System oversight, user management, and analytics
2. **Doctor Dashboard**: Patient appointments, medical records, and approvals
3. **Nurse Dashboard**: Task management, patient monitoring, and care coordination
4. **Patient Dashboard**: Appointment booking, medical records access, and health tracking

### UI Components
- **Layout System**: Responsive sidebar navigation with dark mode support
- **Authentication Flow**: Role-specific login pages with branded interfaces
- **Component Library**: Full shadcn/ui integration with Radix UI primitives
- **Notifications**: Real-time notification system with read/unread states

## Data Flow

### Client-Side Flow
1. User selects role from welcome page
2. Authentication through role-specific login
3. Context providers manage user state and application data
4. Protected routes ensure appropriate access control
5. Dashboard components render role-specific interfaces

### Server-Side Flow (Prepared)
1. Express server with middleware for logging and error handling
2. Storage interface abstraction (currently using in-memory mock)
3. Route registration system ready for API endpoint implementation
4. Database schema configured for PostgreSQL with Drizzle migrations

### Development Workflow
- Vite development server with HMR for frontend
- Express server with TypeScript compilation via tsx
- Shared types between client and server for type safety

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React, React DOM, React Router
- **Development Tools**: Vite, TypeScript, ESBuild
- **Database**: Drizzle ORM, Neon Database serverless driver
- **UI Components**: Radix UI primitives, Lucide React icons

### Styling and Design
- **CSS Framework**: Tailwind CSS with PostCSS
- **Component Variants**: class-variance-authority for dynamic styling
- **Date Handling**: date-fns for date manipulation
- **Carousel**: Embla Carousel for interactive components

### Development Environment
- **Replit Integration**: Cartographer plugin and runtime error overlay
- **Session Management**: PostgreSQL session store
- **Form Handling**: React Hook Form with Zod validation (prepared)

## Deployment Strategy

### Replit Configuration
- **Build Process**: Vite build for frontend, ESBuild for backend bundling
- **Production**: Node.js server serving static assets and API routes
- **Database**: PostgreSQL module with automatic provisioning
- **Port Configuration**: Internal port 5000 mapped to external port 80

### Environment Requirements
- Node.js 20 runtime environment
- PostgreSQL 16 database instance
- Environment variable DATABASE_URL for database connection

### Build Pipeline
1. Frontend assets compiled with Vite to `dist/public`
2. Backend TypeScript compiled with ESBuild to `dist/index.js`
3. Shared schema and types available to both client and server
4. Production server serves static files and API endpoints

## Changelog

```
Changelog:
- June 13, 2025. Initial setup
- June 13, 2025. Successfully migrated from Bolt to Replit environment
- June 13, 2025. Added PostgreSQL database with comprehensive healthcare schema
- June 13, 2025. Implemented authentication API with database integration
- June 13, 2025. Converted React Router to wouter for Replit compatibility
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```