# REQ-363 User can open a design from a JSON file and keep editing

Feature: FEAT-1144 · Decision: DEC-398 · Group: 3. Share
Order: 7 of 9
Depends on: User can download the design as a JSON file
Goals: G2

## Purpose
As a homeowner or interior designer, I can upload a .json design file to open it exactly as it was and keep editing. Sharing works by sending the file: whoever receives it uploads it, sees the design, and can keep editing or add from the catalog.

## Behaviour
- The user uploads a .json file.
- The file is checked against the schema in [room-plan-schema.md](../../project/room-plan-schema.md) and against its business rules:
  - the walls match the room;
  - item ids are unique;
  - every item is inside the walls;
  - every size matches the catalog;
  - no two items overlap (touching is allowed; under 0.01 ft counts as touching).
- A valid file replaces the current design. The 2D plan shows **exactly what was saved and shared**, with no red lines or popups even for items less than 1.5 ft apart or touching (user decisions, 2026-11-16 and 2026-11-17). The room size is fixed as in the file.
- An invalid file is rejected with a clear message, and the current design stays as it was.
- After opening, move, rotate, delete and add from the catalog all work on the opened design.

## Acceptance criteria
- Uploading a file downloaded from the app shows the same design in the 2D plan.
- After upload, the user can move, rotate and delete furniture, and add more from the catalog.
- A file that fails the schema check or a business rule is rejected with a clear message, and the current design is not replaced.
- Downloading the opened design again gives a file with the same design.

## Source documents
- docs/project/source/features.md: #7 Upload JSON (share) (REQ-315), #1 Room plan JSON (REQ-290, schema check and rejection)
- docs/project/room-plan-schema.md
- docs/project/intent.md: G2; Success: "An invalid design file is rejected with a clear message"

## Open questions
- If a design is already open, is the user warned before it is replaced?
- What does the error message say: one general message, or the exact field or rule that failed?
- Is there a maximum file size?
