# WI-036 Select and move furniture in the 2D plan, kept inside the walls

Applications: web (primary)
Requirement: REQ-360 · Decision: DEC-395 · Feature: FEAT-1141

## Approach
Browser only, on top of WI-033/WI-034 (`useRoomStore`, `checkRoomPlan`, `PlanView`, `PlanItem`, `placement.ts`). The room JSON stays the single source of truth: a move is a store action that builds a new plan, checks it, and keeps it only if it passes. Nothing is sent to the API.

1. **Placement (pure TypeScript)** – `src/room/placement.ts`
   - Add `clampCentre(room, item, point)`: snaps the point to 0.25 ft, then clamps the centre so the rotation-aware footprint (`footprintBounds`) stays inside the walls ("stops at the wall"). The clamp range is rounded inward to the 0.25 ft grid (`ceilSnap`/`floorSnap`), so the position is always a multiple of 0.25 ft, also for sizes such as the locker's 1.75 ft depth. Returns `null` only when the item cannot fit in the room at all.
   - Reuse `snap` and `footprintBounds`; `placeInRoom` (rotation 0 only) stays as is for adding.
2. **Selection state** – `src/features/editor/dragState.ts` (or a sibling `selectionState.ts`): small `createAppStore` store with `selectedItemId: string | null` and `selectItem(id)`. Editor UI state only, not part of the room JSON. If the selected item no longer exists in the plan, nothing is shown as selected. No deselect gesture, no multi-select, no arrow keys (out of scope per REQ-360).
3. **Store** – `useRoomStore` gains `moveItem(itemId, centre): ChangeResult`. It finds the item, calls `clampCentre`, builds a copy of the plan with the new `position`, runs `checkRoomPlan` (rule `itemsInsideWalls` already covers it) and sets the plan only if it passes. Unknown id or no fit: no change. A `beforeMoveItem` guard list (like `beforeAddItem`) is the hook where REQ-366 will add the clearance confirm/refuse step. Updating the plan updates the plan view, the right panel and the room JSON in the same store update, so they cannot disagree.
4. **Selecting** – `PlanItem` / `PlanView`:
   - `PlanItem` takes `selected` and `onPointerDown`. Selected item: highlighted outline (blue stroke, thicker), `data-selected="true"`; others unchanged. Items get `cursor: grab`.
   - Pointer down on an item selects it (and starts a drag, see 5). The drop outline of REQ-359 keeps `pointerEvents="none"`.
5. **Dragging** – `PlanView`:
   - Pointer events with pointer capture on the SVG: on pointer down on an item, remember the offset between the pointer (via `toPlanPoint`) and the item's centre, so the item does not jump to the cursor. On pointer move, call `moveItem(id, pointer - offset)`; the store snaps and clamps, so the item moves in 0.25 ft steps and stops touching the wall when the pointer goes past it. Pointer up / cancel ends the drag.
   - Only the selected-by-click item moves: pointer down selects and drags in one gesture; a click without movement just selects (no store write when the position is unchanged).
   - Moves are applied live while dragging (each step is a valid plan), so the plan and the JSON match straight away; no extra commit step.
   - Keep the item order and ids unchanged; only `position` changes (`rotation`, `size` untouched).
6. **Right panel** – `EditorPage.tsx`: replace the "(nothing selected)" placeholder with the selected item's name, size (W x D x H ft), centre (X, Y, shown to 2 decimals, e.g. 5.25) and rotation (read-only here; changing it belongs to REQ-361), plus the hint "Drag to move. Moves snap to 0.25 ft." When nothing is selected the existing placeholder text stays.
7. **Not changed**: adding items (REQ-359), rotation (REQ-361), clearance (REQ-366), JSON upload/download (REQ-362/363).

## Areas and files likely affected (apps/web)
- Changed: `src/room/placement.ts` (`clampCentre`), `src/state/roomStore.ts` (`moveItem`, `beforeMoveItem`), `src/features/editor/PlanItem.tsx` (selected style, pointer handler), `src/features/editor/PlanView.tsx` (drag handling), `src/features/editor/EditorPage.tsx` (selected panel), `src/features/editor/dragState.ts` or new `selectionState.ts`
- Tests: `tests/room/placement.test.ts` (extended), `tests/state/roomStore.test.ts` (moveItem), `tests/features/planView.test.tsx` (select, drag, stop at wall; `toPlanPoint` mocked), `tests/features/editorPage.test.tsx` (panel values match the room JSON)

## Risks
- jsdom has no `getScreenCTM`, so drag tests must mock `toPlanPoint` (as in WI-034).
- Rotated items: the clamp must use the rotated bounding box; for non-90 degree rotations the box is larger than the shape, so items may stop slightly before the wall visually. Accepted: it matches rule `itemsInsideWalls`.
- A fast drag can jump the pointer past a wall in one event; clamping per event handles it, the item ends at the wall.
- Touch and pen use the same pointer events; browser scrolling during a touch drag may need `touch-action: none` on the SVG.

## Assumptions
- The move step is 0.25 ft and the item stops at the wall (user decisions, 2026-11-16). Position is the centre in ft from the top-left corner.
- Overlap between items is not blocked here; REQ-366 adds the clearance rule through the guard hook.
- Selection is cleared only by selecting another item (no deselect gesture is required). Selection is not saved in the room JSON.
- No API or database change; the room stays in memory (no persistence yet).
