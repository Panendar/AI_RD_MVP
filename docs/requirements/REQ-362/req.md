# REQ-362 User can download the design as a JSON file

Feature: FEAT-1143 · Decision: DEC-397 · Group: 3. Share
Order: 6 of 9
Depends on: User is warned when furniture is closer than 1.5 ft (the full editing rules are in place before the export is checked)
Goals: G2

## Purpose
As a homeowner or interior designer, I can download the current design as a .json file, so I can share it by sending the file.

## Behaviour
- A download action saves the current room JSON as a .json file, in the format of [room-plan-schema.md](../../project/room-plan-schema.md) (schema v1.0).
- The file holds the full design:
  - `schemaVersion`, `units`, `origin`;
  - the room width, length and walls;
  - every item with `id`, `catalogId`, `name`, `position` (centre, ft from the top-left corner), `size` (width, depth, height), `rotation` (facing) and `colour`.
- The file passes the schema check and the business rules.
- There are no accounts and no cloud storage; the file is the only way to share (intent.md, Not goals).

## Acceptance criteria
- A download action saves a .json file.
- The file holds the full design with every field listed above.
- The downloaded file passes the schema check and the business rules.

## Source documents
- docs/project/source/features.md: #6 Download JSON (REQ-315)
- docs/project/room-plan-schema.md
- docs/project/intent.md: G2

## Open questions
- What should the file be named by default? Can the user name the design?
- Can the user download an empty room (no furniture)?
