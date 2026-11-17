# WI-037 Rotate and delete furniture in the 2D plan

Applications: web (primary)
Requirement: REQ-361 · Decision: DEC-396 · Feature: FEAT-1142

## Approach
Browser only, on top of WI-036 (selection in `useDragState`, `moveItem`, `PlanView`, `PlanItem`, `clampCentre`). The room JSON stays the single source of truth: rotate and delete are store actions that build a new plan, check it with `checkRoomPlan`, and keep it only if it passes. Nothing is sent to the API.

1. **Rotation maths (pure TypeScript)** – `src/room/placement.ts` (or a new `src/room/rotation.ts`)
   - `ROTATION_STEP_DEG = 10`.
   - `snapAngle(deg)`: normalises to 0..359 and snaps to the nearest 10 (355 and above gives 0).
   - `angleFromPoint(centre, point)`: the pointer angle around the item centre in degrees clockwise, using the room convention of `rotation` (0 = front faces the bottom wall, so the knob at the bottom is 0; verify against `docs/project/room-plan-schema.md` and how `PlanItem` draws `rotate(rotation)`).
2. **Store** – `useRoomStore` in `src/state/roomStore.ts` gains:
   - `rotateItem(itemId, degrees): ChangeResult`: snaps the angle, builds a copy of the plan with the new `rotation` (position and size untouched), runs `checkRoomPlan` (rule `itemsInsideWalls` already uses the rotated bounds) and sets the plan only if it passes. A rotation that would leave the walls is **not applied** (the item keeps its last angle; the centre is not moved to make it fit). Unknown id or unchanged angle: no change. A `beforeRotateItem` guard list (like `beforeMoveItem`) is the hook where REQ-366 adds the clearance step.
   - `rotateItemBy(itemId, delta)` or reuse `rotateItem(id, (rotation + 10) % 360)` for the Rotate button (350 goes to 0).
   - `deleteItem(itemId): ChangeResult`: removes the item from `items`, checks the plan, sets it. Unknown id: no change.
   - Plan view, right panel and room JSON all read the same plan, so they cannot disagree.
3. **Rotation ring** – new `src/features/editor/RotationRing.tsx`, rendered by `PlanView` for the selected item only (inside the plan SVG, in plan units, not rotated with the item):
   - A ring around the item centre (radius = half the rotated footprint diagonal plus a margin, so it clears the item), a knob at the current angle, and a bubble on the ring showing "N deg".
   - Pointer events with pointer capture on the knob: on move, `angleFromPoint` via `toPlanPoint` then `rotateItem` with the snapped angle, applied live (each step is a valid plan or is skipped). While dragging, a refused step leaves the last valid angle and the bubble shows the item's real angle.
   - `touch-action: none` on the knob; the knob stays out of the item drag so dragging the knob never moves the item.
4. **Rotate button and Delete** – right panel in `EditorPage.tsx`: below the existing selected-item block add "Rotate 10" and "Delete" buttons and the hint "Drag the knob around the ring, or press Rotate 10." Show `Rotation N deg`, `Step: 10 deg` and a Facing label (for example "bottom wall" for 0) from the plan. The floating toolbar in the mock (Rotate 10 / Delete beside the ring) is the same two actions: one shared `SelectedToolbar` component is acceptable, rendered in the plan, if it is cheap; the panel buttons are the required minimum.
5. **Delete confirmation** – Chakra `AlertDialog`: "Delete <name>? [Delete] [Cancel]". Delete calls `deleteItem` and clears the selection (`selectItem(null)`); Cancel and Escape close it and change nothing. Focus moves to Cancel by default.
6. **Selection after changes** – if the selected item no longer exists the panel and ring show nothing selected (already the WI-036 behaviour).
7. **No resizing** – no size control is added anywhere; the panel keeps "(size is fixed)".
8. **Not changed**: adding items (REQ-359), moving (REQ-360), clearance (REQ-366), JSON upload/download (REQ-362/363).

## Areas and files likely affected (apps/web)
- New: `src/features/editor/RotationRing.tsx`, optionally `src/room/rotation.ts`
- Changed: `src/state/roomStore.ts` (`rotateItem`, `deleteItem`, `beforeRotateItem`), `src/features/editor/PlanView.tsx` (ring), `src/features/editor/EditorPage.tsx` (Rotate/Delete buttons, confirmation, angle), `src/features/editor/PlanItem.tsx` only if the ring needs a hook
- Tests: `tests/room/rotation.test.ts` (snap, angle from point, 350 to 0), `tests/state/roomStore.test.ts` (rotate applied, refused at the wall, wrap, delete, unknown id), `tests/features/rotateDelete.test.tsx` (knob drag with `toPlanPoint` mocked, Rotate button, panel angle matches JSON, delete confirm and cancel, no size control)

## Risks
- Rotating near a wall: the rotated bounding box grows (a 6.5 x 3.0 ft sofa at 90 degrees has half-height 3.25 ft), so an item snug against a wall will refuse some rotations. This is the required behaviour; the UI should make it clear the angle did not change (the bubble and panel keep the real angle).
- Angle convention: 0 = front faces the bottom wall, clockwise positive; getting the knob position and `angleFromPoint` offset wrong would make the knob and the item disagree. Cover with a test at 0, 90, 180 and 270.
- jsdom has no `getScreenCTM`, so drag tests must mock `toPlanPoint` (as in WI-034 and WI-036).
- A fast knob drag can skip angles; each pointer event is snapped and checked independently, so the item ends at the last valid angle for the pointer.
- Pointer capture on the knob must not start an item drag or change selection.

## Assumptions
- Rotation step 10 degrees with the mouse and the Rotate button; no resizing; Delete asks for confirmation (user decisions, 2026-11-16).
- A refused rotation does not move the item to make it fit; it keeps its last angle (acceptance criterion).
- Overlap and the 1.5 ft clearance are REQ-366 (through the guard hook), not handled here.
- Out of scope: undo after delete (Ctrl+Z) and typing an exact angle.
- No API or database change; the room stays in memory (no persistence yet).
