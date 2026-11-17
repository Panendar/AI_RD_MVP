# WI-033 New room form, room JSON v1.0 and empty 2D plan

Applications: web (primary)
Requirement: REQ-358 · Decision: DEC-393 · Feature: FEAT-1139

## Approach
Everything in this story runs in the browser. The room JSON (schema v1.0, docs/project/room-plan-schema.md) is the single source of the design: it is held in a Zustand store, and the 2D plan is drawn from it. Nothing is sent to the API in this story.

1. **Room model (pure TypeScript, no React)**
   - Types for the room plan (`RoomPlan`, `Room`, `Wall`, `Point`, `Item`) matching schema v1.0.
   - `createRoomPlan(width, length)`: returns `{ schemaVersion: "1.0", units: "ft", origin: "top-left", room: { width, length, height: 10, walls: [top, right, bottom, left] }, items: [] }`, walls running clockwise from (0,0) as in the schema example.
   - `validateRoomSize(value)`: returns an error message or null. Rejects empty, not a number, below 6, above 30, or not a multiple of 0.25 (message e.g. "Width must be between 6 and 30 ft.", and a step message for a non-0.25 value).
   - `checkRoomPlan(plan)`: schema check plus business rule 1 (walls match width and length). Rules 2 to 5 concern items and are added by REQ-359 onward; the function is built so they can be appended.
   - The JSON Schema from room-plan-schema.md is kept as a file in the web app (`room-plan.schema.json`) and checked with Ajv (draft 2020-12, `ajv/dist/2020`). Ajv's `multipleOf` uses floating point; 0.25 steps are exact in binary, so this is safe.
2. **Store**: `useRoomStore` built with `createAppStore` (`src/state/createStore.ts`), holding `plan: RoomPlan | null` and `createRoom(width, length)`, which builds the plan, checks it and sets it only if it passes. There is no action that changes the room size. No persistence in this story (upload/download is REQ-362/363).
3. **New room screen** (route `/` or `/new`): Chakra form with Shape "Rectangle" (read-only text), Width and Length number inputs in ft (step 0.25, hint "6 to 30 ft"), "Walls 10 ft high (standard, fixed)", the note "The room size cannot be changed later.", and Create room. Field errors show under the field (`FormErrorMessage`); Create room does nothing while either field is invalid. A live top-view preview (small SVG) follows the typed values while they are valid.
4. **2D editor screen** (route `/editor`): header "Room W x L ft (fixed)" with the 2D plan tab active (3D tab, Upload/Download JSON appear as placeholders or are left for their own stories), left panel ROOM / VIEW info (units feet, grid 1 dot = 2 ft, moves snap 0.25 ft), centre SVG plan, right "Selected item" panel with the empty-state text. Opening `/editor` with no room redirects to the New room screen.
5. **2D plan (SVG)**: drawn from `plan.room` only. Uses a viewBox in feet (1 unit = 1 ft) so the room is to scale, with a ruler along the top and left (ticks every 1 ft, labels every 2 ft) and grid dots every 2 ft; the four walls are drawn from `room.walls`. The SVG scales to fit the panel while keeping the aspect ratio.
6. Register the two routes in the scaffold glue `src/app/router.tsx` at the `knm:entries` markers (the glue file says modules register there).

## Areas and files likely affected (apps/web)
- New: `src/room/roomPlan.ts` (types, createRoomPlan, validateRoomSize), `src/room/checkRoomPlan.ts`, `src/room/room-plan.schema.json`
- New: `src/state/roomStore.ts`
- New: `src/features/new-room/NewRoomPage.tsx`, `src/features/new-room/RoomPreview.tsx`
- New: `src/features/editor/EditorPage.tsx`, `src/features/editor/PlanView.tsx` (SVG plan, ruler, grid)
- Changed: `src/app/router.tsx` (two route entries), `package.json` (add `ajv`)
- Tests: `tests/room/roomPlan.test.ts`, `tests/room/checkRoomPlan.test.ts`, `tests/features/newRoom.test.tsx`, `tests/features/planView.test.tsx`

## Tests (map to acceptance)
- Valid 12 x 10 creates a plan equal to the schema example's room with empty items, and it passes `checkRoomPlan`.
- 5.75, 30.25, "", "abc" and 12.1 each show a message and no plan is created.
- Walls of the created plan match width and length; a plan with a mismatched wall fails rule 1.
- The plan SVG viewBox and wall coordinates equal the entered width and length; ruler labels reach the width and length.
- The editor renders no input or control that changes width or length.

## Risks
- The `router.tsx` glue is scaffold-owned; route entries must be added only at the markers so later module injection and the cohesion checks keep working.
- Ajv adds bundle size (around 100 KB unminified); acceptable for the MVP. Floating point on `multipleOf` is safe for 0.25 steps, but a value like 12.1 must be rejected by the form before it reaches the schema check, with a clear message.
- Number inputs in some browsers accept "e" and partial values; validation must work on the raw string, not only on the parsed number.
- Later stories (REQ-359 to REQ-366) build on these types, the store and the PlanView; naming them carefully now avoids churn.

## Assumptions
- No API work: the room is not saved to the server in this story (the requirement and features.md only use the room JSON in the editor, with Download/Upload JSON in REQ-362/363). If saving to the API is wanted, it is a separate requirement.
- The room lives only in memory for now; reloading the page returns to the New room screen.
- Ajv is used for the schema check (the schema is standard JSON Schema 2020-12); a hand-written validator would also meet the acceptance if a dependency is unwanted.
- SVG is used for the 2D plan (no canvas or drawing library needed for this story).
- The 3D tab and Upload/Download JSON buttons in the mock header are placeholders here; their behaviour belongs to REQ-362, REQ-363 and REQ-364.
