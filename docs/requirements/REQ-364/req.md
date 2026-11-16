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
- Everything is white in 3D, as in 2D. Colours cannot be edited (user decision, 2026-11-16).
- The user can orbit, zoom and pan.
- Every time the 3D tab is opened, the camera starts from the same **start view**. Reset view returns to it at any time (user decision, 2026-11-16).
- It is a preview, not a photorealistic rendering (intent.md, Not goals).

## Acceptance criteria
- Opening the 3D tab shows the room and every item from the room JSON, all in white.
- Item positions, facings and footprints in 3D match the 2D plan, and item heights match their catalog heights.
- The user can orbit, zoom and pan the 3D view.
- The walls are 10 ft high.
- Opening the 3D tab always shows the start view, even after the camera was moved on an earlier visit.
- Switching back to the 2D tab shows the plan unchanged.

## Source documents
- docs/project/source/features.md: #8 3D preview (REQ-317, REQ-318)
- docs/project/room-plan-schema.md
- docs/project/intent.md: G1; Not goals (photorealistic rendering)
- User answers, 2026-11-16: 3D in its own tab; white only; 10 ft walls; camera starts from the start view each time

## Open questions
- How are items drawn in 3D: simple white boxes, or simple shapes per item (for example a sofa with a back and arms)?
- Are the proposed mouse controls fine: drag to orbit, scroll to zoom, right-drag to pan? What exactly is the start view (for example, looking in from the bottom-left corner)?
- How are the walls and the white items told apart in 3D (shading, outlines)?
