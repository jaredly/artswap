# ArtSwap Implementation Plan

## Overview
This plan outlines the steps, milestones, and deliverables for building the ArtSwap website as described in the specification. It covers architecture, technology choices, development phases, testing, deployment, and maintenance. ArtSwap will use a unified full-stack architecture with react-router v7, integrating routing, data loading, and backend logic directly into the React app.

---

## 1. Project Setup
- Initialize a single repo for the full-stack app (React + server code)
    - use `npx create-react-router@latest .`
- Set up code formatting and linting with Biome:
    - Install Biome: `pnpm install --save-dev @biomejs/biome`
    - Initialize Biome config: `npx biome init`
    - Add Biome scripts to `package.json` for formatting and linting
    - Configure editor integration (VS Code extension recommended)
- Configure CI/CD (GitHub Actions)
  - linting, testing
- Add README and documentation templates

## 2. Database & Data Layer
- Design SQLite schema for all entities
- Implement data access layer (using Prisma)
- Add server-side modules for authentication, invitations, and notifications
- Integrate image upload and storage (local file system)
- Add error handling and validation

## 3. Routing, Loaders, and Actions (React Router v7)
- Define route modules for all major pages (groups, events, portfolio, admin, onboarding)
- Implement loaders for data fetching (e.g., event details, user profile, art list)
- Implement actions for mutations (e.g., submit art, vote, change event phase, flag art)
- Use route-based authentication and authorization guards
- Handle redirects and error boundaries in route modules

## 4. UI & Components
- Build UI with React, TypeScript, Tailwind
- Implement navigation (hamburger menu, profile, settings, notifications, group selection)
- Create components for:
    - Group management (admin/super-admin)
    - Event lifecycle (submission, voting, closed, archived)
    - Art submission (portfolio/event)
    - Voting interface (Tindr-style, with a summary page to "finalize" or make adjustments)
    - Match notifications and history
    - Admin moderation tools (flagging, user removal)
    - In-app notifications
- Ensure mobile-first, dark mode, and accessibility compliance

## 5. Matching & Voting Logic
- Implement voting UI and logic in route actions
- Develop matching algorithm (mutual likes) as a server-side utility
- Handle event phase transitions and edge cases via actions
- Notify users of matches via email and in-app

## 6. Testing
- Write unit tests for each backend module and data layer function as you implement them (using Vitest).
- Write unit and integration tests for each UI component as you build it (using React Testing Library and Vitest).
- Add end-to-end tests for onboarding, submission, voting, matching (Cypress or Playwright) after core flows are complete.
- Ensure CI runs all tests (Vitest) and Biome lint/format checks on every push/PR.

## 7. Deployment
- this will be handled separately, via a `deploy.sh` script that the client will provide

## 8. Documentation
- Document route modules, loaders, actions, and data models
- Add user/admin guides
- Update README with setup and contribution instructions

## 9. Legal & Privacy
- Draft terms of service and privacy policy
- Implement copyright and data retention features

## 10. Maintenance & Future Enhancements
- Plan for bug fixes and minor improvements
- Consider push notifications, PWA features, and scalability if usage grows

---

## Deliverables
- Working full-stack web application (React + server)
- Automated test suite
- Documentation
- Deployment scripts
- Legal documents

---

## Risks & Mitigations
- Email deliverability: use mailgun
- Accessibility: regular audits and user testing
- Security: regular dependency updates, code reviews

---

## Success Criteria
- All core features implemented and tested
- Meets accessibility and design requirements
- Stable deployment with error monitoring
- Positive feedback from pilot users

---

# Detailed Step-by-Step Implementation Plan

## 1. Project Initialization
1. Run `npx create-react-router@latest art-swap-app` to scaffold the project.
2. Initialize git repository and push to remote.
3. Set up code formatting and linting with Biome:
    - Install Biome: `npm install --save-dev @biomejs/biome`
    - Initialize Biome config: `npx biome init`
    - Add Biome scripts to `package.json` for formatting and linting
    - Configure editor integration (VS Code extension recommended)
4. Create initial README with project overview and setup instructions.
5. Configure GitHub Actions for CI (lint, test).

## 2. Database & Prisma Setup
1. Install Prisma and SQLite: `npm install prisma @prisma/client sqlite3`.
2. Run `npx prisma init` to create Prisma config.
3. Define the data model in `prisma/schema.prisma` for Artist, Group, Event, Artwork, Match, Invitation, Notification.
4. Run `npx prisma migrate dev --name init` to create the initial database.
5. Implement seed scripts for test data.
6. Add Notification entity to seed data and CRUD functions.

## 3. Backend Utilities & Data Layer
1. Create a `db` module to wrap Prisma client and expose CRUD functions for each entity.
2. Implement authentication logic (password hashing, session management, invitation token validation, password reset, and account recovery flows).
3. Set up email sending utility (Mailgun integration).
4. Implement image upload logic (local file system, with validation and resizing).
5. Add error handling and input validation utilities. Implement logging and monitoring for production errors (e.g., Sentry or similar).

## 4. Routing, Loaders, and Actions
1. Define route modules for all major pages:
    - `/onboarding` (account creation, invitation)
    - `/groups` (list, join, create)
    - `/events/:eventId` (event details, submission, voting)
    - `/portfolio` (manage personal art)
    - `/admin` (group/event/user management)
    - `/matches` (view matches)
2. For each route, implement:
    - Loader for data fetching (e.g., event details, user profile)
    - Action for mutations (e.g., submit art, vote, change event phase)
    - Error boundary for handling exceptions
    - Authentication/authorization guard (redirect if not authorized)

## 5. UI & Component Development
1. Set up Tailwind CSS for styling.
2. Build navigation (hamburger menu, profile, group selection, notifications).
3. Implement onboarding UI (invitation, account creation, email verification).
4. Build group management UI (list, join, create, admin tools).
5. Build event lifecycle UI:
    - Submission phase: add/manage art
    - Voting phase: Tindr-style voting, summary/finalize page
    - Closed/archived: view matches, event history
6. Build portfolio management UI (add/remove art, attach to event).
7. Build admin moderation UI (flag art, remove users).
8. Implement in-app notifications and match history.
9. Ensure mobile-first, dark mode, and accessibility compliance (test with screen readers, keyboard navigation, color contrast checks, and ARIA attributes).

## 6. Matching & Voting Logic
1. Implement voting UI and logic in event route actions.
2. Develop matching algorithm (mutual likes) as a server-side utility, triggered when votes are finalized.
3. Handle event phase transitions (open, voting, closed, archived) via admin actions.
4. Notify users of matches via email and in-app notifications.

## 7. Testing
1. Write unit tests for data layer (Prisma CRUD, business logic).
2. Write unit and integration tests for frontend components (React Testing Library).
3. Add end-to-end tests for onboarding, submission, voting, matching (Cypress or Playwright).
4. Ensure CI runs all tests (Vitest) and Biome lint/format checks on every push/PR.

## 8. Deployment
1. Prepare a `deploy.sh` script for deployment (as per client instructions).
2. Document environment variables and secrets (Mailgun, database, etc.).
3. Test deployment to staging and production environments.

## 9. Documentation & Legal
1. Document all route modules, loaders, actions, and data models (docstring comments in code are sufficient; no external API docs required).
2. Write user and admin guides for all major flows.
3. Draft terms of service and privacy policy. Add process for user data export/deletion (for privacy compliance).

## 10. Maintenance & Future Enhancements
1. Monitor error logs and user feedback.
2. Plan for bug fixes and minor improvements.
3. Consider push notifications, PWA features, and scalability if usage grows.

---

# Execution Notes
- Each step should be tracked in a project board (e.g., GitHub Projects).
- All code should be reviewed before merging.
- Accessibility and security should be validated at each stage (including color contrast and ARIA attributes).
- Regularly update documentation as features are added (docstring comments in code).
- Run Biome lint and format checks before every commit and in CI.
- Write and maintain unit tests for all backend and frontend modules as features are developed (using Vitest).
- Hold regular sprint reviews or demos for stakeholders.
