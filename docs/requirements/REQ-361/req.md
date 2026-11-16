# REQ-361 User can rotate, resize and delete furniture

Feature: FEAT-1142 · Decision: DEC-396 · Group: 2. Furnish and edit
Order: 4 of 8
Depends on: User can select and move furniture inside the walls
Goals: G1

## Purpose
As a homeowner or interior designer, I can rotate, resize and delete a selected furniture item in the 2D plan.

## Behaviour
- With an item selected, the user can rotate it, resize it or delete it.
- The item stays inside the room walls after a rotate or resize.
- Each edit updates the room JSON straight away (rotation, size, or removal of the item).

## Acceptance criteria
- Rotating a selected item changes its rotation in the plan and in the room JSON straight away.
- Resizing a selected item changes its size in the plan and in the room JSON straight away.
- A rotate or resize that would take the item outside the walls is not applied.
- Deleting a selected item removes it from the plan and from the room JSON.

## Source documents
- docs/project/source/features.md: #4 Edit the 2D plan (REQ-297, REQ-299)
- docs/project/intent.md: G1

## Open questions
- Is rotation free, or in steps (for example 90° or 15°)?
- Is resizing done with handles, by typing a size in feet, or both? Is there a minimum or maximum size?
- Does resizing keep the item's proportions?
- Is a delete confirmed first? Is there undo?
- Can the user change an item's colour? The room JSON holds a colour, but no feature edits it.
