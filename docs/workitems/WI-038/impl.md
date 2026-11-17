# WI-038 Warn when furniture is closer than 1.5 ft, refuse overlap

Applications: web (primary)
Requirement: REQ-366 · Decision: DEC-401 · Feature: FEAT-1147

## Approach
Browser only, on top of WI-036 (move) and WI-037 (rotate and delete). The room JSON stays the single source of truth; nothing is sent to the API. The rule is: **recommended gap 1.5 ft, no minimum, items may touch, only overlap is refused** (decision of 2026-11-17, which replaces the 0.5 ft minimum). Walls are not part of this rule.

1. **Geometry (pure TypeScript)** – new `src/room/clearance.ts`
   - `RECOMMENDED_GAP_FT = 1.5`, `TOUCH_TOLERANCE_FT = 0.01`.
   - `footprintPolygon(item)`: the four corners of the item outline after rotation (position is the centre, size is width x depth, rotation in degrees; same convention as `PlanItem` and `footprintBounds`).
   - `polygonGap(a, b)`: the shortest edge-to-edge distance between two convex polygons (0 when they touch or overlap) and an `overlaps` flag. Use a separating-axis test for overlap depth and segment-to-segment distance for the gap, so rotated items are measured on their real outlines, not their bounding boxes.
   - `classifyPair(a, b)` returns `{ kind: 'ok' | 'close' | 'overlap', gap }`: gap or overlap depth under 0.01 ft counts as touching (gap 0, kind `close`); overlap deeper than 0.01 ft is `overlap`; gap under 1.5 ft is `close`; otherwise `ok`.
   - `findClearanceIssues(plan, item)`: every other item with its `classifyPair` result; `formatGap(gap)` gives 2 decimals ("1.00 ft", "0.00 ft"). The number shown must equal the measured gap rounded to 2 decimals.
2. **Store** – `src/state/roomStore.ts`
   - Today `beforeAddItem`, `beforeMoveItem` and `beforeRotateItem` only return a boolean (stop or go). Clearance needs a third outcome (ask the user), so add a small clearance step shared by add, move and rotate instead of abusing the boolean guards:
     - an overlap issue refuses the change (`{ ok: false, errors: ['Items cannot overlap.'] }`) and the plan is untouched;
     - a close issue returns a pending result carrying the candidate plan, the nearest item name and the gap, without changing the plan;
     - `confirmPending()` sets the plan (this is "Place here"); `cancelPending()` drops it (item stays where it was, or is not added).
   - Keep the existing boolean guard lists working; register the overlap check there if it is simpler, and leave the confirm flow to the new pending state.
   - After Place here, remember the placed pair(s) in a transient `acknowledgedPairs` set (not saved in the room JSON) so no red line is drawn for that pair until the item is dragged or rotated again; clear the entries for an item when it is next dragged or rotated.
   - Upload / open from file does not run this rule, so a file opens exactly as saved with no lines and no popup (overlap in files is rejected by REQ-363 in the schema checks).
3. **Red lines while dragging or rotating** – `PlanView.tsx` and a new `src/features/editor/ClearanceLines.tsx`
   - While a drag (`useDragState`) or a rotation (WI-037 ring) is in progress, compute `findClearanceIssues` for the live position and draw, for each item under 1.5 ft away, a red line along the shortest segment between the two outlines with a label of the gap in feet. When touching, draw a red marker and "0.00 ft". For overlap, tint the overlapping items red.
   - After a drop that opens the confirm popup the line stays until the user answers; after Place here it disappears; after Cancel the item returns and the line goes with it.
   - Lines are in plan units inside the plan SVG, `pointer-events: none`, so they never block dragging.
4. **Confirm popup and overlap message** – `EditorPage.tsx` (Chakra `AlertDialog`)
   - Close: "This is 1.00 ft from the Bed. We recommend at least 1.5 ft. Place it here?" with **Place here** and **Cancel**; touching reads "This is touching the Table. ..." and shows 0.00 ft. If several items are close, show the nearest one. Focus starts on Cancel; Escape means Cancel.
   - Overlap: no popup choice, a message "Items cannot overlap." with OK (or a toast), the overlap marked in red, the item back at its previous place, room JSON unchanged.
5. **Right panel** – the selected-item block shows "Gap to <item>: N.NN ft" (red under 1.5 ft), "Recommended 1.5 ft", "Minimum none (touching is allowed, overlap is not)", as in the mock.
6. **Wiring to existing actions** – the same clearance step runs after catalog add (REQ-359), move drop (REQ-360) and rotate (REQ-361). A rotate that is already refused by walls stays refused first; clearance is checked on the walls-valid plan. For rotation by the ring, apply the live steps only for the red-line preview and run the confirm/overlap check on pointer release (a fast drag must not open a popup at every 10 degrees).
7. **Not changed**: wall gaps, catalog, JSON upload/download rules (REQ-362/363), the room JSON schema (no new field; acknowledgements are not saved).

## Areas and files likely affected (apps/web)
- New: `src/room/clearance.ts`, `src/features/editor/ClearanceLines.tsx`
- Changed: `src/state/roomStore.ts` (clearance step, pending change, acknowledged pairs), `src/features/editor/PlanView.tsx`, `src/features/editor/PlanItem.tsx` (overlap tint, optional), `src/features/editor/EditorPage.tsx` (popup, message, panel), `src/features/editor/dragState.ts` (expose live item for lines), `src/features/editor/RotationRing.tsx` (commit on release)
- Tests: `tests/room/clearance.test.ts` (gap for axis-aligned and rotated items, 1.5 boundary, touching, 0.01 tolerance, overlap, 2-decimal label), `tests/state/roomStore.test.ts` (far item placed directly, close item pending then Place here / Cancel, overlap refused with message, plan unchanged, add/move/rotate all covered, upload shows nothing), `tests/features/clearance.test.tsx` (red line and label during drag, popup text for close and touching, no line after Place here and its return after a new drag, overlap message, `toPlanPoint` mocked)

## Risks
- Shortest distance between rotated rectangles is easy to get wrong with bounding boxes; test at 0, 45 and 90 degrees against hand-computed values, and keep the number shown identical to the one tested.
- Touching tolerance: a flush placement on the 0.25 ft snap grid can produce tiny floating-point overlaps; the 0.01 ft tolerance must be applied in one place (`classifyPair`).
- Boolean guard lists cannot express "ask the user", so a pending-change state is added; keep it small and make sure cancel and unmount clear it so a stale candidate plan is never applied.
- Rotation near other items: the popup must open once on release, not on every 10 degree step.
- After "Place here" the pair must stay quiet but come back on the next drag or rotate; the acknowledged set must be cleared per item and never leak into the saved JSON.
- jsdom has no `getScreenCTM`; drag tests mock `toPlanPoint` as in WI-034, WI-036 and WI-037.

## Assumptions
- Recommended gap 1.5 ft, no minimum gap, touching allowed, only overlap is refused (user decisions of 2026-11-16 and 2026-11-17).
- Gap = shortest edge-to-edge distance between the rotated outlines, 2 decimals; under 0.01 ft counts as touching.
- With several close items the popup names the nearest; red lines are drawn for all of them.
- Cancel after an add removes the new item; Cancel after a move or rotate restores the previous position and angle.
- Items may stand against walls; wall gaps are not checked.
- Out of scope: undo, persistence (the room stays in memory), API or database changes.
