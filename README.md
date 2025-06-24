# sb1-kioegc7a

[Edit in StackBlitz next generation editor ⚡️](https://stackblitz.com/~/github.com/Freetaxfiler/sb1-kioegc7a)

# TICKETS - Multi-Organization Ticket Management System

A modern ticket management system built with React, TypeScript, and Supabase, designed to handle support tickets across multiple organizations with role-based access control.

## 🚀 Overview

TICKETS is a full-stack web application that provides a comprehensive ticket management solution for organizations. It features multi-tenancy support, real-time updates, file attachments, and detailed audit trails.

## 🏗️ Architecture

### Frontend Stack
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **React Select** - Enhanced select components
- **React Toastify** - Toast notifications
- **Lucide React** - Modern icon library

### Backend Stack
- **Supabase** - Backend-as-a-Service platform
- **PostgreSQL** - Primary database
- **Row Level Security (RLS)** - Data access control
- **Supabase Auth** - User authentication
- **Supabase Storage** - File storage

### Additional Technologies
- **Express.js** - Server-side API (Node.js)
- **CORS** - Cross-origin resource sharing
- **TypeORM** - Object-relational mapping
- **ESLint** - Code linting and formatting

## 📁 Project Structure

```
d:\TICKETS\
├── src/
│   ├── lib/
│   │   └── supabase-types.ts      # TypeScript types for database
│   └── supabaseClient.ts          # Supabase client configuration
├── supabase/
│   ├── config.toml               # Supabase configuration
│   └── migrations/               # Database migration files
│       ├── 20250510110000_clean_consolidated_migration.sql
│       ├── 20250511000000_add_ustaxefiler_org.sql
│       ├── 20250511001000_fix_organization_access.sql
│       ├── 20250521024134_broken_resonance.sql
│       └── archive/              # Historical migrations
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase CLI
- PostgreSQL (for local development)

### 1. Clone Repository
```bash
git clone <repository-url>
cd TICKETS
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup
```bash
# Start Supabase locally
supabase start

# Apply migrations
supabase db reset
```

### 5. Start Development Server
```bash
# Frontend development server
npm run dev

# Backend server (if needed)
npm run server
```

## 📊 Database Schema

### Core Tables

#### **users**
Extends Supabase auth.users with additional profile information
- `id` (uuid) - References auth.users(id)
- `email` (text) - User email address
- `name` (text) - Display name
- `created_at`, `updated_at` (timestamptz)

#### **organizations**
Multi-tenant organization support
- `id` (uuid) - Primary key
- `name` (text) - Organization name
- `slug` (text) - URL-friendly identifier
- `theme_primary_color`, `theme_secondary_color`, `theme_accent_color` (text)
- `logo_url` (text) - Organization logo
- `created_at` (timestamptz)

#### **user_organizations**
Many-to-many relationship between users and organizations
- `user_id` (uuid) - References users(id)
- `organization_id` (uuid) - References organizations(id)
- `role` (text) - 'admin' or 'member'

#### **tickets**
Core ticket management
- `id` (uuid) - Primary key
- `ticket_no` (text) - Auto-generated ticket number (TKT-YYYYMMDD-NNNN)
- `title` (text) - Ticket title
- `description` (text) - Detailed description
- `status` (text) - 'open', 'in_progress', 'closed'
- `priority` (text) - 'low', 'normal', 'high', 'urgent'
- `user_id` (uuid) - Ticket creator
- `organization_id` (uuid) - Associated organization
- `assigned_to` (uuid) - Assigned user
- `attachment_url`, `attachment_name`, `attachment_size` - File attachments
- `created_at`, `updated_at` (timestamptz)

#### **ticket_history**
Audit trail for ticket changes
- `ticket_id` (uuid) - References tickets(id)
- `changed_by` (uuid) - User who made the change
- `field_name` (text) - Changed field
- `old_value`, `new_value` (text) - Before/after values
- `changed_at` (timestamptz)

### Default Organizations
The system comes pre-configured with these organizations:
- **FreeTaxFiler** (slug: `free-tax-filer`)
- **OnlineTaxFiler** (slug: `online-tax-filer`) 
- **AIUSTax** (slug: `aius-tax`)

## 🔑 Key Features

### Multi-Organization Support
- Isolated data per organization
- Role-based access (admin/member)
- Custom themes per organization

### Ticket Management
- Auto-generated ticket numbers
- Status tracking (open → in_progress → closed)
- Priority levels (low → urgent)
- File attachments with Supabase Storage
- Assignment to team members

### Security & Access Control
- Row Level Security (RLS) policies
- Organization-based data isolation
- Authenticated user requirements
- Secure file upload/download

### Audit Trail
- Complete change history
- Field-level tracking
- User attribution
- Timestamp recording

## 🔧 API Functions

### Database Functions

#### `create_ticket()`
```sql
create_ticket(
  p_assigned_to uuid,
  p_client_file_no text,
  p_description text,
  p_issue_type text,
  p_mobile_no text,
  p_name_of_client text,
  p_opened_by text,
  p_organization_id uuid
) RETURNS uuid
```

#### `get_dashboard_stats()`
```sql
get_dashboard_stats(p_organization_id uuid) RETURNS json
```
Returns:
- `totalTickets` - Total tickets in organization
- `openTickets` - Currently open tickets
- `resolvedToday` - Tickets closed today
- `avgResponseTime` - Average resolution time in hours

#### `generate_ticket_number()`
Auto-generates unique ticket numbers in format: `TKT-YYYYMMDD-NNNN`

## 🚀 Available Scripts

```json
{
  "dev": "vite",                    // Start development server
  "build": "vite build",            // Build for production
  "lint": "eslint .",               // Run ESLint
  "preview": "vite preview",        // Preview production build
  "server": "node server.js"        // Start Express server
}
```

## 🔐 Authentication & Authorization

### Authentication Flow
1. Users sign up/sign in via Supabase Auth
2. Automatic user record creation in `users` table
3. Organization assignment based on business rules

### Authorization Levels
- **Public**: Can view organization list
- **Authenticated**: Can access assigned organization data
- **Member**: Can view/create tickets in their organizations
- **Admin**: Full access to organization management

## 📁 File Storage

Supabase Storage bucket: `ticket-attachments`
- Organization-scoped file access
- 50MB file size limit
- Secure upload/download policies

## 🔄 Development Workflow

### Local Development
```bash
# Start Supabase locally
supabase start

# Start development server
npm run dev

# View Supabase Studio
open http://localhost:54323
```

### Database Migrations
```bash
# Create new migration
supabase migration new migration_name

# Apply migrations
supabase db reset

# Deploy to production
supabase db push
```

## 🚀 Deployment

### Environment Variables
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

### Build Process
```bash
npm run build
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📝 License

This project is private and proprietary. All rights reserved.

## 🔍 Troubleshooting

### Common Issues

**Database Connection Issues**
- Ensure Supabase is running: `supabase status`
- Check environment variables
- Verify database migrations are applied

**Authentication Problems**
- Check Supabase Auth configuration
- Verify RLS policies are properly set
- Ensure user creation triggers are working

**File Upload Issues**
- Check storage bucket permissions
- Verify file size limits
- Ensure proper RLS policies on storage.objects

## 📞 Support

For technical support or questions about this codebase, please contact the development team.

---

**Last Updated**: June 2025  
**Version**: 0.0.0  
**Built with**: React + TypeScript + Supabase