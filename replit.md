# Aywa - Plateforme de Location d'Équipement

## Overview

Aywa est une application web full-stack pour les services de location d'équipement au Sénégal. La plateforme permet aux utilisateurs de parcourir, rechercher et réserver des équipements professionnels en location. Elle est construite avec un frontend React moderne et un backend Express.js, proposant une interface en français ciblant le marché sénégalais.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack Query (React Query) for server state
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom color scheme and responsive design
- **Form Management**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Style**: RESTful API endpoints
- **Data Validation**: Zod schemas shared between frontend and backend
- **Development Server**: Vite for hot module replacement and asset bundling

### Database Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (configured via DATABASE_URL)
- **Schema Management**: Drizzle Kit for migrations
- **Connection**: Neon Database serverless adapter

## Key Components

### Core Entities
1. **Equipment**: Main rental items with categories, pricing, specifications, and availability
2. **Bookings**: Rental reservations with customer details, dates, and pricing
3. **Inquiries**: Contact form submissions for customer support

### API Endpoints
- `GET /api/equipment` - List equipment with filtering (category, search, location)
- `GET /api/equipment/:id` - Get specific equipment details
- `POST /api/bookings` - Create new rental booking
- `POST /api/inquiries` - Submit customer inquiry

### Frontend Pages
- **Home**: Hero section with search, featured equipment, and service areas
- **Equipment**: Browseable catalog with filtering and search
- **Equipment Detail**: Individual equipment page with booking functionality
- **Contact**: Customer inquiry form with equipment category selection

### Shared Components
- Equipment cards with pricing and availability
- Booking modal with form validation
- Search and filter functionality
- Responsive header and footer

## Data Flow

1. **Equipment Discovery**: Users search/filter equipment via the frontend, which queries the backend API
2. **Equipment Details**: Detailed equipment information is fetched individually with availability status
3. **Booking Process**: Booking forms collect customer data, validate it client-side, then submit to backend
4. **Inquiry Handling**: Contact forms are processed and stored for customer service follow-up

## External Dependencies

### Runtime Dependencies
- **UI Framework**: React ecosystem with Radix UI components
- **Database**: Neon PostgreSQL serverless
- **Validation**: Zod for type-safe schema validation
- **HTTP Client**: Native fetch API with TanStack Query wrapper
- **Date Handling**: date-fns for date formatting and manipulation

### Development Tools
- **Build Tool**: Vite for fast development and optimized production builds
- **TypeScript**: Full type safety across frontend and backend
- **ESBuild**: Backend bundling for production deployment
- **PostCSS**: CSS processing with Tailwind CSS

## Deployment Strategy

### Development Environment
- Replit-hosted with automatic environment setup
- PostgreSQL module pre-configured
- Hot reload enabled for both frontend and backend
- Port 5000 configured for local development

### Production Build
- Frontend: Vite builds optimized static assets to `dist/public`
- Backend: ESBuild bundles server code to `dist/index.js`
- Database: Drizzle migrations applied via `db:push` command
- Environment: Production mode disables development plugins

### Replit Configuration
- Auto-scaling deployment target
- Parallel workflow execution
- PostgreSQL 16 module integration
- Node.js 20 runtime environment

## Changelog

- June 24, 2025. Initial setup
- June 24, 2025. Transformation en plateforme Aywa avec branding et équipements adaptés au Sénégal
- June 24, 2025. Ajout pages Services, À Propos, Équipements Populaires
- June 24, 2025. Création base de données MySQL complète pour le business

## User Preferences

Preferred communication style: Simple, everyday language.

## Contact Information

- Téléphone: +221 78 606 70 13
- Email: aywa@aywa.com