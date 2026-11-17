# WI-034 Furniture catalog with search and drag-and-drop add to the 2D plan

Applications: web (primary)
Requirement: REQ-359 · Decision: DEC-394 · Feature: FEAT-1140

## Approach
Everything runs in the browser, on top of WI-033 (room model, `useRoomStore`, `checkRoomPlan`, `PlanView`). The room JSON stays the single source of truth: an item is added only by an action on the store that builds the new plan, checks it, and keeps it only if it passes. Nothing is sent to the API.

1. **Catalog (pure TypeScript)** – `src/room/catalog.ts`
   - `CATALOG`: the six entries of room-plan-schema.md, in that order: `bed` Bed (queen) 5.0 x 6.5 x 1.5, `sofa` Sofa (3 seat) 6.5 x 3.0 x 2.75, `table` Table (4 seat) 4.0 x 2.5 x 2.5, `chair` Chair 1.5 x 1.5 x 3.0, `tv` TV (on stand) 4.0 x 1.0 x 3.0, `locker` Locker (steel almirah) 3.0 x 1.75 x 6.5.
   - `searchCatalog(query)`: case-insensitive match on the name, trimmed; empty query returns all six.
   - `formatSize(entry)`: "6.5 x 3.0 x 2.75 ft" for the list.
2. **Placement (pure TypeScript)** – `src/room/placement.ts`
   - `snap(v)`: round to 0.25 ft.
   - `placeInRoom(room, size, dropPoint)`: for rotation 0 the footprint is width (x) by depth (y). Snap the drop point, then clamp the centre so the footprint stays inside the walls ("stops at the wall"): `x` within `[ceil4(width/2), floor4(room.width - width/2)]`, same for `y` with depth, where `ceil4`/`floor4` round to 0.25 inward so the position stays a multiple of 0.25 (needed for e.g. the locker's 1.75 ft depth). Returns `null` when the drop point is outside the room, or when the item cannot fit in the room at all (see Assumptions).
   - `isInsideRoom(room, point)`: drop point test, 0 ≤ x ≤ width and 0 ≤ y ≤ length.
   - `nextItemId(items)`: `item-<n>` with n one more than the highest existing number.
3. **Business rules 2 to 4** appended to `rules` in `src/room/checkRoomPlan.ts`:
   - Rule 2 `uniqueItemIds`.
   - Rule 3 `itemsInsideWalls`: footprint after rotation lies inside the walls (rotation-aware bounding box from the four corners, so it already serves REQ-360/361).
   - Rule 4 `sizeMatchesCatalog`.
   - Rule 5 (no overlap; gaps under 1.5 ft, touching included, need a confirm) belongs to REQ-366 and is not added here.
4. **Store** – `useRoomStore` gains `addItem(catalogId, dropPoint): { ok: boolean; errors: string[] }`. It looks up the catalog entry, calls `placeInRoom`, builds the item `{ id, catalogId, name, position, size, rotation: 0, colour: "#FFFFFF" }`, appends it to a copy of the plan, runs `checkRoomPlan` and sets the plan only if it passes. Dropped outside or not fitting: no change. The store keeps a hook point (`beforeAdd`) where REQ-366 will insert the clearance confirm/refuse step.
5. **Catalog panel** – `src/features/editor/CatalogPanel.tsx`, replacing the ROOM/VIEW text in the left aside (that text moves below the catalog, unchanged):
   - Heading "CATALOG (all white)", a search input (`aria-label="Search catalog"`), and the list: name plus "W x D x H ft" for each matching entry, and "<n> of 6 items match" while a query is typed.
   - No match: the list is replaced by "no match"; the plan is not touched.
   - Each row is `draggable`; `onDragStart` puts the `catalogId` in `dataTransfer` (type `application/x-knm-catalog`). The hint "Drag an item onto the room. No Add button." is shown. There is no Add button anywhere.
6. **Drag and drop on the plan** – `PlanView`:
   - Converts the pointer to plan feet with the SVG `getScreenCTM().inverse()` (a small `toPlanPoint(svg, clientX, clientY)` helper, mockable in tests).
   - `onDragOver`: `preventDefault` when a catalog item is being dragged; draws a white outline at real size (dashed stroke) at the snapped, wall-clamped position that the drop would produce. Outside the room no outline is shown.
   - `onDrop`: calls `addItem(catalogId, point)`; `onDragLeave`/`onDragEnd` clear the outline.
   - Because HTML5 `dataTransfer.getData` is not readable during `dragover`, the dragged `catalogId` is also kept in a small piece of editor UI state (`draggingCatalogId`) set on drag start.
7. **Drawing items** – `PlanView` takes `items` and draws each as a white rectangle of its footprint at real size (`fill="#FFFFFF"`, thin dark stroke), centred on `position`, with `transform="rotate(rotation, x, y)"` ready for REQ-361, and the item name as centred text inside (font scaled down for small items such as the chair so the text stays inside). No top-view symbols (user decision, 2026-11-17). Items have `data-testid="plan-item"` and `data-item-id`. The aria-label of the SVG no longer says "empty room" once items exist.

## Areas and files likely affected (apps/web)
- New: `src/room/catalog.ts`, `src/room/placement.ts`
- New: `src/features/editor/CatalogPanel.tsx`, `src/features/editor/PlanItem.tsx`, `src/features/editor/dragState.ts` (tiny Zustand store via `createAppStore` for `draggingCatalogId`)
- Changed: `src/room/checkRoomPlan.ts` (rules 2–4), `src/state/roomStore.ts` (`addItem`), `src/features/editor/PlanView.tsx` (items, drop target, drag outline), `src/features/editor/EditorPage.tsx` (left panel uses CatalogPanel, PlanView gets items)
- Tests: `tests/room/catalog.test.ts`, `tests/room/placement.test.ts`, `tests/room/checkRoomPlan.test.ts` (extended), `tests/state/roomStore.test.ts`, `tests/features/catalogPanel.test.tsx`, `tests/features/planView.test.tsx` (extended)

## Tests (map to acceptance)
- Catalog lists exactly six entries with the sizes above, each row showing "W x D x H ft".
- Search "so" shows only Sofa; "LOCK" shows Locker; "xyz" shows "no match" and `plan.items` is unchanged.
- `addItem('sofa', {x: 6.1, y: 4.6})` in a 12 x 10 room adds one item at (6.0, 4.5), size 6.5 x 3.0 x 2.75, rotation 0, colour "#FFFFFF"; the plan passes `checkRoomPlan`.
- Drop near a wall: `addItem('sofa', {x: 0.5, y: 0.2})` clamps to (3.25, 1.5), footprint touching the top-left walls; locker near the top wall gets y = 1.0 (multiple of 0.25, inside).
- Drop outside the room (`x < 0` or `y > length`): no item added.
- Rendered plan: the item rectangle's width/height in the SVG equal the catalog width/depth (so it measures its size on the ruler), fill is white, and its name text is present.
- No element with an "Add" button role exists in the editor.
- Rules: duplicate ids fail rule 2; an item crossing a wall fails rule 3; a sofa with width 6 fails rule 4.
- Drag-and-drop through the UI with `fireEvent.dragStart` / `dragOver` / `drop` and a mocked `toPlanPoint`.

## Risks
- HTML5 drag and drop does not work on touch devices; the MVP is desktop-first. Pointer-event based dragging can replace it later without changing the store.
- jsdom has no `getScreenCTM`; the pointer-to-feet conversion is isolated in one helper so tests can mock it.
- Text sizing in SVG for small items (chair 1.5 x 1.5 ft with "Chair"; locker 3.0 x 1.75 ft with a long name) needs a font scaled to the footprint, or a short wrap; check visually.
- Rule 3 is written rotation-aware now; REQ-361 must not reimplement it.
- Snapping plus clamping to 0.25 can move an item by up to 0.125 ft away from a wall for odd half-sizes (e.g. locker depth 1.75 → y min 1.0, so 0.125 ft gap). This keeps positions schema-valid (multipleOf 0.25).

## Assumptions
- Web only; no API change (the room is in memory, as in WI-033).
- REQ-366 clearance (red line while dragging, confirm on a gap under 1.5 ft including touching, refuse on overlap) is its own work item; this item leaves the `beforeAdd` hook for it and does not block close drops.
- If an item cannot fit in the room at rotation 0 (only the bed, 6.5 ft deep, in a room whose length is under 6.5 ft), the drop adds nothing, like a drop outside the room, and the drag outline is not shown. No message is shown (REQ-359 does not ask for one); a message can be added by its own requirement.
- New items always face 0° (front toward the bottom wall); rotation is REQ-361.
- Selecting, moving and deleting items are REQ-360/361; the right "Selected item" panel stays as it is.
