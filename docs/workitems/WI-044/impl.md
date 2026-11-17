# WI-044 3D tab always mirrors the 2D design (add, move, rotate, delete, open file); view-only

Applications: web (primary)
Requirement: REQ-365 - Decision: DEC-400 - Feature: FEAT-1146
Depends on: WI-043 (REQ-364, the 3D tab itself)

## Approach
Browser only. The room JSON in the store is the single source of truth. WI-043 already mounts `ThreeDView` only while the 3D tab is active and builds the scene from the current `plan`. This work item makes the "2D edits appear in 3D at once" behaviour explicit, guarantees it, and enforces that the 3D tab is view-only. The API is not touched.

1. **Single source of truth** - confirm `EditorPage` passes the live store plan (the same object the 2D plan renders and Download JSON exports) to `ThreeDView`. No copy, snapshot or cached scene is kept between tab visits; each open of the 3D tab builds from the current plan. Fix anything in WI-043 code that breaks this.
2. **All edit paths reach 3D** - add, move, rotate, delete and opening a file (Upload JSON) all go through the store, so no extra wiring should be needed. Verify each path; if any edit path bypasses the store or mutates the plan in place (so the reference does not change), fix it so the 3D view rebuilds.
3. **Rebuild on plan change** - keep the `plan` dependency in `ThreeDView`'s effect so a plan change while the 3D tab is open (for example a file opened) also rebuilds the scene. No refresh, reload or button.
4. **View-only** - `ThreeDView` has no click, drag-select or keyboard handlers on the scene other than `OrbitControls` camera movement and the Reset view button. It never reads or writes the selection state and never calls store actions. Clicking an item in 3D changes nothing.
5. **Camera** - unchanged from REQ-364: each 3D open starts at the start view (component mounted per open, camera state not stored).
6. **Not changed**: room JSON schema, store actions, API, 2D plan code (unless step 2 finds a defect).

## Areas and files likely affected (apps/web)
- Verify, small fixes only if needed: `src/features/editor/EditorPage.tsx`, `src/features/editor/ThreeDView.tsx`, store/Upload JSON code path.
- Tests (mainly new):
  - `tests/features/threeDTab.test.tsx` (extend) or new `tests/features/threeDSync.test.tsx`, with `buildRoomScene` observed or spied on (WebGL is not available in jsdom):
    - add an item in 2D, open 3D: scene built with that item;
    - move, rotate, delete: scene built from the changed plan (new position, rotation, item gone);
    - open a design from a file (Upload JSON) then open 3D: scene shows the uploaded design; also when uploaded while 3D is open;
    - switch 2D, 3D, 2D, 3D several times: same plan each time and 2D unchanged;
    - no extra button or refresh control in the 3D panel beyond Reset view;
    - click and keydown on the 3D area: store plan and selection unchanged, no edit controls rendered.
  - `tests/room3d/buildScene.test.ts`: already covers plan-to-scene mapping (WI-043); add a case that two different plans give different scenes (no caching).

## Risks
- Overlaps heavily with WI-043; the risk is duplicate work or conflicting edits in `EditorPage.tsx` and `ThreeDView.tsx`. Implement after WI-043 is merged or on top of it.
- Because jsdom has no WebGL, the "at once" check is at the scene-builder/mount level, not pixels; a manual visual check against the 2D plan is still advised.
- In-place mutation of the plan in some 2D edit path would not trigger a rebuild; step 2 checks for it.

## Assumptions
- Edits are made only in the 2D tab; the 3D tab does not need to react to edits while the user is in 2D except by building fresh when opened (REQ-365: "the next time the user opens it").
- Opening a file while the 3D tab is active is allowed (Upload JSON stays available in both tabs, WI-043) and the view updates at once.
- No new library, no schema change, no API work.
