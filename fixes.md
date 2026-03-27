# LeadCRM — Required Fixes

> **For the implementing AI**: Apply all fixes in this document exactly as specified.
> Do not refactor anything outside the scope of each fix.
> Do not change any other files unless explicitly stated.

---

## Fix 1 — WhatsApp Webhook URL Must Be Per-Admin

**Problem**: Webhook endpoint is a single global route `/api/webhooks/whatsapp`.
This means all incoming WhatsApp messages from all admins hit the same endpoint
with no way to identify which admin the message belongs to.

**Required Change**: Parameterize the webhook by `adminId`.

### 1a. Move/rename the webhook route file

```
FROM: src/app/api/webhooks/whatsapp/route.ts
TO:   src/app/api/webhooks/whatsapp/[adminId]/route.ts
```

### 1b. Update the handler to use `adminId` from params

```typescript
// src/app/api/webhooks/whatsapp/[adminId]/route.ts

export async function GET(
  request: Request,
  { params }: { params: { adminId: string } }
) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode !== "subscribe") {
    return new Response("Invalid mode", { status: 400 });
  }

  // Look up this admin's webhook secret
  const settings = await prisma.adminSettings.findUnique({
    where: { adminId: params.adminId },
    select: { whatsappWebhookSecret: true }
  });

  if (!settings?.whatsappWebhookSecret) {
    return new Response("Admin not found or not configured", { status: 404 });
  }

  const secret = decrypt(settings.whatsappWebhookSecret);

  if (token !== secret) {
    return new Response("Forbidden", { status: 403 });
  }

  return new Response(challenge, { status: 200 });
}

export async function POST(
  request: Request,
  { params }: { params: { adminId: string } }
) {
  // 1. Look up admin settings by params.adminId
  const settings = await prisma.adminSettings.findUnique({
    where: { adminId: params.adminId },
    select: {
      whatsappToken: true,
      whatsappPhoneNumberId: true,
      whatsappWebhookSecret: true
    }
  });

  if (!settings) {
    return new Response("Not found", { status: 404 });
  }

  // 2. Validate X-Hub-Signature-256 against decrypted whatsappWebhookSecret
  // 3. Parse message body — extract phone + text
  // 4. Upsert lead: { adminId: params.adminId, phone } — unique constraint handles dedup
  // 5. Detect intent → set LeadStatus
  // 6. Write ActivityLog: action = "WHATSAPP_LEAD_CAPTURED"

  return new Response("OK", { status: 200 });
}
```

### 1c. Update the webhook URL shown in Admin Settings UI

The settings page must show the admin their correct webhook URL.
Pull `adminId` from the session and construct the URL:

```typescript
// In the settings page component
const webhookUrl = `${process.env.NEXTAUTH_URL}/api/webhooks/whatsapp/${session.user.id}`;
```

Display this as a **read-only input with a copy button**. Label: "Your WhatsApp Webhook URL".

---

## Fix 2 — Facebook Webhook Must Also Be Per-Admin

**Same problem as Fix 1.** The Facebook webhook endpoint is global.

### 2a. Move/rename the route file

```
FROM: src/app/api/webhooks/facebook/route.ts
TO:   src/app/api/webhooks/facebook/[adminId]/route.ts
```

### 2b. Update handler signature

Same pattern as Fix 1 — use `params.adminId` to identify the admin.
Never accept `adminId` from the request body.

---

## Fix 3 — Remove `adminId` from Lead Ingestion Request Body

**Problem**: `POST /api/leads/ingest` accepts `adminId` in the request body.
This is a security vulnerability — any unauthenticated caller can inject leads
into any admin account by supplying any `adminId`.

**Required Change**: `adminId` must come from the URL parameter only, never the body.

### 3a. Move/rename the route

```
FROM: src/app/api/leads/ingest/route.ts
TO:   src/app/api/leads/ingest/[adminId]/route.ts
```

### 3b. Updated handler

```typescript
// src/app/api/leads/ingest/[adminId]/route.ts

export async function POST(
  request: Request,
  { params }: { params: { adminId: string } }
) {
  const body = await request.json();

  // Validate admin exists
  const admin = await prisma.user.findUnique({
    where: { id: params.adminId, role: "ADMIN", status: "ACTIVE" }
  });

  if (!admin) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  // Validate body with Zod — adminId must NOT be in the schema
  const schema = z.object({
    name: z.string().min(1),
    phone: z.string().regex(/^\d{10,15}$/),
    email: z.string().email().optional(),
    city: z.string().optional(),
    source: z.enum(["FACEBOOK", "WEBSITE", "REFERRAL", "OTHER"]).default("FACEBOOK"),
  });

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  // Upsert lead — unique on (adminId, phone)
  const lead = await prisma.lead.upsert({
    where: {
      adminId_phone: {
        adminId: params.adminId,  // From URL, never from body
        phone: parsed.data.phone
      }
    },
    create: {
      adminId: params.adminId,
      ...parsed.data,
      status: "NEW"
    },
    update: {
      updatedAt: new Date()
    }
  });

  // Log activity
  await prisma.activityLog.create({
    data: {
      leadId: lead.id,
      action: "CREATE_LEAD",
      details: { source: parsed.data.source }
    }
  });

  return Response.json({ success: true, leadId: lead.id }, { status: 200 });
}
```

### 3c. Update WALKTHROUGH.md

Update the API reference section to show the correct URL:

```
FROM: POST /api/leads/ingest
TO:   POST /api/leads/ingest/[adminId]

Remove `adminId` from the request body example entirely.
```

---

## Fix 4 — Update WALKTHROUGH.md Webhook URLs

Update all webhook URL references in the walkthrough:

| Section | From | To |
|---------|------|----|
| WhatsApp Integration → Step 5 | `/api/webhooks/whatsapp` | `/api/webhooks/whatsapp/{adminId}` |
| Facebook Lead Ads → Option 2 | `/api/webhooks/facebook` | `/api/webhooks/facebook/{adminId}` |
| API Reference → Webhooks | `/api/webhooks/whatsapp` | `/api/webhooks/whatsapp/{adminId}` |
| API Reference → Webhooks | `/api/webhooks/facebook` | `/api/webhooks/facebook/{adminId}` |

Add a note under each webhook section:
> Replace `{adminId}` with your actual Admin ID, visible in your settings page.

---

## Fix 5 — Change Default Seed Credentials

**Problem**: Default credentials are documented in WALKTHROUGH.md and are predictable.

Update `prisma/seed.ts` to use stronger defaults and add a warning:

```typescript
// prisma/seed.ts
// Change these before seeding a production database

const superAdmin = await prisma.user.upsert({
  where: { email: "superadmin@leadcrm.com" },
  create: {
    email: "superadmin@leadcrm.com",
    password: await bcrypt.hash("ChangeMe@SuperAdmin1!", 12),
    name: "Super Admin",
    role: "SUPER_ADMIN",
    status: "ACTIVE"
  },
  update: {}
});

const admin = await prisma.user.upsert({
  where: { email: "admin@leadcrm.com" },
  create: {
    email: "admin@leadcrm.com",
    password: await bcrypt.hash("ChangeMe@Admin1!", 12),
    name: "Demo Admin",
    role: "ADMIN",
    status: "ACTIVE"
  },
  update: {}
});

console.log("⚠️  IMPORTANT: Change default passwords before sharing access with anyone.");
console.log(`   Super Admin: superadmin@leadcrm.com / ChangeMe@SuperAdmin1!`);
console.log(`   Admin:       admin@leadcrm.com / ChangeMe@Admin1!`);
```

Also update `WALKTHROUGH.md` to reflect the new credentials and add:
> ⚠️ Change these passwords immediately after first login.

---

## Fix 6 — ENCRYPTION_KEY Documentation

Update `WALKTHROUGH.md` environment variables section:

```
FROM:
ENCRYPTION_KEY="your-32-char-encryption-key"

TO:
# Generate with: openssl rand -hex 32
# Must be exactly 64 hex characters (32 bytes)
# Do NOT use openssl rand -base64 32 — this will silently fail
ENCRYPTION_KEY="paste-64-char-hex-string-here"
```

---

## Summary of File Changes

| File | Action |
|------|--------|
| `src/app/api/webhooks/whatsapp/route.ts` | Delete |
| `src/app/api/webhooks/whatsapp/[adminId]/route.ts` | Create (Fix 1) |
| `src/app/api/webhooks/facebook/route.ts` | Delete |
| `src/app/api/webhooks/facebook/[adminId]/route.ts` | Create (Fix 2) |
| `src/app/api/leads/ingest/route.ts` | Delete |
| `src/app/api/leads/ingest/[adminId]/route.ts` | Create (Fix 3) |
| Settings page component | Update webhook URL display (Fix 1c) |
| `prisma/seed.ts` | Update credentials (Fix 5) |
| `WALKTHROUGH.md` | Update URLs + credentials + env var docs (Fixes 4, 5, 6) |

---

*Apply all fixes before any external demo or client access.*
