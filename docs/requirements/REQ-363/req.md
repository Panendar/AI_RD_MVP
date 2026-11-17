# REQ-363 User can open a design from a JSON file and keep editing

Feature: FEAT-1144 - Decision: DEC-398 - Group: 3. Share
Order: 7 of 9
Depends on: User can download the design as a JSON file
Goals: G2

## Purpose
As a homeowner or interior designer, I can upload a .json design file to open it exactly as it was and keep editing. Sharing works by sending the file: whoever receives it uploads it, sees the design, and can keep editing or add from the catalog.

## Behaviour
- The user uploads a .json file with the **Upload JSON** button (file picker).
- **File size:** a file larger than 1 MB is rejected before it is read, with the general message below. The current design stays as it was.
- The file is checked against the schema in [room-plan-schema.md](../../project/room-plan-schema.md) and against its business rules:
  - the walls match the room;
  - item ids are unique;
  - every item is inside the walls;
  - every size matches the catalog;
  - no two items overlap (touching is allowed; under 0.01 ft counts as touching).
- **Warning before replace:** if a design is already open, the user is asked to confirm (Replace / Cancel) before the uploaded file replaces it. Cancel leaves the current design untouched. The confirmation appears after the file passes all checks, so a rejected file never triggers it.
- A valid file replaces the current design. The 2D plan shows **exactly what was saved and shared**, with no red lines or popups even for items less than 1.5 ft apart or touching (user decisions, 2026-11-16 and 2026-11-17). The room size is fixed as in the file.
- **Invalid file:** rejected with one general message: "This file is not a valid room design." The message does not name the failing field or rule. The current design stays as it was.
- After opening, move, rotate, delete and add from the catalog all work on the opened design.

## Acceptance criteria
- Uploading a file downloaded from the app shows the same design in the 2D plan.
- After upload, the user can move, rotate and delete furniture, and add more from the catalog.
- A file that fails the schema check or a business rule is rejected with the general message "This file is not a valid room design.", and the current design is not replaced.
- A file larger than 1 MB is rejected with the same general message, and the current design is not replaced.
- When a design is already open, a valid file is only applied after the user confirms Replace; Cancel keeps the current design.
- Downloading the opened design again gives a file with the same design.

## Resolved questions
- Is the user warned before an open design is replaced? **Yes**, a Replace / Cancel confirmation (answered by the user).
- What does the error message say? **One general message**, not the exact field or rule (answered by the user).
- Is there a maximum file size? **Yes, 1 MB** (answered by the user).

## Source documents
- docs/project/source/features.md: #7 Upload JSON (share) (REQ-315), #1 Room plan JSON (REQ-290, schema check and rejection)
- docs/project/room-plan-schema.md
- docs/project/intent.md: G2; Success: "An invalid design file is rejected with a clear message"
