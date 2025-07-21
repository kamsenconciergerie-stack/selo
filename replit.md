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
4. **Users**: Customer accounts with authentication and role management
5. **Partners**: Vehicle rental partners with comprehensive registration system
6. **Reviews**: Equipment ratings and feedback from users
7. **Equipment Tracking**: GPS and status tracking for rented items
8. **Maintenance**: Scheduled maintenance and service records
9. **Locations**: Multi-location support for equipment distribution
10. **Notifications**: SMS and system notifications for users and partners

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
- June 24, 2025. Migration vers PostgreSQL avec système d'images local
- June 24, 2025. Ajout puis suppression du slogan sur demande utilisateur
- June 24, 2025. Documentation application mobile React Native
- June 24, 2025. Application web déployée et prête en production
- June 24, 2025. Intégration paiements mobiles Orange Money et Wave
- June 24, 2025. Mise à jour images équipements avec logo Aywa personnalisé
- January 21, 2025. Ajout système de partenariat complet avec 8 nouvelles tables
- January 21, 2025. Système d'authentification JWT avec rôles (customer, partner, admin)
- January 21, 2025. Processus d'inscription partenaire en 3 étapes
- January 21, 2025. Service SMS pour notifications via Orange/Tigo
- January 21, 2025. Dashboard utilisateur avec gestion réservations et avis
- January 21, 2025. Mise en avant des camions avec 4 catégories principales
- January 21, 2025. Simplification page services avec 3 services principaux
- January 21, 2025. Mise à jour page À Propos avec nouveau contenu et contact
- January 21, 2025. Création images SVG personnalisées avec couleurs Aywa pour tous équipements
- January 21, 2025. Configuration serveur statique pour images SVG et déploiement prêt
- January 21, 2025. Configuration domaine personnalisé aywalogistic.com pour production
- January 21, 2025. Correction couleurs étiquettes AYWA et emails contact visibles - PRÊT DÉPLOIEMENT
- January 21, 2025. Mise à jour prix équipements selon marché africain/sénégalais - REDÉPLOIEMENT
- January 21, 2025. Ajout bannière promo "Tarifs spéciaux Magal de Touba 2025" avec CTA service commercial
- January 21, 2025. Bannière créative avec image mosquée Touba, couleurs dorées harmonisées, positionnée au-dessus section produits
- January 21, 2025. Mise à jour texte bannière promo et suppression image mosquée pour design simplifié
- January 21, 2025. Dashboard d'administration complet créé accessible via /adminone avec vue d'ensemble, gestion réservations, équipements et analyses
- January 21, 2025. Système d'authentification sécurisé pour administration - accès restreint au compte admin principal uniquement
- January 21, 2025. Mise à jour mot de passe administrateur vers aywadmin2025
- January 21, 2025. Système complet de gestion du réseau de partenaires avec visualisations et analytics intégrées
- January 21, 2025. Page d'administration dédiée aux partenaires accessible via /adminpartners avec dashboard personnalisé
- January 21, 2025. Interface de connexion sécurisée pour partenaires avec 3 comptes de démonstration
- January 21, 2025. Tableau de bord partenaire avec gestion des réservations, statistiques et analyses de performance
- January 21, 2025. Système d'approbation/rejet des réservations en temps réel pour chaque partenaire

## User Preferences

Preferred communication style: Simple, everyday language.

## Contact Information

- Téléphone: +221 78 606 70 13
- Email: contact@aywalogistic.com
- Domaine: aywalogistic.com