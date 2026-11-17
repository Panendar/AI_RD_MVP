# TC-026 2D edits show in the 3D tab at once; 3D is view-only

Requirement: REQ-365 - Work item: WI-044 - Application: web (apps/web)

## Scope
Covers the acceptance criteria of REQ-365: after adding, moving, rotating or deleting an item in the 2D tab, opening the 3D tab shows the same change; after opening a design from a file, the 3D tab shows that design; no refresh, reload or extra button is needed; the 3D tab is view-only (clicking an item selects or changes nothing); each 3D open starts at the start view (REQ-364); switching tabs any number of times shows the same design. Not covered: how the shapes look (TC-025), the camera controls (TC-025), touch gestures, browsers other than a current desktop one with WebGL.

## Preconditions
- Web app running in a desktop browser with WebGL. A 12 x 10 ft room can be created, items added from the catalog, moved, rotated and deleted (REQ-358 to REQ-361), and Upload and Download JSON work (REQ-362, REQ-363).
- Start with a 12 x 10 ft room holding a Sofa near the top wall, a Table in the lower left and a Locker near the top right (design `E1`). Download it as `e1.json` before the scenarios.
- A second saved design `E2` (a different room content, for example a Bed and a Chair only) as `e2.json`.
- Catalog sizes (W x D x H ft): Bed 5.0 x 6.5 x 1.5, Sofa 6.5 x 3.0 x 2.75, Table 4.0 x 2.5 x 2.5, Chair 1.5 x 1.5 x 3.0, TV 4.0 x 1.0 x 3.0, Locker 3.0 x 1.75 x 6.5.

## Scenarios

### S1 An item added in 2D appears in 3D (AC1)
1. In the 2D tab, drag a Chair into an empty part of the room.
2. Click the **3D view** tab.

Expected: the 3D view shows the Sofa, Table, Locker and the new Chair, in the same places as in the 2D plan. The side note reads "4 items, all white". No refresh or extra button was used.

### S2 A moved item appears in its new place (AC1)
1. Click the **2D plan** tab and drag the Sofa to the right.
2. Click the **3D view** tab.

Expected: the Sofa is in its new place, the same as the 2D plan (same distance from the walls). The other items are unchanged.

### S3 A rotated item shows its new facing (AC1)
1. In the 2D tab, select the Table and rotate it 90 degrees.
2. Click the **3D view** tab.

Expected: the Table is turned the same way as in 2D (long side now runs along the room length). Position unchanged.

### S4 A deleted item is gone (AC1)
1. In the 2D tab, select the Locker and delete it (confirm).
2. Click the **3D view** tab.

Expected: the Locker is not in 3D. The side note shows one item fewer. The other items are unchanged.

### S5 Several edits in a row, then 3D once (AC1, AC3)
1. In the 2D tab add a Bed, move the Chair, rotate the Sofa by 30 degrees and delete the Table, without opening 3D in between.
2. Click the **3D view** tab.

Expected: the 3D view shows all of these changes together and matches the 2D plan item for item.

### S6 Switching tabs many times shows the same design (AC1, AC3)
1. Click 3D, 2D, 3D, 2D, 3D at least five times in total, without editing.

Expected: each time, the 3D view shows the same items in the same places, and the 2D plan is unchanged (nothing moved, nothing lost). The camera is at the start view each time the 3D tab opens, even if it was moved during an earlier visit.

### S7 An edit made after visiting 3D shows next time (AC1)
1. Open the 3D tab, orbit the camera a little, then click the 2D tab.
2. Move the Sofa, then click the 3D tab again.

Expected: the Sofa is in its new place and the camera is back at the start view (not where it was left).

### S8 A design opened from a file shows in 3D (AC2)
1. In the 2D tab, click **Upload JSON** and choose `e2.json`. Confirm "Replace the current design?".
2. Click the **3D view** tab.

Expected: the 3D view shows the `E2` design (Bed and Chair), not `E1`. The side note matches `E2`.

### S9 A file opened while the 3D tab is open (AC2)
1. Click the **3D view** tab, then **Upload JSON** and choose `e1.json`. Confirm Replace.

Expected: the 3D view changes to the `E1` design at once, with no reload. (The camera returns to the start view.)

### S10 An invalid file leaves 3D unchanged (AC2)
1. In the 3D tab, upload a file that is not a valid room design.

Expected: the "not a valid room design" message appears; after OK the 3D view still shows the same design as before.

### S11 No refresh or extra button is needed (AC3)
1. Look at the 3D tab and the editor header during S1 to S9.

Expected: the only button in the 3D panel is **Reset view** (camera). There is no Refresh, Update, Sync or Reload button, and the browser was never reloaded.

### S12 The 3D tab is view-only (AC4)
1. In the 3D tab, click an item, click the floor, double-click an item, and press Delete, R and arrow keys.
2. Drag an item with the left mouse button (this orbits the camera).
3. Click the **2D plan** tab.

Expected: nothing is selected or highlighted in 3D; no edit, delete or rotate controls appear in 3D; items do not move. The 2D plan is exactly as before (same items, positions, rotations, nothing selected because of the 3D clicks). Download JSON gives the same content as before the clicks.

## Automated checks (for reference)
`apps/web/tests/features/threeDSync.test.tsx` (9 tests: add, move, rotate, delete, tab switching, fresh scene per open, file opened also while 3D is open, no extra controls, view-only) and the existing `threeDTab.test.tsx`. These check the scene builder input in jsdom; this plan's scenarios confirm the result visually in a real browser.
