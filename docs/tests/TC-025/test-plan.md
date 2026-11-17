# TC-025 3D view shows the white room and items, with orbit, zoom, pan and a fixed start view

Requirement: REQ-364 - Work item: WI-043 - Application: web (apps/web)

## Scope
Covers the acceptance criteria of REQ-364: the 3D tab shows the room and every item from the room JSON, all white and shaded and outlined; each item is a recognisable shape (bed, sofa, table, chair, TV, locker) with no name label; positions, facings, footprints and heights match the 2D plan and the catalog; the walls are 10 ft high; drag orbits, scroll zooms, right-drag pans; every time the 3D tab opens the camera is at the start view (above the bottom-left corner, about 45 degrees down, whole room visible); Reset view returns to it; going back to the 2D tab shows the plan unchanged. Not covered: photorealism (not a goal), touch gestures, other browsers than a current desktop one with WebGL.

## Preconditions
- Web app running in a desktop browser with WebGL. A 12 x 10 ft room can be created (REQ-358); items are added from the catalog (REQ-359) and can be moved and rotated (REQ-360, REQ-361).
- Catalog sizes (W x D x H ft): Bed 5.0 x 6.5 x 1.5, Sofa 6.5 x 3.0 x 2.75, Table 4.0 x 2.5 x 2.5, Chair 1.5 x 1.5 x 3.0, TV 4.0 x 1.0 x 3.0, Locker 3.0 x 1.75 x 6.5.
- Prepare design `D1` in a 12 x 10 ft room: a Sofa against the top wall facing down the room (rotation 0), a TV against the bottom wall facing up (rotation 180), a Table in the middle, a Locker against the left wall turned 90, a Bed near the right wall and a Chair beside the Table, rotated 30.
- Also prepare an empty 12 x 10 ft room (`D0`) and a 30 x 30 ft room with one Sofa (`D2`), and a 6 x 6 ft room with one Chair (`D3`).

## Scenarios

### S1 The 3D tab shows the room and every item (AC1)
1. Open `D1` in the 2D plan, then click the **3D view** tab.

Expected: a 3D room appears with a floor and four walls, and all six items. Everything is white. The side note reads "Room 12 x 10 ft", "Walls 10 ft high", "6 items, all white". There are no name labels on the items.

### S2 Items are recognisable shapes (AC2)
1. In `D1`'s 3D view, orbit and zoom so each item is seen clearly.

Expected: the Bed looks like a bed (frame, mattress, headboard, pillows), the Sofa like a sofa (back and arms), the Table has a top and four legs, the Chair has a seat, back and legs, the TV is a thin screen on a stand, the Locker is a tall cabinet with doors. None is a plain box.

### S3 White items can be told apart (AC4)
1. Look at items against the white floor and walls, from the start view and after orbiting.

Expected: shading and dark outlines make every item, the floor and the walls distinguishable; shapes show their form.

### S4 Positions, facings and footprints match the 2D plan (AC3)
1. Compare the 3D view of `D1` with its 2D plan: where each item stands, which wall it is against, which way it faces (Sofa seat toward the room, TV screen toward the Sofa, Locker door facing right, Chair rotated 30).
2. Orbit to look straight down (top view) and compare footprints with the plan.

Expected: the same positions, the same facing and the same footprints as the plan; the Sofa still touches the top wall, the Locker the left wall.

### S5 Heights match the catalog (AC3)
1. Orbit to a side view of `D1` and compare the height of the Locker (6.5 ft), the Sofa (2.75 ft) and the Bed (1.5 ft) with each other and with the 10 ft wall.

Expected: the Locker is about two thirds of the wall height, the Sofa a little over a quarter of it, the Bed about one seventh; the Chair (3.0 ft) is a little taller than the Table (2.5 ft).

### S6 Walls are 10 ft high (AC5)
1. In the side view of `D1`, compare the wall height with the 12 ft width of the room.

Expected: the walls are 10 ft high, about 5/6 of the room width, in every room tested (also `D2` and `D3`).

### S7 Orbit, zoom and pan (AC3)
1. Drag with the left mouse button.
2. Scroll the wheel up and down.
3. Drag with the right mouse button.

Expected: left-drag orbits around the room; scroll zooms in and out; right-drag pans (moves the view sideways). Moving the camera does not change any item. The page does not scroll while the wheel is used over the 3D view, and the browser context menu does not get in the way of right-drag.

### S8 Start view (AC6)
1. Open the 3D tab for `D1`.
2. Compare with the description: from above the bottom-left corner of the plan, looking toward the top-right corner, about 45 degrees down.

Expected: the whole room (floor, all four walls) and every item are visible without moving the camera. The view looks from the bottom-left towards the top-right of the plan.

### S9 Start view on every open (AC6)
1. Open the 3D tab, orbit, zoom and pan to a very different view.
2. Click the **2D plan** tab, then the **3D view** tab again.

Expected: the camera is back at the start view (same as S8), not where it was left.

### S10 Reset view
1. In the 3D view move the camera away, then click **Reset view**.
2. Repeat after zooming far in and after panning far away.

Expected: each time the camera returns to the start view of S8.

### S11 Start view fits small and large rooms (AC6)
1. Open the 3D tab for `D3` (6 x 6 ft), then for `D2` (30 x 30 ft).

Expected: in both rooms the whole room and its item are visible at the start view, not cut off at the edges.

### S12 The 2D plan is unchanged (AC7)
1. Note the 2D plan of `D1`. Switch to **3D view**, move the camera, switch back to **2D plan**.
2. Click **Download JSON** before and after the 3D visit and compare the files.

Expected: the plan looks exactly as before and the two JSON files are identical. The 3D tab changed nothing.

### S13 The 3D view follows the design
1. In the 2D plan of `D1`, move the Sofa, delete the Chair and add a Bed, then open the 3D tab.
2. Upload a different design (REQ-363) and open the 3D tab again.

Expected: the 3D view shows the current design each time (items moved, removed and added as in the plan).

### S14 Empty room and edge cases
1. Open the 3D tab for `D0` (no items).
2. Resize the browser window while in 3D view.

Expected: the empty room shows the floor and four walls with "0 items, all white". After resizing, the 3D view fills its area without stretching the room.

## Pass criteria
All scenarios S1 to S14 behave as expected. A coloured item or surface, an item drawn as a plain box, a name label, an item in the wrong place, facing or size, walls not 10 ft, a control that does not work as described, a camera that does not return to the start view (on opening the tab or on Reset view), a room cut off at the start view, a changed 2D plan or JSON after a 3D visit, or an error or blank view where WebGL is available is a failure.
