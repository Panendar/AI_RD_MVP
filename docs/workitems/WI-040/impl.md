# WI-040 Download JSON: save the design as room_type.json, block empty room

Applications: web (primary)
Requirement: REQ-362 · Decision: DEC-397 · Feature: FEAT-1143

## Approach
Browser only. The room JSON in the store is the single source of truth; nothing is sent to the API (no accounts, no cloud storage). The existing placeholder "Download JSON" button in the editor header is enabled and wired to a download action.

1. **Export helper (pure TypeScript)** – new `src/room/exportRoomPlan.ts`
   - `DOWNLOAD_FILE_NAME = 'room_type.json'` (fixed; the user cannot name the design).
   - `prepareDownload(plan)` returns `{ ok: true, json: string }` or `{ ok: false, reason: 'empty' | 'invalid', errors: string[] }`:
     - `plan.items.length === 0` gives `reason: 'empty'`;
     - otherwise run `checkRoomPlan(plan)` (the same schema check and business rules used when a file is opened); failures give `reason: 'invalid'` with the errors;
     - otherwise `json = JSON.stringify(plan, null, 2)`, holding `schemaVersion`, `units`, `origin`, `room` (width, length, height, walls) and every item (`id`, `catalogId`, `name`, `position`, `size`, `rotation`, `colour`) exactly as in `room-plan-schema.md` (v1.0). No new field.
2. **Browser save** – `src/room/downloadFile.ts`
   - `saveTextFile(name, text)`: create a `Blob` (`application/json`), an object URL and a temporary `<a download>` link, click it, then remove it and revoke the URL.
3. **Editor wiring** – `src/features/editor/EditorPage.tsx`
   - Remove `isDisabled` and the "Coming soon" title from Download JSON; on click call `prepareDownload` with the current plan.
   - `ok`: call `saveTextFile('room_type.json', json)`.
   - `empty`: save nothing and open a Chakra `AlertDialog` (same style as the clearance popup) with the message "Add objects and plan your room before downloading." and one **OK** button; OK and Escape close it and the user stays on the design.
   - `invalid`: save nothing and show the errors in a toast or the same dialog (defensive; the editor rules should make this unreachable).
4. **Not changed**: Upload JSON (REQ-363), the 3D tab (REQ-364), the room JSON schema, the API.

## Areas and files likely affected (apps/web)
- New: `src/room/exportRoomPlan.ts`, `src/room/downloadFile.ts`
- Changed: `src/features/editor/EditorPage.tsx`
- Tests: `tests/room/exportRoomPlan.test.ts` (empty plan refused with `empty`, plan with items returns JSON that parses back to the same plan, file name constant, output passes `checkRoomPlan`, invalid plan refused), `tests/features/downloadJson.test.tsx` (button enabled; click with items calls the save helper once with `room_type.json` and valid JSON; click on an empty room shows the pop-up text, saves nothing, OK closes it)

## Risks
- `URL.createObjectURL` and anchor clicks do not exist in jsdom: mock `saveTextFile` (or stub `URL.createObjectURL`) in the UI tests.
- The browser may add a counter to the name (`room_type (1).json`) on repeated downloads; that is browser behaviour and accepted.

## Assumptions
- "room_type.json" is the literal, fixed file name (no room-type field exists in the schema).
- Empty means zero items; a room with at least one item can always be downloaded when it passes the checks.
- The pop-up wording is "Add objects and plan your room before downloading."
