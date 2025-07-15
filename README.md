# MLM Platform with Binary Tree Architecture

A comprehensive Multi-Level Marketing (MLM) platform built with React, TypeScript, and Supabase, featuring a binary tree compensation system.

## Features

- **Multi-User System**: Support for Customers, Companies, and Admins
- **Binary Tree MLM Structure**: Automated left-first placement algorithm
- **Authentication & Verification**: Email and SMS OTP verification
- **Subscription Management**: Multiple subscription plans with payment processing
- **Real-time Dashboard**: Analytics and network visualization
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Database Structure

The platform uses Supabase (PostgreSQL) with the following main tables:

### Core Tables

1. **users** - Main authentication table
   - `id` (uuid, primary key)
   - `email` (text, unique)
   - `user_type` (customer/company/admin)
   - `is_verified`, `email_verified`, `mobile_verified` (boolean)

2. **user_profiles** - Extended user information
   - `user_id` (foreign key to users)
   - `first_name`, `last_name`, `username`
   - `mobile`, `gender`, `sponsorship_number`
   - `parent_account` (referral information)

3. **companies** - Company-specific data
   - `user_id` (foreign key to users)
   - `company_name`, `brand_name`
   - `registration_number`, `gstin`
   - `verification_status`

4. **mlm_tree** - Binary tree structure
   - `user_id`, `parent_id`
   - `left_child_id`, `right_child_id`
   - `level`, `position` (left/right/root)
   - `sponsorship_number`

5. **subscription_plans** - Available plans
   - `name`, `price`, `duration_days`
   - `features` (JSON array)
   - `is_active`

6. **otp_verifications** - OTP management
   - `user_id`, `otp_code`, `otp_type`
   - `contact_info`, `expires_at`
   - `is_verified`, `attempts`

### Database Access

To view the database structure:

1. **Supabase Dashboard**: 
   - Go to your Supabase project dashboard
   - Navigate to "Table Editor" to see all tables
   - Use "SQL Editor" to run custom queries

2. **Database Schema**: 
   - Check the migration file: `supabase/migrations/create_initial_schema.sql`
   - Contains complete table definitions, relationships, and functions

## Setup Instructions

### 1. Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Click "Connect to Supabase" button in the top right of this application
3. The database schema will be automatically applied

### 2. Environment Variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. SMS & Email Gateway Configuration

The platform includes testing credentials for:

**SMS Gateway (Twilio Test)**:
- Account SID: `ACtest123456789`
- Auth Token: `test_auth_token_123`
- Test Phone: `+15005550006`

**Email SMTP (Mailtrap Test)**:
- Host: `smtp.mailtrap.io`
- Port: `2525`
- Username/Password: Configure in Mailtrap dashboard

### 4. Production Gateway Setup

For production, update the system settings in the database:

```sql
-- Update SMS settings
UPDATE system_settings SET setting_value = '"your_real_account_sid"' WHERE setting_key = 'sms_gateway_account_sid';
UPDATE system_settings SET setting_value = '"your_real_auth_token"' WHERE setting_key = 'sms_gateway_auth_token';

-- Update Email settings
UPDATE system_settings SET setting_value = '"your_smtp_host"' WHERE setting_key = 'smtp_host';
UPDATE system_settings SET setting_value = '"your_smtp_username"' WHERE setting_key = 'smtp_username';
```

## Key Features

### Binary Tree Algorithm
- **Left-First Placement**: New users are automatically placed in the leftmost available position
- **Breadth-First Search**: Ensures balanced tree growth
- **Spillover System**: When a position is full, users spill to the next available spot

### OTP Verification System
- **Email OTP**: 6-digit codes sent via SMTP
- **SMS OTP**: 6-digit codes sent via Twilio
- **Expiration**: 10-minute validity period
- **Rate Limiting**: Prevents spam and abuse

### Subscription Management
- **Multiple Plans**: Basic, Premium, Enterprise tiers
- **Payment Integration**: Support for credit cards and crypto
- **Auto-Renewal**: Subscription lifecycle management

### Admin Dashboard
- **User Management**: View and manage all users
- **System Settings**: Configure platform parameters
- **Analytics**: Revenue, growth, and performance metrics
- **Email Templates**: Customize system communications

## API Endpoints

### Edge Functions (Supabase)

1. **send-otp**: Send OTP via email or SMS
2. **verify-otp**: Verify submitted OTP codes

### Database Functions

1. **generate_sponsorship_number()**: Auto-generate unique sponsorship IDs
2. **add_to_mlm_tree()**: Add users to binary tree with proper placement
3. **generate_otp()**: Generate 6-digit OTP codes

## Security Features

- **Row Level Security (RLS)**: Database-level access control
- **JWT Authentication**: Secure session management
- **Input Validation**: Comprehensive data validation
- **Rate Limiting**: Protection against abuse
- **Encryption**: Secure password hashing and data transmission

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Testing Credentials

For testing the OTP functionality:

**Test Email**: Any valid email address (check console logs for OTP)
**Test Mobile**: Any mobile number (check console logs for OTP)
**Test OTP**: `123456` (hardcoded for testing)

## Support

For technical support or questions about the database structure:
1. Check the migration files in `supabase/migrations/`
2. Review the API functions in `supabase/functions/`
3. Examine the database schema in Supabase dashboard