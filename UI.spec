# New Website "ArtSwap" to allow local artists to swap art

This website allows local artists to exchange artwork with each other, using a Tindr-style interface of "like" and "dislike". Artists can join "groups" that have "events" where artists can submit their art for potential swaps. When two artists "like" each other's artworks, a match is made, and those two works are removed from the pool. The "event" generally corresponds to an in-person meeting, where the artists will physically meet up and exchange any art that was "matched" with another artist's art.

## Design Choices

- Favor minimalist design aesthetic
- Dark-mode enabled
- Mobile-first, with desktop screen sizes a distant second
- Accessibility: follow WCAG guidelines, support keyboard navigation and screen readers
- Task-Focused: Design for specific user intents and flows
- Single-Track: Guide users through linear workflows
- Minimal Chrome: Only essential UI elements visible
- Context-Aware: Show relevant actions based on current state

## Event Lifecycle

- Phases: open for submissions → voting → closed → archived
- Only group admins can transition event phases
- Once closed, all unfinalized votes are finalized
- Archived after all matches are fulfilled
- If an event is accidentally advanced in phase, the admin can manually change the phase back

## Onboarding Flow

- Invitation required to join (email or link)
- Account creation: email, password, full name, optional profile picture

## Navigation

- Hamburger menu:
    - select active group if user is member of multiple groups
    - view notifications full-screen modal
    - view successful matches full-screen modal
    - user profile/settings full-screen modal
- Home screen:
    - If active group has event in voting stage, show voting UI
    - If event is open, show add/manage art UI
    - If event is closed and user has matched art, show matches
    - Otherwise, show add "art to portfolio" UI

## Voting Flow

- the User is presented with each piece of art from the other artists in the event in sequence, and they can "swipe right" or "swipe left" (Tindr style) on each piece to indicate whether they "like" or "dislike" it.
- after they have voted on all of the pieces in the current event, they see an "overview" list, with a section for "art you liked" at the top, and "art you passed on" below it.
- for "art you liked", they can drag to rearrange the art into "order of preference" (the initial order is just the order in which they saw the pieces)
- they can also "pass" on a piece they previously liked if they change their mind, and the same goes for "liking" a piece they "passed on" in the list.
- once they are satisfied with their selections, they "finalize" their votes, afterwhich they cannot make any other modifications

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