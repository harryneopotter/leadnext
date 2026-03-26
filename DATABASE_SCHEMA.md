# LeadCRM Database Schema & Role-Based Access

## Overview

This document describes all database tables, fields, and which data is accessible to each user role.

**Roles:**
- **SUPER_ADMIN** - System owner, manages all tenants
- **ADMIN** - Manages their own clients and their clients' leads
- **CLIENT** - Views only their own leads

---

## 1. User Table

Stores all system users (Super Admin, Admins, Clients).

| Field | Type | Description | SUPER_ADMIN | ADMIN | CLIENT |
|-------|------|-------------|:-----------:|:-----:|:------:|
| `id` | String (UUID) | Unique identifier | ✅ Read | ✅ Read | ✅ Read Own |
| `email` | String (Unique) | Login email | ✅ Read All | ✅ Read Own + Clients | ✅ Read Own |
| `password` | String | Hashed password (bcrypt) | ❌ Hidden | ❌ Hidden | ❌ Hidden |
| `name` | String | Display name | ✅ Read/Write All | ✅ Read/Write Own | ✅ Read/Write Own |
| `role` | Enum | SUPER_ADMIN/ADMIN/CLIENT | ✅ Read All | ✅ Read Own + Clients | ❌ Hidden |
| `status` | Enum | ACTIVE/SUSPENDED/DELETED | ✅ Read/Write All | ✅ Read | ✅ Read Own |
| `adminId` | String (FK) | Reference to admin who created client | ✅ Read All | ✅ Read Own Clients | ❌ Hidden |
| `settings` | JSON | Notification prefs, timezone | ✅ Read All | ✅ Read Own + Clients | ✅ Read/Write Own |
| `createdAt` | DateTime | Account creation date | ✅ Read All | ✅ Read Own + Clients | ✅ Read Own |
| `updatedAt` | DateTime | Last update timestamp | ✅ Read All | ✅ Read Own + Clients | ✅ Read Own |
| `lastLoginAt` | DateTime | Last login timestamp | ✅ Read All | ✅ Read Own | ✅ Read Own |

### Access Patterns
- **SUPER_ADMIN**: Can CRUD all users
- **ADMIN**: Can CRUD only CLIENT users they created (via `adminId`)
- **CLIENT**: Can only view/update their own profile

---

## 2. Lead Table

Stores all leads. Each lead belongs to exactly one client.

| Field | Type | Description | SUPER_ADMIN | ADMIN | CLIENT |
|-------|------|-------------|:-----------:|:-----:|:------:|
| `id` | String (UUID) | Unique identifier | ✅ Read | ✅ Read | ✅ Read |
| `clientId` | String (FK) | Owner client reference | ✅ Read All | ✅ Read Own Clients | ✅ Read Own Only |
| `name` | String | Lead full name | ✅ Read/Write | ✅ Read/Write | ✅ Read/Write |
| `phone` | String | Phone number | ✅ Read/Write | ✅ Read/Write | ✅ Read/Write |
| `email` | String? | Email address | ✅ Read/Write | ✅ Read/Write | ✅ Read/Write |
| `city` | String? | City/location | ✅ Read/Write | ✅ Read/Write | ✅ Read/Write |
| `source` | Enum | MANUAL/FACEBOOK/WHATSAPP/WEBSITE | ✅ Read/Write | ✅ Read/Write | ✅ Read/Write |
| `status` | Enum | NEW/INTERESTED/HOT/CONVERTED/etc | ✅ Read/Write | ✅ Read/Write | ✅ Read/Write |
| `remarks` | String? | Internal notes | ✅ Read/Write | ✅ Read/Write | ✅ Read/Write |
| `followUpDate` | DateTime? | Scheduled follow-up | ✅ Read/Write | ✅ Read/Write | ✅ Read/Write |
| `reminderSent` | Boolean | Reminder sent flag | ✅ Read/Write | ✅ Read/Write | ✅ Read/Write |
| `whatsappOptIn` | Boolean | WhatsApp consent | ✅ Read/Write | ✅ Read/Write | ✅ Read/Write |
| `createdAt` | DateTime | Lead creation date | ✅ Read | ✅ Read | ✅ Read |
| `updatedAt` | DateTime | Last update | ✅ Read | ✅ Read | ✅ Read |

### Access Patterns
- **SUPER_ADMIN**: Full access to all leads system-wide
- **ADMIN**: Access to leads belonging to their clients (via client's `adminId`)
- **CLIENT**: Access only to leads where `clientId` matches their ID

### Unique Constraint
- `(clientId, phone)` - Phone must be unique per client

---

## 3. ActivityLog Table

Audit trail for all actions.

| Field | Type | Description | SUPER_ADMIN | ADMIN | CLIENT |
|-------|------|-------------|:-----------:|:-----:|:------:|
| `id` | String (UUID) | Unique identifier | ✅ Read | ✅ Read Own | ✅ Read Own |
| `userId` | String? (FK) | Who performed action | ✅ Read All | ✅ Read Own + Clients | ✅ Read Own Only |
| `leadId` | String? (FK) | Affected lead | ✅ Read All | ✅ Read Own Clients | ✅ Read Own Only |
| `action` | String | Action type (CREATE_LEAD, UPDATE_STATUS, etc) | ✅ Read All | ✅ Read Own Clients | ✅ Read Own Only |
| `details` | JSON? | Metadata (oldValue, newValue) | ✅ Read All | ✅ Read Own Clients | ✅ Read Own Only |
| `createdAt` | DateTime | When action occurred | ✅ Read All | ✅ Read Own Clients | ✅ Read Own Only |

### Access Patterns
- **SUPER_ADMIN**: Can view all activity logs
- **ADMIN**: Can view logs for their clients' activities
- **CLIENT**: Can view only their own activity logs

---

## 4. SystemSettings Table

Global system configuration (single row).

| Field | Type | Description | SUPER_ADMIN | ADMIN | CLIENT |
|-------|------|-------------|:-----------:|:-----:|:------:|
| `id` | String | Unique identifier | ✅ Read/Write | ❌ No Access | ❌ No Access |
| `whatsappToken` | String? | Encrypted WhatsApp API token | ✅ Read/Write | ❌ No Access | ❌ No Access |
| `whatsappPhoneNumberId` | String? | WhatsApp Business phone ID | ✅ Read/Write | ❌ No Access | ❌ No Access |
| `whatsappWebhookSecret` | String? | Webhook verification secret | ✅ Read/Write | ❌ No Access | ❌ No Access |
| `smtpHost` | String? | Email server host | ✅ Read/Write | ❌ No Access | ❌ No Access |
| `smtpPort` | Int? | Email server port | ✅ Read/Write | ❌ No Access | ❌ No Access |
| `smtpUser` | String? | Email username | ✅ Read/Write | ❌ No Access | ❌ No Access |
| `smtpPass` | String? | Encrypted email password | ✅ Read/Write | ❌ No Access | ❌ No Access |
| `settings` | JSON? | Additional global settings | ✅ Read/Write | ❌ No Access | ❌ No Access |
| `updatedAt` | DateTime | Last update | ✅ Read | ❌ No Access | ❌ No Access |
| `updatedBy` | String? | Who last updated | ✅ Read | ❌ No Access | ❌ No Access |

### Access Patterns
- **SUPER_ADMIN**: Full CRUD access
- **ADMIN/CLIENT**: No access (system-level config only)

---

## Enums Reference

### UserRole
- `SUPER_ADMIN` - System administrator
- `ADMIN` - Tenant administrator (manages clients)
- `CLIENT` - End user (manages their leads)

### UserStatus
- `ACTIVE` - Account is active
- `SUSPENDED` - Account temporarily disabled
- `DELETED` - Account marked for deletion

### LeadSource
- `MANUAL` - Added manually
- `FACEBOOK` - From Facebook Lead Ads
- `WHATSAPP` - From WhatsApp
- `WEBSITE` - From website form
- `REFERRAL` - Referred by existing client
- `OTHER` - Other sources

### LeadStatus
- `NEW` - Just added
- `INTERESTED` - Showed interest
- `NOT_INTERESTED` - Declined
- `NOT_PICKED` - Did not answer
- `HOT` - High priority
- `CONVERTED` - Became customer
- `FOLLOW_UP` - Needs follow-up

---

## Multi-Tenancy Data Isolation

### Data Visibility Rules

1. **SUPER_ADMIN** sees:
   - All users (all roles)
   - All leads (system-wide)
   - All activity logs
   - System settings

2. **ADMIN** sees:
   - Their own profile
   - CLIENT users they created (`adminId` = their ID)
   - Leads belonging to their clients
   - Activity logs for their clients

3. **CLIENT** sees:
   - Their own profile only
   - Leads where `clientId` = their ID
   - Their own activity logs only

### Database Indexes for Performance

- `User.adminId` - Fast lookup of clients by admin
- `User.role` - Fast filtering by role
- `User.status` - Fast filtering by status
- `Lead.clientId` - Fast lookup of leads by client
- `Lead.status` - Fast filtering by status
- `Lead.followUpDate` - Fast sorting by follow-up date
- `Lead.phone` - Fast phone lookups
- `ActivityLog.userId` - Fast lookup by user
- `ActivityLog.leadId` - Fast lookup by lead
- `ActivityLog.createdAt` - Fast sorting by date

---

## Security Notes

1. **Passwords** - Always hashed with bcrypt (never stored plain text)
2. **API Tokens** - Encrypted in database
3. **Phone Uniqueness** - Unique per client (same phone can exist for different clients)
4. **Cascading Deletes** - When a client is deleted, all their leads are deleted (`onDelete: Cascade`)
5. **Audit Trail** - All actions logged in ActivityLog
