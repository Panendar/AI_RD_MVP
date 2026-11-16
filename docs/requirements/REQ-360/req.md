# REQ-360 User can select and move furniture inside the walls

Feature: FEAT-1141 · Decision: DEC-395 · Group: 2. Furnish and edit
Order: 3 of 9
Depends on: User can add Indian furniture from a searchable catalog
Goals: G1

## Purpose
As a homeowner or interior designer, I can select a furniture item in the 2D plan and move it, and it stays inside the room walls.

## Behaviour
- Clicking a furniture item selects it. The selection is visible, and the right panel shows the item's size, position and rotation.
- Dragging the selected item with the mouse moves it in steps of **0.25 ft**: its position snaps to multiples of 0.25 ft (user decision, 2026-11-16).
- The item cannot be moved outside the room walls. Dragging past a wall **stops the item at the wall** (user decision, 2026-11-16).
- Each move updates the item's `position` (its centre, in ft from the top-left corner) in the room JSON straight away.
- Moving near other items follows the clearance rule (REQ-366).

## Acceptance criteria
- Clicking an item selects it, and the selection is visible.
- Dragging a selected item moves it in the plan in 0.25 ft steps; its position in the panel and in the room JSON is always a multiple of 0.25 ft.
- Dragging an item past a wall stops it touching the wall; it is never placed outside the room.
- After a move, the item's position in the room JSON matches the plan straight away.

## Source documents
- docs/project/source/features.md: #4 Edit the 2D plan (REQ-297, REQ-299)
- docs/project/room-plan-schema.md
- docs/project/intent.md: G1
- User answers, 2026-11-16: 0.25 ft movement step; stop at the wall; overlap handled by the clearance rule

## Open questions
- Can an item also be moved with the arrow keys (0.25 ft per press)?
- Can more than one item be selected at once?
- How is an item deselected (click on empty floor, Esc)?
