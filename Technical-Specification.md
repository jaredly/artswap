# ArtSwap Technical Specification

This document provides detailed technical specifications to complement the Implementation Plan, addressing gaps and clarifying implementation details.

---

## 1. Environment & Configuration

### Required Environment Variables

```bash
# Database
DATABASE_URL="file:./prisma/dev.db"

# Email Service (Mailgun)
MAILGUN_API_KEY="your-mailgun-api-key"
MAILGUN_DOMAIN="your-domain.com"
MAILGUN_FROM_EMAIL="noreply@your-domain.com"

# Security
SESSION_SECRET="your-secure-random-session-secret"
JWT_SECRET="your-secure-random-jwt-secret"
BCRYPT_ROUNDS="12"

# File Storage
IMAGE_UPLOAD_PATH="./uploads/images"
MAX_FILE_SIZE_MB="10"
ALLOWED_IMAGE_TYPES="image/jpeg,image/png,image/webp"

# Application
NODE_ENV="development" # development | production | test
PORT="3000"
BASE_URL="http://localhost:3000" # Used for email links

# Monitoring (Production)
SENTRY_DSN="your-sentry-dsn"
LOG_LEVEL="info" # error | warn | info | debug
```

### Environment Setup Script

```bash
# setup-env.sh
#!/bin/bash
cp .env.example .env
echo "Please configure the following in .env:"
echo "- MAILGUN_API_KEY"
echo "- MAILGUN_DOMAIN"
echo "- SESSION_SECRET (generate with: openssl rand -base64 32)"
echo "- JWT_SECRET (generate with: openssl rand -base64 32)"
```

---

## 2. Package Management

**Standard: Use `pnpm` throughout the entire project**

### Required Dependencies

```json
{
  "dependencies": {
    "@prisma/client": "^5.0.0",
    "@react-router/node": "^7.0.0",
    "@react-router/serve": "^7.0.0",
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-router": "^7.0.0",
    "bcryptjs": "^2.4.3",
    "sharp": "^0.32.0",
    "mailgun.js": "^9.0.0",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.0.0",
    "zod": "^3.22.0",
    "winston": "^3.10.0",
    "uuid": "^9.0.0",
    "mime-types": "^2.1.35",
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/sortable": "^8.0.0",
    "@dnd-kit/utilities": "^3.2.2"
  },
  "devDependencies": {
    "@biomejs/biome": "^1.0.0",
    "@types/bcryptjs": "^2.4.0",
    "@types/mime-types": "^2.1.0",
    "@types/uuid": "^9.0.0",
    "@react-router/dev": "^7.0.0",
    "prisma": "^5.0.0",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "playwright": "^1.40.0"
  }
}
```

### React Router v7 Configuration

```typescript
// react-router.config.ts
import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  serverModuleFormat: "esm",
  future: {
    v3_fetcherPersist: true,
    v3_relativeSplatPath: true,
    v3_throwAbortReason: true,
  },
} satisfies Config;
```

```json
// Package.json scripts
{
  "scripts": {
    "build": "react-router build",
    "dev": "react-router dev",
    "start": "react-router-serve ./build/server/index.js",
    "typecheck": "tsc"
  }
}
```

---

## 3. Image Processing Specification

### Supported Formats & Limits

```typescript
const IMAGE_CONFIG = {
  supportedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxDimensions: {
    width: 4000,
    height: 4000
  },
  thumbnailSizes: {
    small: { width: 300, height: 300 },
    medium: { width: 800, height: 800 },
    large: { width: 1200, height: 1200 }
  },
  quality: {
    jpeg: 85,
    webp: 80
  }
};
```

### Image Processing Pipeline

```typescript
interface ImageProcessingResult {
  original: string;      // Original file path
  thumbnail: string;     // 300x300 thumbnail
  medium: string;        // 800x800 display size
  large: string;         // 1200x1200 full size
  metadata: {
    originalSize: number;
    processedSizes: Record<string, number>;
    format: string;
    dimensions: { width: number; height: number };
  };
}
```

### File Organization

```
uploads/
├── images/
│   ├── {year}/
│   │   ├── {month}/
│   │   │   ├── original/
│   │   │   ├── thumbnails/
│   │   │   ├── medium/
│   │   │   └── large/
└── temp/ # For processing
```

---

## 4. Email Service Specification

### Email Templates with React Email

**Additional Dependencies:**
```json
{
  "dependencies": {
    "@react-email/components": "^0.0.12",
    "@react-email/render": "^0.0.10"
  },
  "devDependencies": {
    "@react-email/tailwind": "^0.0.11"
  }
}
```

**Template Structure:**
```
app/
├── lib/
│   └── email/
│       ├── templates/           # React Email templates
│       │   ├── welcome.tsx
│       │   ├── verify-email.tsx
│       │   ├── password-reset.tsx
│       │   ├── group-invitation.tsx
│       │   ├── match-notification.tsx
│       │   └── event-phase-change.tsx
│       ├── components/          # Reusable email components
│       │   ├── email-layout.tsx
│       │   ├── button.tsx
│       │   └── artwork-card.tsx
│       └── send.ts              # Email sending service
```

**Example Template (Match Notification):**
```typescript
// app/lib/email/templates/match-notification.tsx
import {
  Body, Container, Head, Html, Preview, Section, Text,
  Img, Button, Hr
} from '@react-email/components';
import { EmailLayout } from '../components/email-layout';

interface MatchNotificationProps {
  artistName: string;
  matchedArtworkTitle: string;
  matchedArtworkImage: string;
  yourArtworkTitle: string;
  yourArtworkImage: string;
  eventName: string;
  viewMatchUrl: string;
}

export default function MatchNotification({
  artistName,
  matchedArtworkTitle,
  matchedArtworkImage,
  yourArtworkTitle,
  yourArtworkImage,
  eventName,
  viewMatchUrl
}: MatchNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>🎉 You have a new art match in {eventName}!</Preview>
      <Body style={{ fontFamily: 'system-ui, sans-serif' }}>
        <EmailLayout>
          <Container style={{ maxWidth: '600px', margin: '0 auto' }}>
            <Section style={{ textAlign: 'center', padding: '40px 20px' }}>
              <Text style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                🎨 Art Match Found!
              </Text>

              <Text style={{ fontSize: '16px', color: '#6b7280', marginBottom: '30px' }}>
                Congratulations {artistName}! You and another artist have mutually liked each other's work in <strong>{eventName}</strong>.
              </Text>

              <Hr style={{ margin: '30px 0' }} />

              <Section style={{ display: 'flex', justifyContent: 'space-around', margin: '30px 0' }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                  <Text style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '10px' }}>
                    Your Artwork
                  </Text>
                  <Img
                    src={yourArtworkImage}
                    alt={yourArtworkTitle}
                    style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <Text style={{ fontSize: '16px', fontWeight: '600', marginTop: '10px' }}>
                    {yourArtworkTitle}
                  </Text>
                </div>

                <div style={{ textAlign: 'center', flex: 1 }}>
                  <Text style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '10px' }}>
                    Matched Artwork
                  </Text>
                  <Img
                    src={matchedArtworkImage}
                    alt={matchedArtworkTitle}
                    style={{ width: '200px', height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                  />
                  <Text style={{ fontSize: '16px', fontWeight: '600', marginTop: '10px' }}>
                    {matchedArtworkTitle}
                  </Text>
                </div>
              </Section>

              <Button
                href={viewMatchUrl}
                style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '12px 24px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '600',
                  display: 'inline-block',
                  margin: '20px 0'
                }}
              >
                View Your Match
              </Button>

              <Text style={{ fontSize: '14px', color: '#9ca3af', marginTop: '30px' }}>
                Connect with your matched artist and explore each other's work!
              </Text>
            </Section>
          </Container>
        </EmailLayout>
      </Body>
    </Html>
  );
}
```

**Reusable Email Layout:**
```typescript
// app/lib/email/components/email-layout.tsx
import { Body, Container, Head, Html, Section, Text, Img } from '@react-email/components';

interface EmailLayoutProps {
  children: React.ReactNode;
  previewText?: string;
}

export function EmailLayout({ children, previewText }: EmailLayoutProps) {
  return (
    <>
      <Head>
        <style>{`
          @media (max-width: 600px) {
            .mobile-hidden { display: none !important; }
            .mobile-full { width: 100% !important; }
          }
        `}</style>
      </Head>

      <Body style={{ backgroundColor: '#f9fafb', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: 'white' }}>
          {/* Header */}
          <Section style={{
            backgroundColor: '#1f2937',
            padding: '20px',
            textAlign: 'center'
          }}>
            <Img
              src="https://your-domain.com/logo-white.png"
              alt="ArtSwap"
              width="120"
              style={{ margin: '0 auto' }}
            />
          </Section>

          {/* Content */}
          {children}

          {/* Footer */}
          <Section style={{
            backgroundColor: '#f3f4f6',
            padding: '20px',
            textAlign: 'center',
            borderTop: '1px solid #e5e7eb'
          }}>
            <Text style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>
              © 2024 ArtSwap. All rights reserved.
            </Text>
            <Text style={{ fontSize: '12px', color: '#6b7280', margin: '5px 0 0 0' }}>
              <a href="{unsubscribe_url}" style={{ color: '#6b7280' }}>Unsubscribe</a> |
              <a href="https://your-domain.com/privacy" style={{ color: '#6b7280', marginLeft: '5px' }}>Privacy Policy</a>
            </Text>
          </Section>
        </Container>
      </Body>
    </>
  );
}
```

**Email Service Integration:**
```typescript
// app/lib/email/send.ts
import { render } from '@react-email/render';
import Mailgun from 'mailgun.js';
import WelcomeEmail from './templates/welcome';
import MatchNotification from './templates/match-notification';
// ... other templates

const mailgun = new Mailgun(FormData);
const mg = mailgun.client({
  username: 'api',
  key: process.env.MAILGUN_API_KEY!,
});

interface EmailData {
  to: string;
  subject: string;
  template: React.ComponentType<any>;
  props: any;
}

export async function sendEmail({ to, subject, template: Template, props }: EmailData) {
  try {
    // Render React component to HTML
    const html = render(<Template {...props} />);
    const text = render(<Template {...props} />, { plainText: true });

    const result = await mg.messages.create(process.env.MAILGUN_DOMAIN!, {
      from: process.env.MAILGUN_FROM_EMAIL!,
      to: [to],
      subject,
      html,
      text,
      'o:tracking': 'yes',
      'o:tracking-clicks': 'yes',
      'o:tracking-opens': 'yes'
    });

    return { success: true, messageId: result.id };
  } catch (error) {
    console.error('Email send failed:', error);
    return { success: false, error: error.message };
  }
}

// Convenience functions for each email type
export const emailService = {
  sendWelcome: (to: string, props: any) =>
    sendEmail({ to, subject: 'Welcome to ArtSwap!', template: WelcomeEmail, props }),

  sendMatchNotification: (to: string, props: any) =>
    sendEmail({ to, subject: '🎨 You have a new art match!', template: MatchNotification, props }),

  // ... other email types
};
```

**Email Development & Preview:**
```json
// Package.json scripts for email development
{
  "scripts": {
    "email:dev": "email dev --dir app/lib/email/templates",
    "email:export": "email export --dir app/lib/email/templates --out ./email-previews"
  }
}
```

**Email Preview Server:**
Run `pnpm email:dev` to start a local preview server at http://localhost:3000 where you can:
- Preview all email templates
- Test with different data
- See mobile/desktop views
- Generate HTML exports

**Template Props Types:**
```typescript
// app/lib/email/types.ts
export interface WelcomeEmailProps {
  artistName: string;
  verificationUrl: string;
}

export interface VerificationEmailProps {
  artistName: string;
  verificationUrl: string;
  expirationTime: string;
}

export interface PasswordResetProps {
  artistName: string;
  resetUrl: string;
  expirationTime: string;
}

export interface GroupInvitationProps {
  inviteeName: string;
  inviterName: string;
  groupName: string;
  joinUrl: string;
  expirationDate: string;
}

export interface EventPhaseChangeProps {
  artistName: string;
  eventName: string;
  oldPhase: string;
  newPhase: string;
  actionUrl: string;
  actionText: string;
}
```

**Usage in Route Actions:**
```typescript
// Example: In routes/admin.tsx action
import { emailService } from '~/lib/email/send';

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const eventId = formData.get('eventId') as string;

  if (formData.get('intent') === 'transition-to-voting') {
    // Notify all participants
    const participants = await db.eventParticipation.findMany({
      where: { eventId },
      include: { artist: true, event: true }
    });

    for (const participant of participants) {
      await emailService.sendEventPhaseChange(participant.artist.email, {
        artistName: participant.artist.fullName,
        eventName: participant.event.name,
        oldPhase: 'submission',
        newPhase: 'voting',
        actionUrl: `${process.env.BASE_URL}/events/${eventId}`,
        actionText: 'Start Voting'
      });
    }
  }

  return json({ success: true });
}
```

### Email Configuration

```typescript
interface EmailConfig {
  from: string;
  replyTo?: string;
  retryAttempts: number;
  retryDelay: number; // milliseconds
  trackOpens: boolean;
  trackClicks: boolean;
}

const MAILGUN_CONFIG: EmailConfig = {
  from: 'ArtSwap <noreply@artswap.com>',
  retryAttempts: 3,
  retryDelay: 5000,
  trackOpens: true,
  trackClicks: true
};
```

### Email Delivery Handling

```typescript
interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  retryCount: number;
}

// Failed emails are logged and can be retried via admin interface
```

---

## 5. Security Implementation

### Password Requirements

```typescript
const PASSWORD_POLICY = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxLength: 128,
  forbiddenPatterns: [
    'password', '123456', 'qwerty', 'artswap'
  ]
};
```

### Rate Limiting Configuration

```typescript
const RATE_LIMITS = {
  login: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 attempts per window
    skipSuccessfulRequests: true
  },
  passwordReset: {
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3 // 3 reset attempts per hour
  },
  imageUpload: {
    windowMs: 60 * 1000, // 1 minute
    max: 10 // 10 uploads per minute
  },
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // 100 requests per window
  }
};
```

### Input Validation

```typescript
// Use Zod schemas for all input validation
const CreateArtworkSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional(),
  medium: z.string().max(100).optional(),
  dimensions: z.string().max(100).optional(),
  year: z.number().int().min(1800).max(new Date().getFullYear()),
  images: z.array(z.string()).min(1).max(10)
});
```

### Security Headers

```typescript
const SECURITY_HEADERS = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"]
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
};
```

---

## 6. Permission & Role System

### Permission Matrix

| Action | User | Group Admin | Super Admin |
|--------|------|-------------|-------------|
| View own artworks | ✅ | ✅ | ✅ |
| Submit to events | ✅ | ✅ | ✅ |
| Vote in events | ✅ | ✅ | ✅ |
| Create groups | ❌ | ✅ | ✅ |
| Manage group events | ❌ | ✅ (own group) | ✅ |
| Invite to groups | ❌ | ✅ (own group) | ✅ |
| Flag content | ✅ | ✅ | ✅ |
| Remove users | ❌ | ✅ (from own group) | ✅ |
| Change event phases | ❌ | ✅ (own group) | ✅ |
| View all audit logs | ❌ | ✅ (own group) | ✅ |
| Manage any group | ❌ | ❌ | ✅ |
| Delete any content | ❌ | ❌ | ✅ |

### Authorization Guards

```typescript
interface AuthContext {
  user: Artist;
  isGroupAdmin: (groupId: string) => boolean;
  isSuperAdmin: () => boolean;
  canManageEvent: (eventId: string) => boolean;
  canManageUser: (userId: string) => boolean;
}
```

---

## 7. Event Phase Management

### Phase Transition Rules

```typescript
enum EventPhase {
  OPEN = 'open',           // Artists can submit artworks
  VOTING = 'voting',       // Artists can vote on submissions
  CLOSED = 'closed',       // Matching complete, results visible
  ARCHIVED = 'archived'    // Historical record
}

const PHASE_TRANSITIONS = {
  [EventPhase.OPEN]: [EventPhase.VOTING],
  [EventPhase.VOTING]: [EventPhase.CLOSED],
  [EventPhase.CLOSED]: [EventPhase.ARCHIVED],
  [EventPhase.ARCHIVED]: [] // Terminal state
};
```

### Phase Transition Logic

```typescript
interface PhaseTransitionRules {
  canTransition: (from: EventPhase, to: EventPhase) => boolean;
  requiresConfirmation: (transition: string) => boolean;
  automaticTriggers: Record<EventPhase, AutoTrigger>;
}

interface AutoTrigger {
  condition: 'time' | 'submission_count' | 'vote_completion';
  value?: number | Date;
  enabled: boolean;
}
```

### Enhanced Voting Flow Specification

**Step 1: Sequential Voting (Tinder-Style)**
```typescript
interface VotingSession {
  eventId: string;
  artworkQueue: Artwork[];
  currentIndex: number;
  votes: VoteData[];
}

interface VoteData {
  artworkId: string;
  liked: boolean;
  timestamp: Date;
}
```

**Step 2: Vote Overview & Preference Ordering**
```typescript
interface VoteOverview {
  liked: Array<{
    artwork: Artwork;
    preferenceOrder: number; // 1 = most preferred
  }>;
  passed: Artwork[];
  canModify: boolean; // false if finalizedAt is not null
  finalizedAt?: Date; // when votes were locked, undefined if not finalized
}

// User can:
// 1. Drag to reorder liked artworks (changes preferenceOrder)
// 2. Move artwork from liked to passed (sets liked = false, preferenceOrder = null)
// 3. Move artwork from passed to liked (sets liked = true, assigns preferenceOrder)
```

**Step 3: Vote Finalization**
```typescript
interface VoteFinalization {
  artistId: string;
  eventId: string;
  finalizedVotes: Array<{
    artworkId: string;
    liked: boolean;
    preferenceOrder?: number;
  }>;
  finalizedAt: Date;
}

// Once finalized:
// - All votes for this artist/event get finalizedAt timestamp
// - No further modifications allowed (finalizedAt !== null)
// - Preference order locked for matching algorithm
// - Provides audit trail of when votes were locked
```

### Voting Finalization

When transitioning from VOTING to CLOSED:
1. Auto-finalize any unfinalized votes (set finalizedAt to current timestamp)
2. Calculate mutual likes using preference order for tie-breaking
3. Create Match records prioritizing higher preference matches
4. Send match notifications
5. Lock all votes (finalizedAt prevents further changes)
6. Update event phase
7. Log transition in audit log with finalization timestamps

---

## 8. Matching Algorithm Specification

### Preference-Based Matching Algorithm

```typescript
interface MatchingResult {
  matches: Array<{
    artwork1Id: string;
    artwork2Id: string;
    artist1PreferenceOrder: number;
    artist2PreferenceOrder: number;
    combinedScore: number; // Lower is better (sum of preference orders)
  }>;
  unmatched: string[]; // Artwork IDs with no matches
  statistics: {
    totalVotes: number;
    totalMatches: number;
    participationRate: number;
    averagePreferenceScore: number;
  };
}

async function calculateMatches(eventId: string): Promise<MatchingResult> {
  // 1. Get all votes for the event where finalizedAt is not null and liked = true
  // 2. For each artwork pair, check if both artists liked each other's work
  // 3. Calculate combined preference score (sum of both preference orders)
  // 4. Sort potential matches by combined score (lower = more preferred)
  // 5. Create matches starting with highest mutual preference
  // 6. Remove matched artworks from further consideration
  // 7. Return results with preference-based statistics and finalization timestamps
}
```

### Enhanced Matching Rules

When creating matches, priority order:
1. **Mutual Preference Score**: Sum of both artists' preference orders (lower = better)
2. **Individual Preference**: If tied, prioritize matches where at least one artist ranked it #1
3. **Vote Timing**: If still tied, earlier votes win (first-come-first-served)
4. **Admin Override**: Manual match assignment always takes precedence

---

## 9. API Design Standards

### Response Format

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string>;
  };
  meta?: {
    pagination?: PaginationInfo;
    timestamp: string;
    requestId: string;
  };
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
```

### Error Codes

```typescript
const ERROR_CODES = {
  // Authentication
  AUTH_INVALID_CREDENTIALS: 'Invalid email or password',
  AUTH_TOKEN_EXPIRED: 'Authentication token has expired',
  AUTH_INSUFFICIENT_PERMISSIONS: 'Insufficient permissions',

  // Validation
  VALIDATION_INVALID_INPUT: 'Invalid input data',
  VALIDATION_MISSING_FIELD: 'Required field is missing',

  // Business Logic
  EVENT_INVALID_PHASE: 'Invalid event phase for this action',
  ARTWORK_LIMIT_EXCEEDED: 'Submission limit exceeded',
  VOTE_ALREADY_CAST: 'Vote already cast for this artwork',

  // System
  FILE_UPLOAD_FAILED: 'File upload failed',
  EMAIL_DELIVERY_FAILED: 'Email delivery failed',
  DATABASE_ERROR: 'Database operation failed'
};
```

---

## 10. Project Structure

```
app/
├── lib/
│   ├── auth/              # Authentication utilities
│   ├── db/                # Database layer & Prisma client
│   ├── email/             # Email service & templates
│   ├── image/             # Image processing utilities
│   ├── validation/        # Zod schemas
│   ├── permissions/       # Authorization logic
│   └── utils/             # General utilities
├── components/
│   ├── ui/                # Basic UI components
│   ├── forms/             # Form components
│   ├── navigation/        # Minimal navigation (bottom nav, floating actions)
│   ├── artwork/           # Artwork display components
│   └── voting/            # Voting interface components
├── routes/
│   ├── _auth.tsx          # Auth layout route
│   ├── login.tsx          # Login page
│   ├── signup.tsx         # Signup page
│   ├── groups.tsx         # Groups listing
│   ├── groups.$groupId.tsx # Group details
│   ├── events.$eventId.tsx # Event details with loaders/actions
│   ├── portfolio.tsx      # Portfolio management
│   ├── admin.tsx          # Admin dashboard
│   └── matches.tsx        # Match history
├── types/                 # TypeScript type definitions
├── styles/                # Tailwind components & themes
├── public/                # Static assets
├── react-router.config.ts # React Router configuration
└── server.ts              # Optional custom server
```

### React Router v7 Route Patterns

```typescript
// Example: routes/events.$eventId.tsx
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { json, useLoaderData, useActionData } from "react-router";
import { db } from "~/lib/db";
import { requireAuth } from "~/lib/auth";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const user = await requireAuth(request);
  const event = await db.event.findUnique({
    where: { id: params.eventId },
    include: { artworks: true, votes: true }
  });

  if (!event) {
    throw new Response("Event not found", { status: 404 });
  }

  return json({ event, user });
}

export async function action({ params, request }: ActionFunctionArgs) {
  const user = await requireAuth(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  switch (intent) {
    case "vote":
      // Handle voting logic
      break;
    case "submit-artwork":
      // Handle artwork submission
      break;
    default:
      throw new Response("Invalid action", { status: 400 });
  }

  return json({ success: true });
}

export default function EventPage() {
  const { event, user } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  return (
    <div>
      {/* Event UI with forms that submit to action */}
    </div>
  );
}
```

---

## 11. Testing Strategy

### Unit Test Coverage

```typescript
// Each module requires:
// - Happy path tests
// - Error condition tests
// - Edge case tests
// - Permission/authorization tests

describe('Voting System', () => {
  test('should record vote successfully');
  test('should prevent duplicate votes');
  test('should enforce event phase restrictions');
  test('should calculate matches correctly');
  test('should handle edge cases (self-voting, etc.)');
});
```

### Integration Test Scenarios

```typescript
// End-to-end user flows:
const E2E_SCENARIOS = [
  'complete_onboarding_flow',
  'create_and_join_group',
  'submit_artwork_to_event',
  'complete_voting_cycle',
  'receive_match_notification',
  'admin_moderate_content',
  'password_reset_flow'
];
```

### Performance Benchmarks

```typescript
const PERFORMANCE_TARGETS = {
  pageLoadTime: '< 2 seconds',
  imageUploadTime: '< 10 seconds',
  voteSubmission: '< 500ms',
  matchCalculation: '< 5 seconds (100 artworks)',
  emailDelivery: '< 30 seconds'
};
```

---

## 12. Accessibility Requirements

### WCAG 2.1 AA Compliance

```typescript
const ACCESSIBILITY_CHECKLIST = {
  colorContrast: 'Minimum 4.5:1 ratio',
  keyboardNavigation: 'All interactive elements accessible',
  screenReader: 'Proper ARIA labels and roles',
  focusManagement: 'Visible focus indicators',
  alternativeText: 'All images have alt text',
  formLabels: 'All form inputs properly labeled',
  headingStructure: 'Logical heading hierarchy',
  skipLinks: 'Skip to main content available'
};
```

### Testing Tools

- **axe-core**: Automated accessibility testing
- **NVDA/JAWS**: Screen reader testing
- **Keyboard navigation**: Tab order validation
- **Color contrast analyzer**: Manual validation

---

## 12.5. Mobile-First Minimal Design Principles

### Core Philosophy
- **Task-Focused**: Design for specific user intents and flows
- **Single-Track**: Guide users through linear workflows
- **Minimal Chrome**: Only essential UI elements visible
- **Context-Aware**: Show relevant actions based on current state

### Navigation Pattern
```typescript
// Minimal hamburger menu - secondary navigation only
const HamburgerMenu = {
  items: [
    { icon: 'home', label: 'Home', route: '/home' },
    { icon: 'palette', label: 'My Portfolio', route: '/portfolio' },
    { icon: 'users', label: 'Groups', route: '/groups' },
    { icon: 'heart', label: 'Matches', route: '/matches' },
    { icon: 'settings', label: 'Settings', route: '/profile' }
  ]
};

// Context-aware floating actions
const FloatingActions = {
  '/events/:id': { icon: 'plus', label: 'Submit Art', primary: true },
  '/events/:id/voting': { icon: 'heart', label: 'Vote', primary: true },
  '/portfolio': { icon: 'plus', label: 'Add Artwork', primary: true }
};
```

### Layout Structure
```typescript
// Ultra-minimal layout - page header + content
<header className="flex items-center justify-between p-4">
  <BackButton />
  <PageTitle />
  <HamburgerMenu />
</header>
<main className="flex-1"> {/* Full-screen content */}
  <Outlet />
</main>
<FloatingAction /> {/* Context-aware */}
```

### Single-Track User Flows
```typescript
// Primary user journeys - focused and linear
const UserFlows = {
  submitArtwork: [
    '/events/:id',           // See event details
    '/events/:id/submit',    // Submit artwork form
    '/portfolio'             // Confirmation & manage submissions
  ],

  voteInEvent: [
    '/events/:id/voting',    // Sequential Tinder-style voting
    '/events/:id/summary',   // Review & reorder preferences
    '/events/:id/finalize',  // Final review before locking votes
    '/events/:id'            // Event details with vote confirmation
  ],

  checkMatches: [
    '/matches',              // Match notifications & history
    '/matches/:id',          // Individual match details
    '/events/:id'            // Back to event context
  ]
};
```

### Design Guidelines
- **Touch Targets**: Minimum 44px (11rem) for all interactive elements
- **Spacing**: Use consistent 4px base unit (Tailwind's spacing scale)
- **Typography**: Clear hierarchy, readable at mobile sizes
- **Colors**: High contrast, minimal palette
- **Animations**: Subtle, functional (not decorative)
- **Flow Indicators**: Show progress in multi-step processes
- **Context Preservation**: Always clear where user is and how to go back

---

## 13. Deployment & DevOps

### CI/CD Pipeline

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm run build
      - run: pnpm run lint
      - run: pnpm run test
      - run: pnpm run test:e2e
```

### Environment-Specific Configurations

```typescript
const CONFIG = {
  development: {
    database: 'file:./dev.db',
    logLevel: 'debug',
    emailProvider: 'console', // Log emails instead of sending
    imageProcessing: 'immediate'
  },
  production: {
    database: process.env.DATABASE_URL,
    logLevel: 'warn',
    emailProvider: 'mailgun',
    imageProcessing: 'queue' // Background processing
  }
};
```

---

## 14. Monitoring & Error Handling

### Logging Configuration

```typescript
const WINSTON_CONFIG = {
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
};
```

### Error Monitoring

```typescript
// Sentry configuration for production
const SENTRY_CONFIG = {
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
  profilesSampleRate: 0.1,
  beforeSend(event) {
    // Filter out sensitive information
    if (event.request?.headers) {
      delete event.request.headers.authorization;
    }
    return event;
  }
};
```

---

## 15. Data Backup & Recovery

### Backup Strategy

```bash
#!/bin/bash
# backup-db.sh
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"
mkdir -p $BACKUP_DIR

# SQLite backup
sqlite3 ./prisma/dev.db ".backup $BACKUP_DIR/artswap_$DATE.db"

# Image backup (production only)
if [ "$NODE_ENV" = "production" ]; then
  tar -czf "$BACKUP_DIR/images_$DATE.tar.gz" ./uploads/images/
fi

# Cleanup old backups (keep last 30 days)
find $BACKUP_DIR -name "*.db" -mtime +30 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
```

### Recovery Procedures

1. **Database Recovery**: Restore from backup file
2. **Image Recovery**: Extract from backup archive
3. **User Data Export**: GDPR compliance utility
4. **Partial Recovery**: Event-specific data restoration

---

This technical specification provides the detailed implementation guidance needed to build ArtSwap according to the Implementation Plan. Each section should be referenced during development to ensure consistency and completeness.