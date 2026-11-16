# REQ-359 User can add Indian furniture from a searchable catalog

Feature: FEAT-1140 · Decision: DEC-394 · Group: 2. Furnish and edit
Order: 2 of 9
Depends on: User can start a new room by entering width and length
Goals: G4, G3

## Purpose
As a homeowner or interior designer, I can search a catalog of Indian furniture and add an item to the plan at its real size.

## Behaviour
- The catalog has six items, each with a fixed width, depth and height in feet (sizes proposed in [room-plan-schema.md](../../project/room-plan-schema.md), to be confirmed):

  | Item | W x D x H ft |
  |---|---|
  | Bed (queen) | 5.0 x 6.5 x 1.5 |
  | Sofa (3 seat) | 6.5 x 3.0 x 2.75 |
  | Table (4 seat) | 4.0 x 2.5 x 2.5 |
  | Chair | 1.5 x 1.5 x 3.0 |
  | TV (on stand) | 4.0 x 1.0 x 3.0 |
  | Locker (steel almirah) | 3.0 x 1.75 x 6.5 |

- Typing in the search box narrows the list by name.
- Adding an item draws it in the 2D plan at its real size, facing 0° (its front toward the bottom wall), and adds it to `items` in the room JSON with `catalogId`, `name`, `position` (centre, ft from the top-left corner), `size`, `rotation` 0 and `colour` "#FFFFFF".
- Every item is white, in 2D and 3D. Colour **cannot be edited** (user decision, 2026-11-16).
- An item's size cannot be changed (no resizing; user decision, 2026-11-16).
- Placing a new item near others follows the clearance rule (REQ-366).

## Acceptance criteria
- The catalog lists exactly the six items, each showing its width x depth x height in feet.
- Typing in the catalog search narrows the list to matching items; text that matches nothing shows "no match" and leaves the plan unchanged.
- Adding an item shows it in the 2D plan inside the room, white, with its footprint (width x depth) measuring its catalog size on the ruler.
- The added item appears in the room JSON with the fields above, and the JSON passes the schema check.

## Source documents
- docs/project/source/features.md: #5 Add from catalog (REQ-285, REQ-298)
- docs/project/room-plan-schema.md
- docs/project/intent.md: G3, G4
- User answers, 2026-11-16: catalog items; white only; no colour editing; no resizing

## Open questions
- Confirm the proposed sizes in the table above.
- Where is a new item placed (centre of the room, the first free spot, or where the user drops it)? Can items be dragged in from the catalog?
- What happens if a new item cannot fit anywhere with at least 0.5 ft clearance?
- How is each item drawn in 2D (a labelled rectangle, or a simple top-view symbol)?
