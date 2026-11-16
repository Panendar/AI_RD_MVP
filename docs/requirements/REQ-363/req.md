# REQ-363 User can open a design from a JSON file and keep editing

Feature: FEAT-1144 · Decision: DEC-398 · Group: 3. Share
Order: 6 of 8
Depends on: User can download the design as a JSON file
Goals: G2

## Purpose
As a homeowner or interior designer, I can upload a .json design file to open it exactly as it was and keep editing. Sharing works by sending the file: whoever receives it uploads it, sees the design, and can keep editing or add from the catalog.

## Behaviour
- The user uploads a .json file.
- The file is checked against the schema.
- A valid file replaces the current design, and the 2D plan is drawn from it.
- An invalid file is rejected with a clear message, and the current design stays as it was.
- After opening, all editing and catalog features work on the opened design.

## Acceptance criteria
- Uploading a file downloaded from the app shows the same design in the 2D plan.
- After upload, the user can move, rotate, resize and delete furniture, and add more from the catalog.
- A file that fails the schema check is rejected with a clear message, and the current design is not replaced.
- Downloading the opened design again gives a file with the same design.

## Source documents
- docs/project/source/features.md: #7 Upload JSON (share) (REQ-315), #1 Room plan JSON (REQ-290, schema check and rejection)
- docs/project/intent.md: G2; Success: "An invalid design file is rejected with a clear message"

## Open questions
- If the current design has edits, is the user warned before it is replaced?
- What does the error message say: one general message, or the exact field that failed?
- How should a file be handled if it is valid but has furniture outside the walls, or a type that is not in the catalog?
- Is there a maximum file size?
