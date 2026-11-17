# TC-016 New room from width and length: validation, room JSON v1.0 and 2D plan to scale

Requirement: REQ-358 · Work item: WI-033 · Application: web (apps/web)

## Scope
Covers every acceptance criterion of REQ-358:
- AC1 Entering width and length and confirming shows a new, empty rectangular room in the 2D plan.
- AC2 The room drawn measures the entered width and length on the ruler and grid.
- AC3 A width or length below 6 ft, above 30 ft, or not a number shows the message, and no room is created.
- AC4 The room JSON has `schemaVersion` "1.0", `units` "ft", `origin` "top-left", the entered width and length, `height` 10, four matching walls, an empty `items` list, and passes the schema check.
- AC5 Once created, the editor offers no way to change the room size.

Out of scope: 3D view (REQ-364), Upload/Download JSON (REQ-362/363), furniture items (REQ-359 onward), saving to the API.

## Preconditions
- Web app running locally (apps/web), fresh page load (no room in memory).
- Automated tests run with the web app's test runner: `tests/room/roomPlan.test.ts`, `tests/room/checkRoomPlan.test.ts`, `tests/features/newRoom.test.tsx`, `tests/features/planView.test.tsx`.

## Test data
| Case | Width | Length | Expected |
|---|---|---|---|
| Typical | 12 | 10 | Valid |
| Lower bound | 6 | 6 | Valid |
| Upper bound | 30 | 30 | Valid |
| Quarter step | 12.25 | 9.75 | Valid |
| Below range | 5.75 | 10 | Width error |
| Above range | 12 | 30.25 | Length error |
| Empty | (empty) | 10 | Width error |
| Not a number | abc | 10 | Width error |
| Not a 0.25 step | 12.1 | 10 | Width step error |
| Exponent text | 1e1 | 10 | Rejected (raw string validated) |

## Scenarios

### S1 Create a typical room (AC1, AC4)
1. Open the New room screen.
2. Check the form shows Shape "Rectangle" (not editable), Width and Length in ft with hint "6 to 30 ft", "Walls 10 ft high (standard, fixed)" and the note "The room size cannot be changed later."
3. Enter Width 12, Length 10. Check the preview shows a 12 x 10 ft rectangle with (0,0) at the top-left.
4. Click Create room.

Expected: the 2D editor opens; header reads "Room 12 x 10 ft (fixed)"; the plan shows an empty rectangle; the right panel says nothing is selected; no items are drawn.

### S2 Room JSON content and schema check (AC4)
1. Call `createRoomPlan(12, 10)` (unit test) — or after S1, read `useRoomStore.getState().plan`.

Expected:
- `schemaVersion` = "1.0", `units` = "ft", `origin` = "top-left".
- `room.width` = 12, `room.length` = 10, `room.height` = 10.
- `room.walls` has exactly 4 walls (top, right, bottom, left), clockwise from (0,0): (0,0)->(12,0), (12,0)->(12,10), (12,10)->(0,10), (0,10)->(0,0).
- `items` = [].
- `checkRoomPlan(plan)` passes (Ajv schema check against `room-plan.schema.json` and rule 1).
- Repeat for 6 x 6, 30 x 30 and 12.25 x 9.75: same structure with matching values, all pass.

### S3 Schema check rejects a mismatched plan (AC4)
1. Take a valid 12 x 10 plan and change the right wall's x to 11.
2. Run `checkRoomPlan`.
3. Separately, remove `items` and change `schemaVersion` to "2.0"; run the check on each.

Expected: each modified plan fails the check; `createRoom` in the store does not set a plan that fails.

### S4 Invalid sizes show a message and create no room (AC3)
For each invalid row in the test data:
1. Open the New room screen and enter the values.
2. Click Create room.

Expected: a message shows under the faulty field (e.g. "Width must be between 6 and 30 ft."; for 12.1 a step message); the screen stays on New room; `useRoomStore.getState().plan` stays null; `validateRoomSize` returns a non-null message for the value.

### S5 Bounds are accepted (AC3)
1. Enter 6 x 6, create; reload; enter 30 x 30, create.

Expected: both create a room with no error message.

### S6 Plan is drawn to scale on ruler and grid (AC2)
1. Create a 12 x 10 room; inspect the plan SVG.
2. Repeat with 30 x 6 and 12.25 x 9.75.

Expected:
- The SVG works in feet (1 unit = 1 ft); the room rectangle / walls run from 0 to the entered width horizontally and 0 to the entered length vertically.
- The top ruler has ticks every 1 ft and labels every 2 ft, reaching the width (12 ft for the 12 x 10 room); the left ruler reaches the length (10 ft).
- Grid dots are every 2 ft inside the room.
- The aspect ratio is kept when the panel is resized (a 30 x 6 room is visibly 5 times wider than long).

### S7 Room size cannot be changed after creation (AC5)
1. Create a 12 x 10 room and open the editor.
2. Look for any input, control or menu that changes width or length (header, ROOM panel, VIEW panel, plan).
3. Check the store API.

Expected: the ROOM panel shows "Rectangle 12 x 10 ft (size is fixed)" as text only; no width/length input or resize handle exists; the room store exposes no action that changes the room size.

### S8 Editor without a room (supporting)
1. On a fresh load, go directly to `/editor`.

Expected: redirected to the New room screen.

## Pass criteria
All scenarios S1 to S8 pass, manually in the browser and through the automated tests listed above, with no console errors.
