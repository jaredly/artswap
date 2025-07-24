# ArtSwap Step-by-Step Implementation Guide

This guide provides a detailed, checkbox-driven roadmap for implementing ArtSwap from start to finish. Each checkbox represents a single, actionable task that can be completed independently.

---

## Phase 1: Project Setup & Foundation

### 1.1 Initial Project Setup
- [x] Run `npx create-react-router@latest .` to scaffold the project
- [x] Initialize git repository: `git init && git add . && git commit -m "Initial commit"`
- [x] Create `.gitignore` file with node_modules, .env, logs/, uploads/, build/
- [x] Set up remote repository and push initial commit
- [x] Install additional dependencies:
  ```bash
  pnpm add @prisma/client bcryptjs sharp mailgun.js helmet express-rate-limit zod winston uuid mime-types @react-email/components @react-email/render @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
  ```
- [x] Install dev dependencies:
  ```bash
  pnpm add -D @biomejs/biome @types/bcryptjs @types/mime-types @types/uuid @react-router/dev prisma vitest @testing-library/react @testing-library/jest-dom playwright @react-email/tailwind
  ```

### 1.2 Biome Configuration
- [x] Run `npx biome init` to create biome.json
- [x] Configure biome.json with TypeScript, React, and formatting rules
- [x] Add Biome scripts to package.json:
  ```json
  {
    "scripts": {
      "lint": "biome check .",
      "lint:fix": "biome check --apply .",
      "format": "biome format --write ."
    }
  }
  ```
- [x] Run initial format: `pnpm format`

### 1.3 Environment Configuration
- [x] Create `.env.example` file with all required environment variables
- [x] Create `.env` file from example
- [x] Generate SESSION_SECRET: `openssl rand -base64 32`
- [x] Generate JWT_SECRET: `openssl rand -base64 32`
- [x] Create `setup-env.sh` script from Technical Specification
- [x] Make setup script executable: `chmod +x setup-env.sh`

### 1.4 React Router Configuration
- [x] Create `react-router.config.ts` with SSR configuration from Technical Specification
- [x] Update package.json scripts for React Router v7:
  ```json
  {
    "scripts": {
      "build": "react-router build",
      "dev": "react-router dev",
      "start": "react-router-serve ./build/server/index.js",
      "typecheck": "tsc",
      "email:dev": "email dev --dir app/lib/email/templates",
      "email:export": "email export --dir app/lib/email/templates --out ./email-previews"
    }
  }
  ```

---

## Phase 2: Database & Prisma Setup

### 2.1 Prisma Initialization
- [x] Run `npx prisma init` to create Prisma configuration
- [x] Update `prisma/schema.prisma` with the complete schema from the project
- [x] Set DATABASE_URL in .env to `file:./dev.db`
- [x] Run `npx prisma migrate dev --name initial-schema` to create database
- [x] Run `npx prisma generate` to generate Prisma client

### 2.2 Database Utilities Setup
- [x] Create `app/lib/db/index.ts` file with Prisma client singleton
- [x] Create `app/lib/db/seed.ts` with sample data for development
- [x] Add seed script to package.json: `"db:seed": "tsx app/lib/db/seed.ts"`
- [x] Run seed script: `pnpm db:seed`

### 2.3 Database Access Layer
- [x] Create `app/lib/db/artist.ts` with CRUD functions for Artist model
- [x] Create `app/lib/db/group.ts` with CRUD functions for Group model
- [x] Create `app/lib/db/event.ts` with CRUD functions for Event model
- [x] Create `app/lib/db/artwork.ts` with CRUD functions for Artwork model
- [x] Create `app/lib/db/vote.ts` with CRUD functions for Vote model
- [x] Create `app/lib/db/match.ts` with CRUD functions and matching algorithm
- [x] Create `app/lib/db/notification.ts` with CRUD functions for Notification model

---

## Phase 3: Authentication & Security

### 3.1 Authentication Utilities
- [x] Create `app/lib/auth/password.ts` with bcrypt hashing functions
- [x] Create `app/lib/auth/session.ts` with session management
- [x] Create `app/lib/auth/tokens.ts` with JWT and verification token utilities
- [x] Create `app/lib/auth/guards.ts` with authentication guards for routes
- [x] Create `app/lib/auth/index.ts` exporting all auth utilities

### 3.2 Validation Schemas
- [x] Create `app/lib/validation/auth.ts` with login/signup schemas
- [x] Create `app/lib/validation/artwork.ts` with artwork validation schemas
- [x] Create `app/lib/validation/group.ts` with group management schemas
- [x] Create `app/lib/validation/event.ts` with event management schemas
- [x] Create `app/lib/validation/index.ts` exporting all schemas

### 3.3 Permission System
- [x] Create `app/lib/permissions/roles.ts` with role definitions and checks
- [x] Create `app/lib/permissions/guards.ts` with authorization guard functions
- [x] Create `app/lib/permissions/context.ts` with AuthContext interface
- [x] Create `app/lib/permissions/index.ts` exporting permission utilities

---

## Phase 4: File Upload & Image Processing

### 4.1 Image Processing Setup
- [x] Create `uploads/images/` directory structure (year/month/original/thumbnails/medium/large)
- [x] Create `app/lib/image/config.ts` with image configuration constants
- [x] Create `app/lib/image/process.ts` with Sharp image processing functions
- [x] Create `app/lib/image/upload.ts` with file upload handling
- [x] Create `app/lib/image/validate.ts` with file validation functions
- [x] Create `app/lib/image/index.ts` exporting image utilities

### 4.2 File Upload Route
- [x] Create `app/routes/api.upload.ts` with image upload API endpoint
- [x] Implement file validation, processing, and storage
- [x] Add rate limiting for upload endpoint
- [x] Add error handling and logging

---

## Phase 5: Email System

### 5.1 Email Templates
- [x] Create `app/lib/email/components/email-layout.tsx` with base email layout
- [x] Create `app/lib/email/components/button.tsx` with email button component
- [x] Create `app/lib/email/components/artwork-card.tsx` with artwork display component
- [x] Create `app/lib/email/templates/welcome.tsx` with welcome email template
- [x] Create `app/lib/email/templates/verify-email.tsx` with verification email
- [x] Create `app/lib/email/templates/password-reset.tsx` with reset email
- [x] Create `app/lib/email/templates/group-invitation.tsx` with invitation email
- [x] Create `app/lib/email/templates/match-notification.tsx` with match email
- [x] Create `app/lib/email/templates/event-phase-change.tsx` with phase change email

### 5.2 Email Service
- [ ] Create `app/lib/email/types.ts` with email prop interfaces
- [ ] Create `app/lib/email/send.ts` with Mailgun integration and email service
- [ ] Create `app/lib/email/index.ts` exporting email utilities
- [ ] Test email preview server: `pnpm email:dev`

---

## Phase 6: Core Routes & Pages

### 6.1 Authentication Routes
- [ ] Create `app/routes/_auth.tsx` with authentication layout
- [ ] Create `app/routes/login.tsx` with login page and action
- [ ] Create `app/routes/signup.tsx` with signup page and action
- [ ] Create `app/routes/verify-email.tsx` with email verification
- [ ] Create `app/routes/forgot-password.tsx` with password reset request
- [ ] Create `app/routes/reset-password.tsx` with password reset form
- [ ] Create `app/routes/logout.tsx` with logout action

### 6.2 Onboarding Routes
- [ ] Create `app/routes/onboarding.tsx` with onboarding flow
- [ ] Create `app/routes/invitation.$token.tsx` with invitation acceptance
- [ ] Implement email verification flow
- [ ] Implement group invitation flow

### 6.3 Main Application Routes
- [ ] Create `app/routes/_app.tsx` with minimal app layout (page header + hamburger only)
- [ ] Create `app/routes/home.tsx` with current events and quick actions
- [ ] Create `app/routes/portfolio.tsx` with artwork management (focused on current event)
- [ ] Create `app/routes/groups.tsx` with groups listing
- [ ] Create `app/routes/groups.$groupId.tsx` with group details and active events
- [ ] Create `app/routes/matches.tsx` with match history and notifications
- [ ] Create `app/routes/profile.tsx` with user settings (minimal, accessible via menu)

### 6.4 Event Management Routes
- [ ] Create `app/routes/events.$eventId.tsx` with event details, voting, submission
- [ ] Implement artwork submission functionality
- [ ] Implement Tinder-style voting interface
- [ ] Implement vote summary and finalization
- [ ] Implement event phase transitions

### 6.5 Admin Routes
- [ ] Create `app/routes/admin.tsx` with admin dashboard
- [ ] Create `app/routes/admin.groups.tsx` with group management
- [ ] Create `app/routes/admin.events.tsx` with event management and algorithm selection
- [ ] Create `app/routes/admin.users.tsx` with user management
- [ ] Create `app/routes/admin.moderation.tsx` with content moderation
- [ ] Create `app/routes/admin.matching.tsx` with algorithm monitoring and manual triggers

---

## Phase 7: UI Components

### 7.1 Basic UI Components
- [ ] Create `app/components/ui/button.tsx` with button variants
- [ ] Create `app/components/ui/input.tsx` with form input component
- [ ] Create `app/components/ui/card.tsx` with card component
- [ ] Create `app/components/ui/modal.tsx` with modal component
- [ ] Create `app/components/ui/toast.tsx` with notification component
- [ ] Create `app/components/ui/spinner.tsx` with loading spinner
- [ ] Create `app/components/ui/badge.tsx` with status badges
- [ ] Create `app/components/ui/dropdown.tsx` with dropdown menu
- [ ] Create `app/components/ui/tabs.tsx` with tab navigation
- [ ] Create `app/components/ui/progress.tsx` with progress bar

### 7.2 Minimal Navigation Components
- [ ] Create `app/components/navigation/hamburger-menu.tsx` with slide-out menu
- [ ] Create `app/components/navigation/floating-action.tsx` with context-aware floating action
- [ ] Create `app/components/navigation/back-button.tsx` with simple back navigation
- [ ] Create `app/components/navigation/page-header.tsx` with minimal page title and menu button
- [ ] Create `app/components/navigation/breadcrumb-path.tsx` for deep navigation context

### 7.3 Form Components
- [ ] Create `app/components/forms/form-field.tsx` with form field wrapper
- [ ] Create `app/components/forms/textarea.tsx` with textarea component
- [ ] Create `app/components/forms/select.tsx` with select dropdown
- [ ] Create `app/components/forms/checkbox.tsx` with checkbox component
- [ ] Create `app/components/forms/file-upload.tsx` with drag-drop file upload
- [ ] Create `app/components/forms/image-upload.tsx` with image preview and upload

### 7.4 Art & Event Components
- [ ] Create `app/components/artwork/artwork-card.tsx` with artwork display
- [ ] Create `app/components/artwork/artwork-grid.tsx` with responsive grid
- [ ] Create `app/components/artwork/artwork-modal.tsx` with full-size view
- [ ] Create `app/components/voting/vote-card.tsx` with Tinder-style voting card
- [ ] Create `app/components/voting/vote-summary.tsx` with vote review and reordering interface
- [ ] Create `app/components/voting/draggable-artwork-list.tsx` with drag-and-drop reordering
- [ ] Create `app/components/voting/vote-finalization.tsx` with final review and submit
- [ ] Create `app/components/events/event-card.tsx` with event summary
- [ ] Create `app/components/events/event-timeline.tsx` with phase visualization
- [ ] Create `app/components/events/phase-indicator.tsx` with current phase display
- [ ] Create `app/components/events/algorithm-selector.tsx` for admin event creation
- [ ] Create `app/components/events/matching-status.tsx` to show algorithm progress

### 7.5 Notification & Match Components
- [ ] Create `app/components/notifications/notification-list.tsx` with notification center
- [ ] Create `app/components/notifications/notification-item.tsx` with single notification
- [ ] Create `app/components/matches/match-card.tsx` with match display
- [ ] Create `app/components/matches/match-history.tsx` with match timeline
- [ ] Create `app/components/admin/user-table.tsx` with user management table
- [ ] Create `app/components/admin/audit-log.tsx` with action history display

---

## Phase 8: Business Logic Implementation

### 8.1 Enhanced Voting System
- [ ] Implement initial voting logic in `app/lib/db/vote.ts` (Tinder-style sequential voting)
- [ ] Add vote validation (prevent self-voting, duplicate votes, modification after finalizedAt is set)
- [ ] Add vote recording with event phase checking
- [ ] Implement preference order management functions
- [ ] Add vote modification logic (change liked/disliked status before finalization)
- [ ] Implement drag-and-drop reordering logic for preference order
- [ ] Add vote finalization logic (set finalizedAt timestamp for all user/event votes)
- [ ] Implement vote retrieval for summary page with preference ordering
- [ ] Add vote statistics calculation including preference metrics and finalization timestamps

### 8.2 Multiple Matching Algorithm System
- [ ] Create `app/lib/matching/base.ts` with MatchingAlgorithmBase interface
- [ ] Implement `app/lib/matching/first-come-first-served.ts` (greedy algorithm)
- [ ] Implement `app/lib/matching/optimal-matching.ts` (Gale-Shapley stable matching)
- [ ] Implement `app/lib/matching/preference-weighted.ts` (preference-prioritized matching)
- [ ] Implement `app/lib/matching/random-matching.ts` (random assignment algorithm)
- [ ] Create `app/lib/matching/registry.ts` to manage algorithm instances
- [ ] Implement matching trigger logic in `app/lib/db/vote.ts` for vote finalization
- [ ] Add algorithm-specific match validation and statistics
- [ ] Update event creation to include algorithm selection
- [ ] Add `matchingTriggered` field handling to prevent duplicate runs

### 8.3 Event Phase Management
- [ ] Create `app/lib/events/phases.ts` with phase transition logic
- [ ] Implement phase validation and rules
- [ ] Add automatic phase transition triggers
- [ ] Implement phase change notifications
- [ ] Add audit logging for phase changes

### 8.4 Group Management
- [ ] Implement group creation and membership logic
- [ ] Add group invitation system
- [ ] Implement admin permission checking
- [ ] Add group event management
- [ ] Implement user removal from groups

### 8.5 Notification System
- [ ] Create `app/lib/notifications/create.ts` with notification creation
- [ ] Implement notification delivery (email + in-app)
- [ ] Add notification marking as read
- [ ] Implement notification preferences
- [ ] Add notification cleanup/archiving

---

## Phase 9: Styling & Design

### 9.1 Tailwind Setup
- [ ] Configure Tailwind CSS with design system colors
- [ ] Create `app/styles/globals.css` with global styles
- [ ] Set up custom Tailwind components for common patterns
- [ ] Configure responsive breakpoints
- [ ] Set up dark mode support

### 9.2 Design System
- [ ] Define color palette for light/dark themes
- [ ] Create typography scale and font configuration
- [ ] Define spacing and sizing scales
- [ ] Create shadow and border radius utilities
- [ ] Set up animation and transition utilities

### 9.3 Single-Track Flow Design
- [ ] Design with mobile screens as primary target (375px width)
- [ ] Implement single-track user flows (submit → vote → match)
- [ ] Use minimal page header with hamburger menu for secondary navigation
- [ ] Design context-aware floating actions for primary tasks
- [ ] Implement full-screen content areas with minimal UI chrome
- [ ] Design touch-first interfaces with 44px minimum touch targets
- [ ] Implement swipe gestures for voting interface
- [ ] Focus on task completion rather than exploration
- [ ] Test complete user flows end-to-end on mobile
- [ ] Implement clear visual progress indicators for multi-step flows

---

## Phase 10: Testing Implementation

### 10.1 Unit Tests Setup
- [ ] Configure Vitest with React Testing Library
- [ ] Create `vitest.config.ts` with test configuration
- [ ] Set up test database for isolated testing
- [ ] Create test utilities and helpers

### 10.2 Database Layer Tests
- [ ] Write tests for `app/lib/db/artist.ts` CRUD operations
- [ ] Write tests for `app/lib/db/group.ts` functions
- [ ] Write tests for `app/lib/db/event.ts` functions
- [ ] Write tests for `app/lib/db/artwork.ts` functions
- [ ] Write tests for `app/lib/db/vote.ts` enhanced voting logic
  - [ ] Test sequential voting (Tinder-style)
  - [ ] Test preference order assignment and reordering
  - [ ] Test vote modification before finalization
  - [ ] Test vote finalization with timestamp setting
  - [ ] Test validation rules (no self-voting, no modification after finalizedAt is set)
  - [ ] Test finalization timestamp accuracy and immutability
- [ ] Write tests for multiple matching algorithms in `app/lib/matching/`
  - [ ] Test First Come First Served algorithm (greedy behavior)
  - [ ] Test Optimal Matching algorithm (stable matching)
  - [ ] Test Preference Weighted algorithm (mutual preference scoring)
  - [ ] Test Random Matching algorithm (randomized assignment)
  - [ ] Test algorithm registry and instance management
  - [ ] Test matching trigger logic for greedy vs non-greedy algorithms
  - [ ] Test `matchingTriggered` flag functionality
  - [ ] Test event closure with different algorithms

### 10.3 Authentication Tests
- [ ] Write tests for password hashing and verification
- [ ] Write tests for session management
- [ ] Write tests for JWT token creation and validation
- [ ] Write tests for permission guards
- [ ] Write tests for role-based access control

### 10.4 Component Tests
- [ ] Write tests for UI components with React Testing Library
- [ ] Write tests for form validation and submission
- [ ] Write tests for enhanced voting interface interactions
  - [ ] Test Tinder-style swipe voting
  - [ ] Test drag-and-drop reordering functionality
  - [ ] Test vote modification (liked ↔ passed)
  - [ ] Test vote finalization process
- [ ] Write tests for image upload component
- [ ] Write tests for responsive design

### 10.5 Integration Tests
- [ ] Write tests for complete user registration flow
- [ ] Write tests for artwork submission process
- [ ] Write tests for voting and matching flow
- [ ] Write tests for group creation and management
- [ ] Write tests for admin moderation workflows

### 10.6 End-to-End Tests
- [ ] Set up Playwright for E2E testing
- [ ] Write E2E test for user onboarding journey
- [ ] Write E2E test for artwork submission and voting
- [ ] Write E2E test for receiving match notifications
- [ ] Write E2E test for admin group management
- [ ] Write E2E test for password reset flow

---

## Phase 11: Security & Performance

### 11.1 Security Implementation
- [ ] Implement rate limiting on all API endpoints
- [ ] Add CSRF protection for forms
- [ ] Configure Content Security Policy (CSP) headers
- [ ] Implement input sanitization for all user data
- [ ] Add file upload security (malware scanning)
- [ ] Configure HTTPS enforcement

### 11.2 Performance Optimization
- [ ] Implement image lazy loading
- [ ] Add database query optimization and indexing
- [ ] Implement caching for frequently accessed data
- [ ] Optimize bundle size with code splitting
- [ ] Add performance monitoring and metrics

### 11.3 Accessibility Implementation
- [ ] Add ARIA labels to all interactive elements
- [ ] Implement keyboard navigation for all features
- [ ] Ensure proper color contrast ratios (4.5:1 minimum)
- [ ] Add alt text for all images
- [ ] Implement focus management for modals
- [ ] Test with screen readers (NVDA/JAWS)

---

## Phase 12: Error Handling & Monitoring

### 12.1 Error Handling
- [ ] Create `app/lib/errors/types.ts` with error type definitions
- [ ] Implement global error boundary for React components
- [ ] Add error handling for all API endpoints
- [ ] Implement graceful degradation for failed features
- [ ] Add user-friendly error messages

### 12.2 Logging & Monitoring
- [ ] Set up Winston logging with appropriate log levels
- [ ] Configure log rotation and storage
- [ ] Set up Sentry for error monitoring (production)
- [ ] Implement performance monitoring
- [ ] Add health check endpoints

### 12.3 Backup & Recovery
- [ ] Implement database backup script
- [ ] Set up automated image backup process
- [ ] Create data export functionality for GDPR compliance
- [ ] Test backup restoration procedures
- [ ] Document recovery procedures

---

## Phase 13: CI/CD & Deployment

### 13.1 GitHub Actions Setup
- [ ] Create `.github/workflows/ci.yml` with CI pipeline
- [ ] Configure Node.js matrix testing
- [ ] Set up automated linting and formatting checks
- [ ] Configure automated testing on PR creation
- [ ] Set up build verification

### 13.2 Environment Configuration
- [ ] Create environment-specific configuration files
- [ ] Set up staging environment variables
- [ ] Configure production environment variables
- [ ] Set up database migration workflow
- [ ] Configure email service for production

### 13.3 Deployment Preparation
- [ ] Create `deploy.sh` script as specified in requirements
- [ ] Document environment setup requirements
- [ ] Create deployment checklist
- [ ] Set up production database
- [ ] Configure production file storage

---

## Phase 14: Documentation & Legal

### 14.1 Code Documentation
- [ ] Add JSDoc comments to all public functions
- [ ] Document API endpoints and their parameters
- [ ] Create developer setup guide
- [ ] Document deployment process
- [ ] Create troubleshooting guide

### 14.2 User Documentation
- [ ] Create user onboarding guide
- [ ] Write help documentation for all features
- [ ] Create FAQ for common questions
- [ ] Document admin interface usage
- [ ] Create video tutorials for key workflows

### 14.3 Legal Documentation
- [ ] Draft terms of service
- [ ] Create privacy policy with GDPR compliance
- [ ] Document data retention policies
- [ ] Create user data export process
- [ ] Set up cookie consent if needed

---

## Phase 15: Testing & Launch Preparation

### 15.1 User Acceptance Testing
- [ ] Conduct thorough manual testing of all features
- [ ] Test on multiple devices and browsers
- [ ] Verify mobile responsiveness
- [ ] Test accessibility with actual users
- [ ] Conduct performance testing under load

### 15.2 Security Audit
- [ ] Run security audit tools on codebase
- [ ] Test for common vulnerabilities (OWASP Top 10)
- [ ] Verify rate limiting effectiveness
- [ ] Test file upload security
- [ ] Audit authentication and authorization

### 15.3 Pre-Launch Checklist
- [ ] Verify all environment variables are set
- [ ] Test email delivery in production environment
- [ ] Verify database backup and restore procedures
- [ ] Test monitoring and alerting systems
- [ ] Conduct final end-to-end testing
- [ ] Prepare rollback procedures

### 15.4 Launch & Post-Launch
- [ ] Deploy to production environment
- [ ] Monitor system performance and errors
- [ ] Collect user feedback
- [ ] Address any critical issues
- [ ] Plan for future enhancements

---

## Phase 16: Maintenance & Future Enhancements

### 16.1 Ongoing Maintenance
- [ ] Set up regular dependency updates
- [ ] Monitor security vulnerabilities
- [ ] Regular database maintenance and optimization
- [ ] Monitor system performance metrics
- [ ] Regular backup verification

### 16.2 Future Enhancements
- [ ] Consider push notification implementation
- [ ] Evaluate PWA features
- [ ] Plan for horizontal scaling if needed
- [ ] Consider additional art matching algorithms
- [ ] Evaluate user-requested features

---

This comprehensive guide provides 200+ actionable checkboxes that can be followed systematically to build the complete ArtSwap application. Each checkbox represents a specific, achievable task that builds upon previous work.
