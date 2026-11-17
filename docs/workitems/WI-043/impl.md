# WI-043 3D view tab: white room and item shapes with orbit, zoom, pan and reset

Applications: web (primary)
Requirement: REQ-364 - Decision: DEC-399 - Feature: FEAT-1145

## Approach
Browser only. The room JSON in the store is the single source of truth; the 3D tab only reads it. The disabled "3D view" tab button in the editor header is enabled and switches the main area between the 2D plan and the 3D view. The API is not touched.

1. **Library** - add `three` (and `@types/three`) to `apps/web`. Orbit, zoom and pan use three's `OrbitControls` (left-drag orbit, wheel zoom, right-drag pan; no other bindings, touch left at defaults).
2. **Pure scene builder** - new `src/room3d/buildScene.ts`
   - `buildRoomScene(plan)` returns a `THREE.Group` with no rendering side effects, so it can be tested without WebGL.
   - Coordinate mapping from the plan (x right, y down the plan, z up): scene `X = x`, scene `Z = y`, scene `Y = z` (up). Plan origin (top-left) is scene (0,0,0), so 2D and 3D agree.
   - Floor: a white plane of `room.width x room.length`.
   - Four walls from `room.walls`, each `room.height` (10 ft) high, thin boxes placed on the room edge.
   - Each item: a shape from `src/room3d/shapes.ts`, placed at `position` (centre of footprint), rotated about the vertical axis by `rotation` so that 0 deg faces +y (the bottom wall) and angles run clockwise as seen in the plan (scene Y rotation = `-rotation` in radians; verify with a test on a known item).
3. **Item shapes** - new `src/room3d/shapes.ts`, one builder per `catalogId` (`bed`, `sofa`, `table`, `chair`, `tv`, `locker`). Each builds from a few boxes/cylinders and is scaled to fit exactly inside the item's `size` (width x depth x height), so footprint and height match the catalog:
   - bed: low base, mattress, headboard at the back, pillows;
   - sofa: seat, back and two arms;
   - table: top and four legs;
   - chair: seat, back and four legs;
   - tv: stand/base, thin screen panel facing front;
   - locker: tall body with a door line and handle.
   Front side per the schema: bed foot end, sofa/chair seat side, TV screen, locker door (all face +y at rotation 0). No name labels. Unknown `catalogId` falls back to a plain box of the item's size.
4. **White, shaded, outlined** - all materials `MeshStandardMaterial` colour `#FFFFFF`, with a directional light plus ambient light for shading, and `EdgesGeometry` line outlines (thin dark grey) on every mesh, so white items read against the white floor and walls. Colour is never read from `item.colour`.
5. **View component** - new `src/features/editor/ThreeDView.tsx`
   - Creates a `WebGLRenderer`, scene, `PerspectiveCamera` and `OrbitControls` in an effect; disposes everything on unmount.
   - Rebuilds the scene from `plan` when it changes.
   - **Start view** (`src/room3d/startView.ts`, pure): camera above the bottom-left corner (scene x about 0, z about `length`), looking at the room centre (the top-right direction), about 45 deg down, at a distance computed from the room width/length/height and the camera fov so the whole room and every item fit. Same function is used for first open and Reset view.
   - The component is mounted only while the 3D tab is active, so every open starts from the start view even after an earlier visit moved the camera (camera state is never stored).
   - **Reset view** button in the 3D panel puts the camera and controls target back to the start view.
   - Hint line "drag = orbit, scroll = zoom, right-drag = pan" and the side note as in the mock.
   - If WebGL is not available, show a short message instead of crashing (also what jsdom tests see; the scene builder is tested separately).
6. **Editor wiring** - `src/features/editor/EditorPage.tsx`
   - Active tab kept in local state (`'2d' | '3d'`); tabs get `aria-selected` from it; remove `isDisabled` and the "Coming soon" title from the 3D tab and remove the placeholder comment.
   - 2D tab: the existing plan view and catalog panel unchanged. 3D tab: `ThreeDView`. Switching back to 2D shows the plan unchanged because the plan state is in the store and untouched by the 3D view (the 3D view never writes to the store).
   - Upload and Download JSON stay available in both tabs.
7. **Not changed**: the room JSON schema, the store actions, the API, the 2D plan code.

## Areas and files likely affected (apps/web)
- New: `src/room3d/buildScene.ts`, `src/room3d/shapes.ts`, `src/room3d/startView.ts`, `src/features/editor/ThreeDView.tsx`
- Changed: `src/features/editor/EditorPage.tsx`, `package.json` and lock file (three, @types/three), possibly `jest.config` (transform/ESM handling of `three` and `OrbitControls`)
- Tests:
  - `tests/room3d/buildScene.test.ts`: floor size, four walls 10 ft high, one object per item, each item's bounding box equals its `size` (footprint and height), position and facing match the plan for rotations 0, 90, 180, 270 and a 10 deg step, every material is white, outlines present, unknown catalog id falls back to a box;
  - `tests/room3d/shapes.test.ts`: each catalog shape fits inside its width x depth x height and is not a single box;
  - `tests/room3d/startView.test.ts`: camera is above the bottom-left corner, looks toward the top-right, about 45 deg down, and the whole room and all items are inside the view for small (6x6) and large (30x30) rooms;
  - `tests/features/threeDTab.test.tsx`: 3D tab enabled; selecting it shows the 3D view and Reset view; moving the camera then going 2D and back 3D gives the start view again; switching back to 2D shows the same plan and items; no WebGL gives the fallback message.

## Risks
- jest (ts-jest, jsdom) has no WebGL and `three` ships ES modules; may need `transformIgnorePatterns` / `moduleNameMapper` changes. Keep scene building pure and mock the renderer in component tests.
- Rotation direction and the 0 = faces +y convention are easy to flip; covered by explicit tests and a visual check against the 2D plan.
- Recognisable shapes need care to stay inside the catalog size box (for example sofa arms, chair legs); the bounding-box test guards this.
- Bundle size grows with `three`; import only the needed modules (`three`, `OrbitControls`) and consider lazy-loading the 3D view.
- Large rooms (30 x 30 ft) with the camera distance formula: verify the whole room stays visible.

## Assumptions
- Library choice is three.js with plain (non-React) usage; react-three-fiber is not added to keep dependencies small.
- Walls are thin solid boxes (about 0.25 ft) on the room edge, kept inside the room footprint so the floor size matches the room width x length.
- The start view uses a perspective camera at about 45 deg down; exact distance is computed to fit the room, not a fixed number.
- Right-drag pan and left-drag orbit are the OrbitControls defaults; zoom is limited to sensible min/max distances so the user cannot get lost.
- Touch gestures are not specified; OrbitControls defaults apply.
- The tab choice is not persisted; reloading opens the 2D tab.
