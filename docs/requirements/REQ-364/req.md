# REQ-364 User can view the design in 3D and orbit, zoom and pan

Feature: FEAT-1145 · Decision: DEC-399 · Group: 4. 3D preview
Order: 7 of 8
Depends on: User can start a new room by entering width and length (it reads the room JSON; placed after Share because the sources treat 3D as a preview)
Goals: G1

## Purpose
As a homeowner or interior designer, I can see the same design as a 3D room and orbit, zoom and pan around it.

## Behaviour
- The 3D view is built from the same room JSON as the 2D plan.
- It shows the room and every furniture item at its position, rotation and size.
- The user can orbit, zoom and pan.
- It is a preview, not a photorealistic rendering (intent.md, Not goals).

## Acceptance criteria
- The 3D view shows the room and every furniture item from the room JSON.
- Furniture positions, rotations and sizes in 3D match the 2D plan.
- The user can orbit, zoom and pan the 3D view.

## Source documents
- docs/project/source/features.md: #8 3D preview (REQ-317, REQ-318)
- docs/project/intent.md: G1; Not goals (photorealistic rendering)

## Open questions
- Is the 3D view shown beside the 2D plan, or in its own tab or mode?
- How are furniture items drawn in 3D (simple boxes or models)? What heights do they have? (The JSON holds a size, but the sources do not say if it includes height.)
- What wall height and floor look should the room have?
- Is there a button to reset the camera?
