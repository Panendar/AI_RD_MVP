# WI-042 Upload JSON: open a design from a file, check it, confirm replace, keep editing

Applications: web (primary)
Requirement: REQ-363 - Decision: DEC-398 - Feature: FEAT-1144

## Approach
Browser only. The room JSON in the store is the single source of truth; nothing is sent to the API. The placeholder "Upload JSON" button in the editor header is enabled and wired to a hidden file input.

1. **Open helper (pure TypeScript)** - new `src/room/openRoomPlan.ts`
   - `MAX_UPLOAD_BYTES = 1_048_576` (1 MB) and `INVALID_FILE_MESSAGE = 'This file is not a valid room design.'`.
   - `openRoomPlan(file: { size: number; text(): Promise<string> })` returns `{ ok: true, plan }` or `{ ok: false }`:
     - `size > MAX_UPLOAD_BYTES` fails before the file is read;
     - `JSON.parse` failure fails;
     - `checkRoomPlan(parsed)` (schema, walls match room, unique ids, items inside walls, catalog sizes) failure fails;
     - overlap check: for every pair of items `measurePair(a, b).kind === 'overlap'` fails (from `src/room/clearance.ts`; touching, i.e. a gap under `TOUCH_TOLERANCE_FT` = 0.01 ft, is allowed);
     - otherwise returns the parsed plan.
   - Only a boolean outcome is exposed to the UI: the message never names the failing field or rule (user answer). Errors may be kept for tests only.
   - Close items (under 1.5 ft) and touching items are valid and raise **no** clearance warning on open (user decisions 2026-11-16 and 2026-11-17).
2. **Store action** - `src/state/roomStore.ts`
   - `loadPlan(plan: RoomPlan)`: sets `plan` and clears `gesture`, `pending` and `notice`. It does not run the add/move guards, so nothing triggers the clearance popup.
3. **Editor wiring** - `src/features/editor/EditorPage.tsx`
   - Remove `isDisabled` and the "Coming soon" title from Upload JSON; the button clicks a hidden `<input type="file" accept=".json,application/json">`.
   - On file chosen: call `openRoomPlan`; reset the input value so the same file can be chosen again.
   - Not ok (bad JSON, schema, rule, overlap or over 1 MB): save nothing, show a Chakra `AlertDialog` with "This file is not a valid room design." and one **OK** button. The current design is untouched.
   - Ok and no design is open (`plan` is null or has no items): call `loadPlan` directly.
   - Ok and a design is open: show an `AlertDialog` "Replace the current design with <file name>? The current design will be lost." with **Cancel** and **Replace**. Replace calls `loadPlan`; Cancel and Escape close it. The confirmation appears only after the file passed all checks.
   - The room size comes from the file (fixed as in the file); the plan view already renders from `plan.room`.
4. **Round trip**: after opening, move, rotate, delete and add from the catalog use the existing store actions unchanged; Download JSON (REQ-362) then returns the same design.
5. **Not changed**: the 3D tab (REQ-364), the room JSON schema, the API, the download code.

## Areas and files likely affected (apps/web)
- New: `src/room/openRoomPlan.ts`
- Changed: `src/state/roomStore.ts` (`loadPlan`), `src/features/editor/EditorPage.tsx`
- Tests: `tests/room/openRoomPlan.test.ts` (a file made by `prepareDownload` opens to the same plan; over 1 MB rejected without reading; bad JSON, schema error, each business rule and an overlap rejected; touching and under-1.5-ft items accepted), `tests/features/uploadJson.test.tsx` (button enabled; valid file loads and shows the items; invalid file shows the general message and keeps the current design; with a design open Replace loads and Cancel keeps; no clearance popup or red lines after opening a file with close items; move, rotate, delete and add work on the opened design; download after upload gives the same design)

## Risks
- `checkRoomPlan` has no overlap rule yet ("Rule 5 is added by REQ-366" is only a comment), so the overlap check is done in `openRoomPlan` with `measurePair`. Adding it to `rules` instead would also affect download; keep it local unless that is wanted.
- `File.text()` and the file input need care in jsdom: use `userEvent.upload` and a `File` with a stubbed `size` for the 1 MB case.
- Two dialogs (replace and invalid) must not stack; only one is open at a time by construction.

## Assumptions
- 1 MB means 1,048,576 bytes.
- "A design is already open" means the store has a plan with at least one item; an empty room is replaced without asking.
- The file name shown in the Replace dialog is the chosen file's name.
- Wording: "This file is not a valid room design." and "Replace the current design with <file name>? The current design will be lost."
