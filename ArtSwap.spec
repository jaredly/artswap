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

This website allows local artists to exchange artwork with each other, using a Tindr-style interface of "like" and "dislike".
Artists can join "groups" that have "events" where artists can submit their art for potential swaps. When two artists "like" each other's artworks, a match is made, and those two works are removed from the pool.
The "event" generally corresponds to an in-person meeting, where the artists will physically meet up and exchange any are that was "matched" with another artist's art.

## Design choices

- favor minimalist design aesthetic
- dark-mode enabled
- mobile-first, with desktop screen sizes a distant second

## Structure

- Artists can join one or more "Groups", which probably corrspond to geographic regions, but don't have to
- A group has admins and regular members
- A group admin can create a "swap event" for that group
- a group can only have one "open" event at a time, and one "voting" event.
- A "swap event" can have a "per-artist submission limit"
- Artists (whether admin or regular member) can upload pictures of art that they are interested in swapping, along with title/description/medium/dimensions/year metadata
- A swap event goes through 4 phases:
    - Initially, it is "open for submissions", and artists can add their artworks to the event
    - Then it transitions to the "voting" period, where artists indicate their preference for (or against) the other pieces of art in the pool
        - no more art can be added when it is in "voting"
        - when an artist "finalizes their votes", matching can occur.
    - Finally, the event is "closed", and no more voting can occur, and all unfinalized votes are finalized. This generally happens a day or so in advance of the physical meetup.
    - After all matches have been fulfilled (as determined by the admin), the event gets "archived"
- Matching is the process of pairing one piece of art from one artist with another piece from another artist, producing a "swap". Both pieces of art are removed from the voting pool at that point.
- When a match occurs, both artists are notified via email.

## Onboarding flow

- In order to join ArtSwap (and their first group), a person must receive an invitation from an admin (via email, or via a link)
- They'll be asked to create an account, with email, password, full name (no usernames), and an optional profile picture
- If there's an "open" event for the group their in, they'll be taken to the "add art to event" flow
- otherwise, they'll be informed that "no event is currently open, but you can add art to your portfolio"

## Add Art to Event flow

- upload 1-5 photos of the art
- fill in metadata
- save, then view the list of art you've added to the event, along with a button to add more (as long as you're not at the limit for this event)

## Add Art to Portfolio flow

- at any time, an artist can upload art that's not attached to any event
- later, they can add it to an event
- a piece of art can only be added to a single event at a time
- they can withdraw a piece of art from an event, as long as the event is not in the "voting" phase
- a piece of art that has been "matched" can no longer be added to any events.

## Navigation

- in the hamburger menu, the user can select their "active group" if they are a member of multiple groups. otherwise, no need to show that UI
- on the home screen, if the active group has an event in "voting" stage, show the voting UI
- otherwise, if the active group has an event in the "open" stage, show the "add/manage art to event" UI
- otherwise, if the active group has an event in the "closed" stage, and the user has art that was matched with art from other artists, show those matches
- otherwise, show the "add art to portfolio" UI

## Admin Navigation

- create groups (only available to a super-admin)
- manage group (for the user's active group)
    - manage events
        - change an event's current "phase" (open, voting, closed, archived)
    - manage users
        - manage invigations

## Moderation

- An admin can flag art submitted to events in their group, which make the pieces hidden from all non-admin users, and the artist should be notified of the flagging
- An admin can also remove a user from their group

