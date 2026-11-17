# REQ-364 User can view the design in 3D and orbit, zoom and pan

Feature: FEAT-1145 · Decision: DEC-399 · Group: 4. 3D preview
Order: 8 of 9
Depends on: User can start a new room by entering width and length (it reads the room JSON; placed after Share because the sources treat 3D as a preview)
Goals: G1

## Purpose
As a homeowner or interior designer, I can see the same design as a 3D room and orbit, zoom and pan around it.

## Behaviour
- The 3D view is in **its own tab** next to the 2D plan tab (user decision, 2026-11-16).
- It is built from the same room JSON:
  - the floor and four walls, at the room width and length, with walls **10 ft** high (fixed; normal Indian homes);
  - every item at its `position`, facing its `rotation`, at its `size` (width, depth and height in feet).
- **Item shapes:** each item is drawn as a simple 3D shape that is recognisable at a glance as what it is (bed, sofa, table, chair, TV, locker), not as a plain box and not with a name label. The shape fits inside the item's width x depth x height from the catalog, so footprint and height match the 2D plan and the catalog (user decision, 2026-11-17).
- **All white:** everything is white in 3D, as in 2D. Colours cannot be edited (user decision, 2026-11-16).
- **Telling shapes apart:** shading and outlines separate the white items from the white floor and walls and show each shape's form (user decision, 2026-11-17).
- **Controls (one fixed set, kept simple):** drag to orbit, scroll to zoom, right-drag to pan.
- **Start view:** one fixed view that shows the whole room and every item: from above the bottom-left corner of the plan, looking toward the top-right corner, at about 45° down. Every time the 3D tab is opened the camera starts from this view. Reset view returns to it at any time (user decision, 2026-11-16; view chosen by Claude as the simple default and accepted by the user on 2026-11-17: "pick one best thing that captures all").
- It is a preview, not a photorealistic rendering (intent.md, Not goals).

## Acceptance criteria
- Opening the 3D tab shows the room and every item from the room JSON, all in white.
- Each item is drawn as a recognisable shape (bed, sofa, table, chair, TV, locker) with no name label.
- Item positions, facings and footprints in 3D match the 2D plan, and item heights match their catalog heights.
- Shading and outlines make the white items and walls distinguishable.
- The user can orbit (drag), zoom (scroll) and pan (right-drag) the 3D view.
- The walls are 10 ft high.
- Opening the 3D tab always shows the start view (from above the bottom-left corner, about 45° down, whole room visible), even after the camera was moved on an earlier visit.
- Reset view returns the camera to the start view.
- Switching back to the 2D tab shows the plan unchanged.

## Resolved questions
| Question | Answer |
|---|---|
| How are items drawn in 3D? | Simple white shapes that clearly read as the object (chair, bed, etc.), not plain boxes, no name labels. |
| Mouse controls and start view? | Drag = orbit, scroll = zoom, right-drag = pan. One simple start view that captures the whole room: above the bottom-left corner, about 45° down. |
| How are white items told apart from white walls? | Shading and outlines. |

## Source documents
- docs/project/source/features.md: #8 3D preview (REQ-317, REQ-318)
- docs/project/room-plan-schema.md
- docs/project/intent.md: G1; Not goals (photorealistic rendering)
- User answers, 2026-11-16: 3D in its own tab; white only; 10 ft walls; camera starts from the start view each time
- User answers, 2026-11-17: recognisable white shapes; simple single start view; shading and outlines
