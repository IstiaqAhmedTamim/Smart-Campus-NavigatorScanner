# Smart Campus Navigation and QR-Based Crowd Density Monitoring System

## Overview

A real-time campus crowd monitoring application that helps students find less crowded campus facilities. Students scan QR codes at location entry/exit points to track crowd density across campus locations like libraries, cafeterias, labs, and study rooms. The system provides smart recommendations for the least crowded locations and displays live crowd statistics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for client-side navigation
- **State Management**: TanStack React Query for server state with automatic polling for live updates
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom ocean-themed color palette
- **Animations**: Framer Motion for page transitions and UI effects
- **Data Visualization**: Recharts for crowd statistics charts

### Backend Architecture
- **Server**: Express.js with TypeScript
- **Authentication**: Passport.js with local strategy using session-based auth
- **Session Storage**: MemoryStore for development (connect-pg-simple available for production)
- **Password Security**: Scrypt hashing with timing-safe comparison
- **API Design**: REST endpoints with Zod schema validation

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema**: Three main tables - users, locations, scans
- **Migrations**: Drizzle Kit for schema management (`npm run db:push`)

### Key Data Models
- **Users**: Student ID (unique), email, password, role (student/admin)
- **Locations**: Name, QR code (unique), capacity, current count, description
- **Scans**: User ID, location ID, type (entry/exit), timestamp

### Core Features
- QR code scanning for location entry/exit tracking
- Real-time crowd level calculation (low/medium/high based on percentage thresholds)
- Smart recommendation engine suggesting least crowded locations
- Live dashboard with 2-second polling interval
- Campus-wide analytics and statistics

## External Dependencies

### Database
- PostgreSQL database (requires DATABASE_URL environment variable)
- Drizzle ORM for database operations

### Frontend Libraries
- html5-qrcode for camera-based QR scanning
- qrcode.react for QR code generation/display
- react-hook-form with Zod resolver for form handling

### Authentication
- express-session for session management
- passport and passport-local for authentication strategy

### Development Tools
- Vite with React plugin for development server
- Replit-specific plugins for error overlay and dev banner
- esbuild for production server bundling