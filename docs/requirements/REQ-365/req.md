# REQ-365 User sees 2D edits appear in the 3D view at once

Feature: FEAT-1146 · Decision: DEC-400 · Group: 4. 3D preview
Order: 8 of 8
Depends on: User can rotate, resize and delete furniture; User can view the design in 3D and orbit, zoom and pan
Goals: G1

## Purpose
As a homeowner or interior designer, I see every edit I make in the 2D plan show up in the 3D view with no manual steps.

## Behaviour
- Every change to the room JSON (add, move, rotate, resize, delete, opening a file) updates the 3D view straight away.
- The user does not need to refresh or take any action.

## Acceptance criteria
- Adding, moving, rotating, resizing or deleting an item in 2D shows the same change in 3D straight away.
- Opening a design from a file shows it in 3D as well as in 2D.
- No refresh or extra action is needed to see the change in 3D.

## Source documents
- docs/project/source/features.md: #8 3D preview (REQ-317, REQ-318)
- docs/project/intent.md: G1; Success: "After any edit, the 2D plan and the 3D view show the same design with no manual steps"

## Open questions
- During a drag, should the 3D view update while the item moves, or only when it is dropped?
- Should the 3D camera keep its position when the design changes or a file is opened?
- Can the user edit furniture in the 3D view, or is 3D view-only? (The sources only describe edits in 2D.)
