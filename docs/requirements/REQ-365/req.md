# REQ-365 User sees 2D edits appear in the 3D view at once

Feature: FEAT-1146 · Decision: DEC-400 · Group: 4. 3D preview
Order: 9 of 9
Depends on: User can rotate and delete furniture; User can view the design in 3D and orbit, zoom and pan
Goals: G1

## Purpose
As a homeowner or interior designer, I see every edit I make in the 2D plan show up in the 3D view with no manual steps.

## Behaviour
- The 3D view is in its own tab. Every change to the room JSON (add, move, rotate, delete, opening a file) is in the 3D tab the next time the user opens it, with no refresh or extra action.
- Switching between the 2D and 3D tabs any number of times always shows the same design.
- Each time the 3D tab opens, the camera is back at the start view (user decision, 2026-11-16; see REQ-364).
- The 3D tab is **view-only**: the user can orbit, zoom, pan and reset the view (REQ-364), but cannot select, add, move, rotate or delete items there. All edits are made in the 2D tab (user decision, 2026-11-17).

## Acceptance criteria
- After adding, moving, rotating or deleting an item in 2D, opening the 3D tab shows the same change.
- After opening a design from a file, the 3D tab shows that design.
- No refresh, reload or extra button is needed to see a change in 3D.
- Clicking an item in the 3D tab does not select it or change the design; the 3D tab offers no editing.

## Resolved questions
| Question | Answer |
|---|---|
| Is the 3D tab view-only, or can items be selected there? | View-only. Edits are made only in the 2D tab. |

## Source documents
- docs/project/source/features.md: #8 3D preview (REQ-317, REQ-318)
- docs/project/intent.md: G1; Success: "After any edit, the 2D plan and the 3D view show the same design with no manual steps"
- User answers, 2026-11-16: 3D in its own tab; camera back to the start view each time
- User answer, 2026-11-17: 3D tab is view-only
