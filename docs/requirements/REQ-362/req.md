# REQ-362 User can download the design as a JSON file

Feature: FEAT-1143 · Decision: DEC-397 · Group: 3. Share
Order: 6 of 9
Depends on: User is warned when furniture is closer than 1.5 ft (the full editing rules are in place before the export is checked)
Goals: G2

## Purpose
As a homeowner or interior designer, I can download the current design as a .json file, so I can share it by sending the file.

## Behaviour
- A download action saves the current room JSON as a .json file, in the format of [room-plan-schema.md](../../project/room-plan-schema.md) (schema v1.0).
- The file is always named `room_type.json`. The user cannot name the design or change the file name in this project.
- The file holds the full design:
  - `schemaVersion`, `units`, `origin`;
  - the room width, length and walls;
  - every item with `id`, `catalogId`, `name`, `position` (centre, ft from the top-left corner), `size` (width, depth, height), `rotation` (facing) and `colour`.
- The file passes the schema check and the business rules.
- An empty room (no furniture) cannot be downloaded. When the user clicks Download JSON with no items in the room, no file is saved and a pop-up message appears: "Add objects and plan your room before downloading." The user closes the pop-up and stays on the design.
- There are no accounts and no cloud storage; the file is the only way to share (intent.md, Not goals).

## Acceptance criteria
- A download action saves a .json file named `room_type.json`.
- The file holds the full design with every field listed above.
- The downloaded file passes the schema check and the business rules.
- With no items in the room, Download JSON saves nothing and shows the pop-up message "Add objects and plan your room before downloading."
- The user cannot rename the design or choose a different file name in the app.

## Resolved questions
| Question | Answer | Effect |
|---|---|---|
| Default file name? Can the user name the design? | File name is `room_type.json`; the user cannot name the design in this project. | Fixed file name, no naming field. |
| Can the user download an empty room? | No. Show a pop-up message asking the user to add objects and plan the room. | Download blocked with a message when there are 0 items. |

## Source documents
- docs/project/source/features.md: #6 Download JSON (REQ-315)
- docs/project/room-plan-schema.md
- docs/project/intent.md: G2
