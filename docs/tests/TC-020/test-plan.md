# TC-020 Rotate and delete furniture in the 2D plan

Requirement: REQ-361 - Work item: WI-037 - Application: web (apps/web)

## Scope
Covers the acceptance criteria of REQ-361: rotating the selected item by dragging the knob on the rotation ring (10 degree steps), the Rotate 10 button (350 -> 0), a rotation that would cross a wall not being applied, Delete with a confirmation (confirm and cancel), the room JSON matching the plan straight away, and no control to change an item's size. Not covered: undo after delete, typing an exact angle, right-click rotation, clearance between items (REQ-366), touch devices.

## Preconditions
- Web app running (desktop browser). A room of 12 x 10 ft has been created (REQ-358) and the 2D plan is shown.
- One Sofa (3 seat) has been added at about (6.0, 5.0) (REQ-359), so the room JSON has `items[0]` with `position` {x: 6.0, y: 5.0}, size 6.5 x 3.0, `rotation` 0.
- The room JSON can be inspected (Download JSON, or the JSON view).
- `rotation` is the facing in degrees clockwise: 0 = the front faces the bottom wall, 90 = the left wall, 180 = the top wall, 270 = the right wall.

## Scenarios

### S1 The ring appears for the selected item (AC1)
1. With nothing selected, look at the plan.
2. Click the sofa.

Expected: before the click there is no ring. After the click the sofa shows a dashed ring around it with a knob at the bottom (0 deg) and the label "0 deg" next to the knob. The right panel shows Rotation 0 deg, Facing: bottom wall, Step: 10 deg, "(size is fixed)", and the buttons Rotate 10 and Delete.

### S2 Dragging the knob rotates in 10 degree steps (AC1)
1. Press on the knob and drag it slowly around the ring to the left of the sofa, watching the angle label and the panel.
2. Release when the label shows 90 deg.

Expected:
- The sofa turns around its centre while dragging; the angle label and the panel Rotation only show multiples of 10 (0, 10, 20 ... 90).
- At 90 deg the sofa stands upright (its long side vertical) and the panel shows Facing: left wall.
- The sofa's centre does not move and the sofa is not dragged along; its size is unchanged.
- After release, moving the mouse does not rotate it further.

### S3 Plan, panel and JSON agree straight away (AC1)
1. While dragging the knob, stop at about 40 deg and look at the panel and the room JSON.

Expected: the angle on the ring, in the panel and `items[0].rotation` in the JSON are all 40, with no extra step needed. Dragging between two steps (for example the pointer at about 43 deg) shows the nearest step, 40. Only `rotation` differs from before; `position`, `size`, `id`, `catalogId`, `name` and `colour` are unchanged, and the JSON passes the schema check.

### S4 Full turn through 350 and back to 0 (AC1)
1. Drag the knob around the whole ring, past 350 deg.

Expected: after 350 the angle shows 0 (never 360) in the label, the panel and the JSON; all values stay in 0 to 350.

### S5 Rotate 10 button turns 10 deg clockwise (AC2)
1. Select the sofa at 0 deg and press Rotate 10 once.
2. Press Rotate 10 again.

Expected: 10 deg, then 20 deg: the sofa turns clockwise each time; the ring, panel and `rotation` in the JSON match each press.

### S6 Rotate 10 wraps from 350 to 0 (AC2)
1. Turn the sofa to 350 deg (knob, or Rotate 10 repeatedly).
2. Press Rotate 10.

Expected: the angle becomes 0 (not 360); the JSON `rotation` is 0.

### S7 A rotation that would cross a wall is not applied (AC3)
1. Drag the sofa into the top-right corner so it touches the top and right walls (centre about X 8.75, Y 1.5).
2. Press Rotate 10.
3. Drag the knob towards 10 deg and further.

Expected: the sofa keeps its last angle (0 deg); nothing is drawn outside the walls. The panel and the JSON still show Rotation 0 and the same position. The angle label and the panel show the item's real angle, not the angle the pointer is at.

### S8 Rotation works again once there is room (AC3)
1. After S7, drag the sofa to the middle of the room and press Rotate 10.

Expected: the rotation is applied (10 deg). The refusal in S7 did not change anything else.

### S9 Rotation near a wall stops at the last angle that fits (AC3)
1. Drag the sofa towards the top wall in the middle of the room until its centre is at about X 6, Y 3.0.
2. Drag the knob slowly from 0 towards 90 deg.

Expected: the sofa turns until its rotated outline would touch the top wall (its half-height grows from 1.5 ft at 0 deg to 3.25 ft at 90 deg, so at Y 3.0 it fits up to 30 deg and not 40); knob positions beyond that are ignored. The sofa is never drawn outside the walls, and the JSON `rotation` is the last angle that fit (a multiple of 10).

### S10 Delete asks for confirmation; Cancel changes nothing (AC4)
1. Select the sofa and press Delete.
2. In the popup "Delete Sofa (3 seat)? [Delete] [Cancel]" press Cancel.

Expected: the popup closes; the sofa is still on the plan and still selected; `items` in the JSON is unchanged. Pressing Escape instead of Cancel behaves the same.

### S11 Confirming Delete removes the item (AC4)
1. With two items on the plan (sofa and chair), select the sofa and press Delete, then confirm Delete in the popup.

Expected: the sofa disappears from the plan, together with its ring; the panel shows "(nothing selected)"; `items` in the JSON no longer has the sofa and still has the chair unchanged (same id, position, rotation). The JSON passes the schema check.

### S12 Deleting the only item leaves an empty valid room (AC4)
1. Delete the remaining chair as in S11.

Expected: the plan is the empty room; `items` is `[]`; the room size and walls are unchanged.

### S13 No control to change the size (AC5)
1. Select an item and look at the plan, the ring, the toolbar and the panel.

Expected: no resize handles and no size field or button anywhere; the panel shows W, D, H as text with "(size is fixed)".

### S14 Mouse and button give the same result (AC1, AC2)
1. Rotate one sofa to 30 deg with the knob, and another to 30 deg with Rotate 10 pressed three times.

Expected: both sofas have `rotation` 30 in the JSON and look identical (apart from their position).

### S15 Rotation keeps the item's position (AC1)
1. Note the centre in the panel, rotate with the knob and with the button, then read the centre again.

Expected: the centre X and Y are the same as before (the item turns around its centre); only `rotation` changed.

## Out of scope (not tested here)
- Undo after a confirmed delete (Ctrl+Z); typing an exact angle in the panel; right-click rotation.
- Clearance between items when rotating near them (REQ-366).

## Automated coverage (already in the repo)
- `tests/room/rotation.test.ts` (10 deg snap, wrap to 0, angle convention), `tests/state/roomStore.test.ts` (rotateItem, rotateItemStep, deleteItem, refused at a wall), `tests/features/rotateDelete.test.tsx` (ring, knob drag, Rotate 10, wall refusal, delete confirm and cancel, no size control). They use a mocked pointer position, so this plan's manual run in a real browser is what checks real mouse dragging.
