# TC-019 Select and move furniture in the 2D plan, kept inside the walls

Requirement: REQ-360 · Work item: WI-036 · Application: web (apps/web)

## Scope
Covers the acceptance criteria of REQ-360: selecting an item by click (visible selection, right panel values), moving it by mouse drag in 0.25 ft steps, stopping at the walls, and the room JSON matching the plan straight away. Not covered: arrow-key moves, multi-select, deselecting, rotation (REQ-361), clearance between items (REQ-366), touch devices.

## Preconditions
- Web app running (desktop browser). A room of 12 x 10 ft has been created (REQ-358) and the 2D plan is shown.
- One Sofa (3 seat) has been added at about (6.0, 5.0) (REQ-359), so the room JSON has `items[0]` with `position` {x: 6.0, y: 5.0}, size 6.5 x 3.0, rotation 0.
- The room JSON can be inspected (Download JSON, or the JSON view).
- Position is the item centre, in ft from the top-left corner.

## Scenarios

### S1 Click selects an item and shows its values (AC1)
1. Click the sofa.

Expected: the sofa gets a highlighted (blue, thicker) outline; the right panel "SELECTED ITEM" shows "Sofa (3 seat)", W 6.5 D 3.0 H 2.75 ft, Centre X 6.00 Y 5.00, Rotation 0 deg, and the hint "Drag to move. Moves snap to 0.25 ft." Before the click the panel showed "(nothing selected)". A simple click does not change the position in the JSON.

### S2 Selecting another item moves the selection (AC1)
1. Add a Chair in an open area, then click the chair.
2. Click the sofa again.

Expected: only the clicked item is highlighted at any time; the panel shows the values of the clicked item; the other item is drawn with the normal thin outline.

### S3 Drag moves in 0.25 ft steps (AC2)
1. Press on the sofa and drag it slowly to the right and down, watching the panel.
2. Release at about 1.3 ft right and 0.6 ft down from where it started.

Expected:
- The sofa follows the pointer without jumping to it (it keeps the offset where it was grabbed).
- While dragging, the panel centre changes only in multiples of 0.25 (e.g. X 6.00 -> 6.25 -> 6.50 ...).
- After release the centre is a multiple of 0.25 ft on both axes (about X 7.25, Y 5.50) and the sofa stays where it was released; moving the mouse afterwards does not move it.
- The sofa's size and rotation are unchanged.

### S4 Panel, plan and JSON agree straight away (AC2, AC4)
1. After S3, read the centre in the right panel, measure the sofa's centre against the ruler, and open the room JSON.

Expected: the panel, the plan and `items[0].position` show the same X and Y (multiples of 0.25). Only `position` differs from before the move; `id`, `catalogId`, `name`, `size`, `rotation`, `colour` are unchanged. The JSON passes the schema check (Download JSON succeeds / no validation error). Check the JSON during a drag too: it already holds the current position, with no extra step needed.

### S5 Drag past the right and bottom walls stops at the wall (AC3)
1. Drag the sofa far to the right and down, past the right and bottom walls, and release outside the room.

Expected: the sofa stops touching the walls and is not outside the room. Centre (8.75, 8.5) in the 12 x 10 room (right edge at 12.0, bottom edge at 10.0). It never leaves the floor during the drag.

### S6 Drag past the left and top walls stops at the wall (AC3)
1. Drag the sofa far to the left and up, past the left and top walls.

Expected: centre (3.25, 1.5); the left edge is at 0 and the top edge at 0, touching the walls. JSON position (3.25, 1.5).

### S7 Small and odd-sized items stay on the 0.25 ft grid (AC2, AC3)
1. Add a Locker (3.0 x 1.75 ft). Drag it past the bottom wall.
2. Add a Chair (1.5 x 1.5 ft). Drag it into the top-left corner.

Expected: Locker bottom edge touches the bottom wall; its centre Y is 9.0 (a multiple of 0.25, edge at 9.875, the nearest grid position inside the wall) and the item is not outside the room. Chair centre (0.75, 0.75), touching both walls. Both positions in the JSON are multiples of 0.25.

### S8 Wall-stop applies to the whole item, not just the centre (AC3)
1. Drag the Bed (5.0 x 6.5 ft) to the right wall, then to the bottom wall.

Expected: the bed's edge touches the wall, not its centre. Bed centre X max 9.5, Y max 6.75. Nothing sticks out past the walls.

### S9 Room JSON is unchanged except position after several moves (AC4)
1. Move the sofa and the chair several times each, in different directions, with the wall hit at least once.
2. Compare the JSON `items` with the state before the moves.

Expected: same ids, same order, same count of items; only `position` values changed; every position is a multiple of 0.25 ft; the JSON passes the schema check; the room size and walls are unchanged.

## Out of scope (not tested here)
- Arrow keys, multi-select, deselecting (needs a new requirement).
- Overlap and clearance between items (REQ-366).

## Automated coverage (already in the repo)
- `tests/room/placement.test.ts` (clampCentre), `tests/state/roomStore.test.ts` (moveItem), `tests/features/moveItem.test.tsx` (select, drag, wall stop, panel). They use a mocked pointer position, so this plan's manual run on a real browser is what checks real mouse dragging.
