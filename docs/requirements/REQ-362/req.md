# REQ-362 User can download the design as a JSON file

Feature: FEAT-1143 · Decision: DEC-397 · Group: 3. Share
Order: 5 of 8
Depends on: User can rotate, resize and delete furniture
Goals: G2

## Purpose
As a homeowner or interior designer, I can download the current design as a .json file, so I can share it by sending the file.

## Behaviour
- A download action saves the current room JSON as a .json file.
- The file holds the full design: room size, walls, and every furniture item with type, position, rotation, size and colour.
- The file passes the schema check.
- There are no accounts and no cloud storage; the file is the only way to share (intent.md, Not goals).

## Acceptance criteria
- A download action saves a .json file.
- The file holds the full design: room size, walls, and every furniture item with type, position, rotation, size and colour.
- The downloaded file passes the schema check.

## Source documents
- docs/project/source/features.md: #6 Download JSON (REQ-315)
- docs/project/intent.md: G2

## Open questions
- What should the file be named by default? Can the user name the design?
- Can the user download an empty room (no furniture)?
- Should the file include a schema version?
