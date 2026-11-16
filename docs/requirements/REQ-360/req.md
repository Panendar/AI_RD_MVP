# REQ-360 User can select and move furniture inside the walls

Feature: FEAT-1141 · Decision: DEC-395 · Group: 2. Furnish and edit
Order: 3 of 8
Depends on: User can add Indian furniture from a searchable catalog
Goals: G1

## Purpose
As a homeowner or interior designer, I can select a furniture item in the 2D plan and move it, and it stays inside the room walls.

## Behaviour
- Clicking a furniture item selects it, and the selection is visible.
- Dragging the selected item moves it.
- The item cannot be moved outside the room walls.
- Each move updates the item's position in the room JSON straight away.

## Acceptance criteria
- Clicking an item selects it, and the selection is visible.
- Dragging a selected item moves it in the plan.
- An item cannot be placed outside the room walls.
- After a move, the item's position in the room JSON matches the plan straight away.

## Source documents
- docs/project/source/features.md: #4 Edit the 2D plan (REQ-297, REQ-299)
- docs/project/intent.md: G1

## Open questions
- If a drag goes past a wall, does the item stop at the wall, or snap back to where it started?
- Can furniture overlap other furniture?
- Is there snapping to the grid while moving?
- Can more than one item be selected at once? Can items be moved with the keyboard?
- How is an item deselected (click on empty space, Esc)?
