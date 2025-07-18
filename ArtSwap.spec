# New Website "ArtSwap" to allow local artists to swap art

## Technologies

- react-router v7
- react
- tailwind
- typescript
- sqlite
- jest
- react-testing-library

## High-level Description

This website allows local artists to exchange artwork with each other, using a Tindr-style interface of "like" and "dislike". Artists can join "groups" that have "events" where artists can submit their art for potential swaps. When two artists "like" each other's artworks, a match is made, and those two works are removed from the pool. The "event" generally corresponds to an in-person meeting, where the artists will physically meet up and exchange any art that was "matched" with another artist's art.

## Design Choices

- Favor minimalist design aesthetic
- Dark-mode enabled
- Mobile-first, with desktop screen sizes a distant second
- Accessibility: follow WCAG guidelines, support keyboard navigation and screen readers
- Consider PWA features for installability and offline support

## Data Model Overview

- **Artist**: id, name, email, password hash, profile picture, groups, portfolio
- **Group**: id, name, admins, members, events
- **Event**: id, group, phase, submission limit, artworks, matches
- **Artwork**: id, artist, title, description, medium, dimensions, year, images (1-5), status (portfolio/event/matched/flagged)
- **Match**: id, artwork1, artwork2, event, status
- **Invitation**: id, group, email, token, status

## User Roles & Permissions

- **Super-admin**: create/manage groups, manage users site-wide
- **Group admin**: create/manage events, invite users, flag/remove art, remove users from group
- **Member**: submit art, vote, manage own portfolio

## Authentication & Security

- Email verification required for new accounts
- Password requirements: minimum length, complexity
- Optional 2FA for added security
- Account recovery via email

## Notifications

- Email notifications for matches, invitations, flagged art
- In-app notifications for all major actions (match, event phase change, etc.)
- Optional push notifications (future enhancement)

## Art Submission & Metadata

- Upload 1-5 images per artwork (different views)
- Required metadata: title
- Optional metadata: description, medium, dimensions, year, additional notes
- Art can be added to portfolio or directly to an event

## Event Lifecycle

- Phases: open for submissions → voting → closed → archived
- Only group admins can transition event phases
- Once closed, all unfinalized votes are finalized
- Archived after all matches are fulfilled
- If an event is accidentally advanced in phase, the admin can manually change the phase back

## Matching Algorithm

- Mutual likes between two artworks triggers a match
- Both artworks are removed from the voting pool
- Unmatched pieces remain in the pool until event closes
- At event end (archival), unmatched art is returned to portfolio

## Moderation & Flagging

- Admins can flag art, making it hidden from non-admins
- Artists are notified when their art is flagged
- Flagged art can be appealed by contacting group admin (out of band)
- Admins can remove users from their group

## Onboarding Flow

- Invitation required to join (email or link)
- Account creation: email, password, full name, optional profile picture
- Email verification is implied by receipt of invitation link

## Add Art to Event Flow

- Upload 1-5 photos of the art
- Fill in required metadata
- Save, then view/manage list of art added to event
- Add more art up to event submission limit

## Add Art to Portfolio Flow

- Artists can upload art not attached to any event
- Art can later be added to an event (only one event at a time)
- Art can be withdrawn from event if not in voting phase
- Matched art cannot be added to future events

## Navigation

- Hamburger menu: select active group if member of multiple groups
- Home screen:
    - If active group has event in voting stage, show voting UI
    - If event is open, show add/manage art to event UI
    - If event is closed and user has matched art, show matches
    - Otherwise, show add art to portfolio UI

## Admin Navigation

- Super-admin: create/manage groups, manage users site-wide
- Group admin: manage events (change phase), manage users, manage invitations

## Testing & Quality

- Use linting and formatting tools (e.g., Typescript, Biome)
- Maintain high test coverage (unit, integration, e2e)
- Use CI/CD (Github actions) for automated testing and deployment
- Document API and data models

## Error Handling & Edge Cases

- Prevent submission of more art than allowed per event
- Provide clear error messages for all user actions

## Scalability & Performance

- honestly don't worry about this. we expect usage to remain modest, so don't prematurely optimize

## Legal & Privacy

- Terms of service and privacy policy required
- Copyright handling for uploaded art
- Data retention and deletion policies

