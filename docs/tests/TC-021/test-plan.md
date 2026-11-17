# TC-021 Warn when furniture is closer than 1.5 ft, refuse overlap

Requirement: REQ-366 - Work item: WI-038 - Application: web (apps/web)

## Scope
Covers the acceptance criteria of REQ-366: the recommended gap of 1.5 ft between items, the red line with the gap in feet while dragging or rotating, the "Place here / Cancel" popup for gaps under 1.5 ft (touching included), refusal of overlap with the message "Items cannot overlap.", and that the same rule runs after an add from the catalog, a move and a rotate. Also: the gap is measured edge to edge on the rotated outlines and shown to 2 decimals, a gap or overlap under 0.01 ft counts as touching, no red line after Place here, and a design opened from a file shows no lines or popups. Not covered: gaps to walls (not part of this rule), undo, touch devices, the 3D view.

## Preconditions
- Web app running (desktop browser). A room of 12 x 10 ft has been created (REQ-358) and the 2D plan is shown.
- Items are added from the catalog (REQ-359). Sizes (W x D ft): Bed 5.0 x 6.5, Sofa 6.5 x 3.0, Table 4.0 x 2.5, Chair 1.5 x 1.5.
- The room JSON can be inspected (Download JSON, or the JSON view).
- Unless a scenario says otherwise, start from a room with **Chair A** at about (2.0, 5.0) (edges x 1.25 to 2.75) and **Chair B** at about (9.0, 5.0), far from A.
- Gap = shortest distance between the outlines of two items, after rotation. The popup and the lines use 1.5 ft as the recommended gap.

## Scenarios

### S1 Far enough: placed with no line and no popup (AC1)
1. Drag Chair B so its centre is at X 5.0 (its left edge 4.25, a gap of 1.50 ft to Chair A). Release.
2. Repeat with X 6.0 and X 9.0.

Expected: while dragging there is no red line; on release the chair stays, no popup appears, the right panel shows the gap (1.50 ft or more) in normal colour and the room JSON has the new position.

### S2 Closer than 1.5 ft: red line while dragging (AC2, AC6)
1. Press on Chair B and drag it slowly towards Chair A. Stop with its centre at X 4.5 (gap 1.00 ft) without releasing.

Expected: a red line is drawn between the two chairs along the shortest distance, labelled "1.00 ft". Moving a little further changes the label (for example X 4.25 shows 0.75 ft). The line disappears again if you move back to a gap of 1.5 ft or more. The line never blocks the drag.

### S3 Drop under 1.5 ft: popup, Place here (AC2, AC3)
1. Drag Chair B to X 4.5 (gap 1.00 ft) and release.
2. Read the popup, then press **Place here**.
3. Click on an empty part of the plan, then click Chair B without moving it.

Expected:
- On release a popup "Too close" says: "This is 1.00 ft from the Chair. We recommend at least 1.5 ft. Place it here?" with **Place here** and **Cancel**; the red line stays until you answer.
- After Place here the chair stays at X 4.5, the room JSON has `position.x` 4.5, the red line and the popup are gone.
- Selecting the chair again (no movement) shows no line and no popup. The panel still shows the gap to Chair A as 1.00 ft in red.

### S4 Drop under 1.5 ft: Cancel (AC2)
1. Drag Chair B from X 9.0 to X 4.5 and release.
2. Press **Cancel** (or press Escape).

Expected: Chair B goes back to X 9.0; the red line is gone; the room JSON shows X 9.0 again.

### S5 No red line for that pair until dragged or rotated again (AC3)
1. Do S3 (Place here at gap 1.00 ft).
2. Look at the plan for a few seconds, select and deselect the chair.
3. Press and drag Chair B by a small step (still under 1.5 ft) and release.

Expected: after step 1 and 2 no line is shown. In step 3 the red line shows again while dragging and the popup asks again on release.

### S6 Touching is allowed but asks (AC2)
1. Drag Chair B so its left edge meets Chair A's right edge (centre X 3.5, gap 0.00 ft) and release.
2. Read the popup, press Place here.

Expected: while dragging a red mark and the label "0.00 ft" show between the chairs. The popup says "This is touching the Chair. Gap 0.00 ft. We recommend at least 1.5 ft. Place it here?" After Place here the chairs stand edge to edge; the panel shows 0.00 ft; the JSON is valid and the chairs do not overlap. Cancel in the same case returns the chair to X 9.0.

### S7 Overlap is refused (AC4)
1. Drag Chair B onto Chair A so they overlap clearly (for example centre X 3.0) and release.

Expected: while dragging both chairs are tinted red. On release a message "Items cannot overlap." appears with OK; after OK Chair B is back where it was before the drag and the room JSON is unchanged (compare it before and after). There is no Place here option for overlap.

### S8 Tolerance of 0.01 ft (AC5)
1. Place Chair B flush against Chair A (S6, gap 0.00 ft).
2. Drag it a tiny bit into Chair A (under 0.01 ft is hard to do by mouse, so use the 0.25 ft snap: drag it one snap step into A).

Expected: a flush placement is never reported as an overlap (it is the touching popup of S6). One 0.25 ft step into the other chair is a real overlap and is refused as in S7. (The exact 0.01 ft limit is checked by the automated tests.)

### S9 Adding from the catalog follows the same rule (AC6)
1. With Chair A in the room, drag a Table from the catalog and drop it so it ends about 1.0 ft from Chair A.
2. Press Cancel in the popup.
3. Drag a Table again and drop it so it ends touching Chair A, press Place here.
4. Drag a Table and drop it on top of Chair A.
5. Drag a Table and drop it 2 ft or more away from everything.

Expected: (1,2) the popup "This is ... ft from the Chair" appears; Cancel removes the new table (the plan has only the chair; the JSON has no new item). (3) The popup says touching with 0.00 ft; Place here keeps the table. (4) "Items cannot overlap." and no table is added. (5) The table is placed with no line and no popup.

### S10 Rotating follows the same rule (AC6)
1. Put a Sofa at about (6.0, 5.0) and a Chair at about (6.0, 8.0) (chair top edge 7.25, sofa bottom edge 6.5: gap 0.75 ft). Place here if asked.
2. Select the sofa and press **Rotate 10** until the sofa turns towards the chair, or drag the knob. Watch the lines.
3. Rotate the sofa to 90 deg so it would hit the chair, and release the knob.

Expected: while rotating, a red line with the gap follows the shortest distance and its number changes. When the rotation ends with a gap under 1.5 ft a popup asks once (not at every 10 deg step during the drag). A rotation that ends overlapping the chair shows "Items cannot overlap." and the sofa returns to its previous angle (Rotation in the panel and the JSON show the old angle). Cancel after a rotation restores the previous angle.

### S11 Edge to edge on rotated outlines, 2 decimals (AC7)
1. Put a Table at 0 deg and a Chair beside it, then rotate the table to 45 deg.
2. Drag the chair near the table and read the line label and the panel gap.
3. Compare with a manual measurement on the ruler along the shortest line between the two outlines (corner to edge).

Expected: the label is the distance between the actual rotated outline of the table and the chair (not between their bounding boxes), shown with 2 decimals and the same number in the panel and in the popup.

### S12 Several close items (AC2)
1. Put two items near a third, both closer than 1.5 ft to it, and drop the third.

Expected: a red line and label for each close item. The popup names the nearest item. If one of them is overlapped, the drop is refused as in S7.

### S13 A design opened from a file shows no lines (AC3 and file rule)
1. Download the JSON of a room with two items that are 1.0 ft apart (after Place here).
2. Open it again from the file (Upload JSON, when REQ-363 is available).

Expected: the room appears exactly as saved: no red line, no popup. A file whose items overlap is rejected by the upload (REQ-363), not by this rule.

### S14 Walls are not part of the rule
1. Drag an item so it touches a wall, and another item right next to it at 1.0 ft.

Expected: the wall gives no red line and no popup; only the item-to-item gap is checked.

## Out of scope (not tested here)
- Gap to walls; undo (Ctrl+Z); touch devices; 3D view.
- Upload of overlapping files (REQ-363).

## Automated coverage (already in the repo)
- `tests/room/clearance.test.ts` (gap for axis-aligned and 45 deg items, 1.5 ft boundary, touching, the 0.01 ft tolerance, overlap, nearest first), `tests/state/roomStore.test.ts` (add, move and rotate: far item placed, close item pending then Place here / Cancel, touching gap 0, overlap refused with the message and plan unchanged), `tests/features/rotateDelete.test.tsx` (red line and label while dragging, popup text for close and touching, Place here removes the line, Cancel puts it back, overlap message). They use a mocked pointer position, so this plan's manual run in a real browser is what checks real mouse dragging.
