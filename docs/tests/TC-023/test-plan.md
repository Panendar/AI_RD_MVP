# TC-023 Upload JSON opens a valid design, rejects invalid files, confirms replace

Requirement: REQ-363 - Work item: WI-042 - Application: web (apps/web)

## Scope
Covers the acceptance criteria of REQ-363: Upload JSON opens a `.json` design exactly as saved; editing continues on it; a file that fails the size limit (1 MB), the schema check or a business rule is rejected with the one general message "This file is not a valid room design." and the current design is kept; when a design with items is open, a Replace / Cancel confirmation comes first; downloading the opened design gives the same design. Not covered: the 3D view (REQ-364), accounts or cloud storage (none exist), browser-specific file pickers.

## Preconditions
- Web app running (desktop browser). A 12 x 10 ft room can be created (REQ-358); items are added from the catalog (REQ-359). Catalog sizes (W x D ft): Bed 5.0 x 6.5, Sofa 6.5 x 3.0, Table 4.0 x 2.5, Chair 1.5 x 1.5.
- Download JSON (REQ-362) works. A text editor is available to edit copies of downloaded files.
- Prepare these files from a download of a design with a Sofa near the top and a Table far below it (call it `good.json`):
  - `close.json`: copy of `good.json` with the Table moved to 0.25 ft below the Sofa (valid: closer than 1.5 ft).
  - `touching.json`: Table moved so it touches the Sofa (gap 0).
  - `overlap.json`: Table moved so it overlaps the Sofa.
  - `outside.json`: Table `position.y` set to 99.
  - `badsize.json`: Sofa `size.width` set to 1.
  - `dupid.json`: both items given the same `id`.
  - `badwalls.json`: `room.width` changed so the walls no longer match.
  - `schema.json`: `schemaVersion` changed to "9.9".
  - `notjson.json`: a text file containing `not json`, saved with the .json extension.
  - `big.json`: a copy of `good.json` padded with whitespace to just over 1 MB (1,048,577 bytes); `limit.json`: padded to exactly 1,048,576 bytes.

## Scenarios

### S1 Open a file made by Download JSON (AC1)
1. Create a 12 x 10 ft room with no items, then click **Upload JSON** and choose `good.json`.

Expected: no confirmation appears (the room has no items). The 2D plan shows the Sofa and the Table at the saved places, rotations and colours, with the saved room size. No red lines and no pop-ups.

### S2 Keep editing after opening (AC2)
1. After S1, move the Sofa, rotate the Table by 90 degrees, delete the Table, then drag a Chair from the catalog onto the room.

Expected: every action works as before; the plan shows the Sofa (moved) and the Chair.

### S3 Download again gives the same design (AC4)
1. Open `good.json` into an empty room (S1) without editing.
2. Click **Download JSON** and open the new file.

Expected: the file holds the same design as `good.json` (same room, same items, positions, rotations, sizes and colours).

### S4 Close and touching items open exactly as saved (AC1)
1. Upload `close.json`, then (after Replace if asked) upload `touching.json`.

Expected: both open. The plan shows the items as saved, with no red lines, no "Too close" pop-up and no warning of any kind.

### S5 Confirmation before replacing an open design
1. Open a design that has at least one item (for example add a Bed).
2. Click **Upload JSON** and choose `good.json`.
3. Press **Cancel**.
4. Choose `good.json` again and press **Replace**.

Expected: after step 2 a dialog says "Replace the current design with good.json? The current design will be lost." with **Cancel** and **Replace**; the Bed is still on screen. Cancel (or Escape) closes it and the Bed stays. Replace opens `good.json` and the Bed is gone.

### S6 Invalid files are rejected with one general message (AC3)
1. With a design that has items open, upload each of: `overlap.json`, `outside.json`, `badsize.json`, `dupid.json`, `badwalls.json`, `schema.json`, `notjson.json`.
2. After each, press **OK**.

Expected: for every file a dialog shows "This file is not a valid room design." and nothing about the failing field or rule. The Replace dialog does not appear. After OK the design on screen is exactly what it was before.

### S7 The 1 MB limit (AC3)
1. With a design open, upload `big.json` (1,048,577 bytes).
2. Upload `limit.json` (exactly 1,048,576 bytes).

Expected: `big.json` is rejected with the same general message and the current design is kept. `limit.json` is accepted (Replace dialog if a design is open, then it opens).

### S8 Same file can be chosen twice
1. Upload `notjson.json`, press OK, and choose `notjson.json` again.

Expected: the dialog appears both times (the browser does not ignore the repeated choice).

### S9 Cancelling the file picker
1. Click **Upload JSON** and close the picker without choosing a file.

Expected: nothing happens; the current design is unchanged and no dialog appears.

## Pass criteria
All scenarios S1 to S9 behave as expected. A valid file that does not open, a rejected file that changes the current design, an error message that names the failing field or rule, a clearance warning or red line on open, an oversized file that is accepted, or a replace without the confirmation when items are open is a failure.
