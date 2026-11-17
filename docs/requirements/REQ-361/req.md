# REQ-361 User can rotate and delete furniture

Feature: FEAT-1142 · Decision: DEC-396 · Group: 2. Furnish and edit
Order: 4 of 9
Depends on: User can select and move furniture inside the walls
Goals: G1

## Purpose
As a homeowner or interior designer, I can rotate and delete a selected furniture item in the 2D plan.

## Behaviour
- The selected item shows a rotation ring around it, with a knob and the current angle.
- The user rotates the item with the mouse by dragging the knob around the ring. Rotation moves in steps of **10°**: the item snaps to the nearest 10° (0, 10, 20 ... 350). A Rotate button turns it 10° clockwise.
- The angle is the item's **facing**, stored as `rotation` in the room JSON: degrees clockwise, where 0 = the front faces the bottom wall (see [room-plan-schema.md](../../project/room-plan-schema.md)).
- The item rotates around its centre and must stay inside the walls.
- Delete first asks for confirmation: "Delete Sofa? [Delete] [Cancel]" (user decision, 2026-11-16). Delete removes the item from the plan and from `items` in the room JSON; Cancel changes nothing.
- **No resizing:** item sizes come from the catalog and cannot be changed (user decision, 2026-11-16).
- Rotating near other items follows the clearance rule (REQ-366).

## Acceptance criteria
- Dragging the knob rotates the selected item in 10° steps. The angle is shown on the ring and in the panel, and `rotation` in the room JSON matches it straight away.
- The Rotate button turns the selected item 10° clockwise (350 → 0).
- A rotation that would take any part of the item outside the walls is not applied; the item keeps its last angle.
- Pressing Delete shows a confirmation. Confirming removes the item from the plan and from the room JSON; cancelling leaves everything as it was.
- No control is offered to change an item's size.

## Source documents
- docs/project/source/features.md: #4 Edit the 2D plan (REQ-297, REQ-299)
- docs/project/room-plan-schema.md
- docs/project/intent.md: G1
- User answers, 2026-11-16: 10° rotation steps with the mouse; no resizing; delete asks for confirmation

## Scope
Not part of the approved acceptance criteria and not required here: undo after a confirmed delete (for example Ctrl+Z), and typing an exact angle in the panel. Either needs a new decision and requirement.

## Questions resolved
- Rotation step with the mouse: 10° (user answer, 2026-11-16).
- Resizing: not offered (user answer, 2026-11-16).
- Delete: asks for confirmation first (user answer, 2026-11-16).
- Rotation near other items: handled by the clearance rule, REQ-366.
- No other questions are recorded in KNM for this requirement (no Q&A entries; gate open). Undo and typing an angle are out of scope (see Scope).
