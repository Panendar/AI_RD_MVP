# REQ-358 User can start a new room by entering width and length

Feature: FEAT-1139 · Decision: DEC-393 · Group: 1. Start a room
Order: 1 of 9
Depends on: none
Goals: G4, G3

## Purpose
As a homeowner or interior designer, I can enter a room width and length in feet to start a new, empty rectangular room shown as a 2D plan to scale. This story also sets up the room JSON that holds the design at every later step.

## Behaviour
- The user enters a width and a length in feet and confirms.
- Width and length must each be **6 to 30 ft**, in 0.25 ft steps, to fit normal Indian rooms. Any other value (empty, not a number, out of range) shows a message under the field, for example "Width must be between 6 and 30 ft.", and Create room does nothing.
- The wall height is **10 ft** for every room. It is fixed and not asked for (user decision, 2026-11-16).
- A room JSON is created in the format of [room-plan-schema.md](../../project/room-plan-schema.md) (schema v1.0):
  - units are feet, and the origin (0, 0) is the top-left corner of the room floor;
  - the room has `width`, `length` and four walls (`top`, `right`, `bottom`, `left`);
  - `items` is an empty list.
- The room JSON is checked against the schema and the business rules.
- The 2D editor opens with the room drawn from the room JSON automatically, to scale, with a grid and a ruler in feet.
- The room size is set once. It **cannot be edited** after the room is created (user decision, 2026-11-16).
- The room is a rectangle. Picking a room type or shape is not in scope (user decision, 2026-11-16).

## Acceptance criteria
- Entering a width and length in feet and confirming shows a new, empty rectangular room in the 2D plan.
- The room drawn in the plan measures the entered width and length on the ruler and grid.
- A width or length below 6 ft, above 30 ft, or not a number shows the message, and no room is created.
- The room JSON has `schemaVersion` "1.0", `units` "ft", `origin` "top-left", the entered width and length, `height` 10, four walls that match them, and an empty `items` list. It passes the schema check.
- Once the room is created, the editor offers no way to change the room size.

## Source documents
- docs/project/source/features.md: #1 Room plan JSON (REQ-290), #2 Create a room (REQ-291), #3 2D plan renders from JSON (REQ-296)
- docs/project/room-plan-schema.md
- docs/project/intent.md: G3, G4
- User answers, 2026-11-16: rectangle only; room size cannot be edited; schema measured from one corner; sizes for normal Indian homes (6 to 30 ft rooms, 10 ft walls)

## Open questions
- None. (Grid: one dot every 2 ft, with moves snapping to 0.25 ft, as drawn in the mocks.)
