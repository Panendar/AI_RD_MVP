# REQ-359 User can add Indian furniture from a searchable catalog

Feature: FEAT-1140 · Decision: DEC-394 · Group: 2. Furnish and edit
Order: 2 of 9
Depends on: User can start a new room by entering width and length
Goals: G4, G3

## Purpose
As a homeowner or interior designer, I can search a catalog of Indian furniture and add an item to the plan at its real size.

## Behaviour
- The catalog has six items, each with a fixed width, depth and height in feet. These are standard sizes for normal Indian homes, decided by the user on 2026-11-16 (see [room-plan-schema.md](../../project/room-plan-schema.md)):

  | Item | W x D x H ft |
  |---|---|
  | Bed (queen) | 5.0 x 6.5 x 1.5 |
  | Sofa (3 seat) | 6.5 x 3.0 x 2.75 |
  | Table (4 seat) | 4.0 x 2.5 x 2.5 |
  | Chair | 1.5 x 1.5 x 3.0 |
  | TV (on stand) | 4.0 x 1.0 x 3.0 |
  | Locker (steel almirah) | 3.0 x 1.75 x 6.5 |

- Typing in the search box narrows the list by name. Text that matches no item shows "no match"; the plan does not change.
- Items are added by **drag and drop only**, with no Add button (user decision, 2026-11-16). The user drags an item from the catalog onto the plan; while dragging, a white outline at real size follows the mouse and snaps to 0.25 ft.
  - Dropped inside the room: the item is placed where it was dropped. If any part would cross a wall, it stops at the wall.
  - Dropped outside the room: nothing is added.
- **2D drawing:** a placed item is drawn in the 2D plan as a plain white shape of its footprint (a rectangle of its width x depth, at real size) with the item's name written on it. No top-view symbol (user decision, 2026-11-17, "for now").
- A placed item faces 0° (its front toward the bottom wall). It is added to `items` in the room JSON with `id`, `catalogId`, `name`, `position` (centre, ft from the top-left corner), `size` (`width`, `depth`, `height`), `rotation` 0 and `colour` "#FFFFFF".
- Every item is white, in 2D and 3D. Colour **cannot be edited** (user decision, 2026-11-16).
- An item's size cannot be changed (no resizing; user decision, 2026-11-16).
- Dropping a new item near others follows the clearance rule (REQ-366): a red line while dragging, then a confirmation or a refusal on drop.

## Acceptance criteria
- The catalog lists exactly the six items above, each showing its width x depth x height in feet.
- Typing in the catalog search narrows the list to matching items; text that matches nothing shows "no match" and leaves the plan unchanged.
- Dragging an item from the catalog and dropping it inside the room places it where it was dropped: a white rectangle with the item's name on it, whose footprint (width x depth) measures its catalog size on the ruler.
- An item dropped so that it would cross a wall stops at the wall.
- Dropping an item outside the room adds nothing; there is no Add button.
- The added item appears in the room JSON with the fields above (`rotation` 0, `colour` "#FFFFFF"), and the JSON passes the schema check.

## Resolved questions
- How is each item drawn in 2D? **A white shape of its footprint (rectangle at real size) with its name on it** — user answer, 2026-11-17 ("for now just white in the shape of that with name on it"). Top-view symbols are not in scope for now.
- Catalog items and sizes, white only, no colour editing, no resizing, add by drag and drop — user answers, 2026-11-16.

## Source documents
- docs/project/source/features.md: #5 Add from catalog (REQ-285, REQ-298)
- docs/project/room-plan-schema.md
- docs/project/intent.md: G3, G4
- User answers, 2026-11-16 and 2026-11-17
