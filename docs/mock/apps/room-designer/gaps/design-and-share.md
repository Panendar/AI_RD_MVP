# Gaps: design-and-share

Spec: docs/project/context.md and the documents it lists (intent.md, source/features.md, room-plan-schema.md, docs/requirements/REQ-358 to REQ-366). All documents are drafts except intent.md and the source.

## Spec gaps

1. **Upload JSON with no room open.** The mocks show Upload JSON only in the editor header (Mocks 1-9); Mock 1 (New room) has none. The spec does not say how someone receiving a shared file, with no room open, opens it. The walkthrough shows a step-level Not defined alert and puts an assumed, dashed Upload JSON button on the New room screen (S01).
2. **Screen codes.** The spec has no screen codes. The walkthrough uses S01 New room, S02 2D plan, S03 3D view.
3. **2D drawing of items (REQ-359 open question).** Labelled white rectangle or top-view symbol is open. The mock draws labelled white rectangles with a thick line on the front edge.
4. **Deselecting an item (REQ-360 open question).** Click on empty floor or Esc is not defined. Clicking the floor shows a toast saying so. The tour deselects only where the spec implies it (after a delete or a new drop). Arrow-key moves and multi-select are also open and are not shown.
5. **Undo and typed angles (REQ-361 open questions).** Not shown.
6. **Default download file name (REQ-362 open question).** The panel shows `<design>.json` with a Not defined alert. Downloading an empty room is also open and is not shown.
7. **Upload: warning before replacing, error wording, size limit (REQ-363 open questions).** The rejection dialog uses Mock 7's example reason ("item-2 (TV) is 0.25 ft from item-1 ...") and notes that the wording is open. The tour opens a file with no design on screen, so the replace warning does not come up.
8. **3D shapes, start view and contrast (REQ-364 open questions).** Boxes or per-item shapes, the start view angle, and how white items stand out from white walls are not defined. The mock draws boxes from a fixed front-elevated view with grey side faces. A Not defined link on S03 says so. Orbit, zoom, pan and Reset view are toasts (the proposed controls are not confirmed).
9. **3D tab view-only? (REQ-365 open question).** Not defined. The mock gives the 3D view no item interaction.
10. **Cancel on the clearance popup.** The spec defines it (back to where it was, or removed if just added), but the tour follows Place here. Cancel is a toast.
11. **Zoom in the 2D plan.** No requirement or mock mentions zooming the 2D plan (only the 3D view has zoom, REQ-364). The walkthrough adds Zoom in / Fit buttons at the user's request (2026-11-17): the plan always opens showing the whole room, zoom is the user's choice, and the tour uses it on one step only (zoom in on the sofa-table gap, then Fit). The zoom steps and the Fit behaviour are not in the spec; they should be added to a requirement (for example REQ-358 or REQ-360) before they are built.

## Walkthrough notes (not spec gaps)

- **Drag and drop is simulated by a click.** Clicking a catalog row stands for dragging it onto the plan and dropping it at the step's position. Clicking the selected item stands for dragging it. The real app has no Add button (REQ-359).
- **The rotation ring knob** is drawn, but the tour rotates with the Rotate 10° button.
- **The room JSON strip** under the plan is a walkthrough aid. Mock 1 says the JSON lines are not on the real screen. The info panel shows the last JSON change at every step (G1).
- **Sample positions:** the sofa is dropped at (3.75, 2.00) and dragged past the right wall to (8.75, 2.00). The table is at (8.00, 5.75), 1.00 ft below the sofa. The chair is first refused at 0.25 ft from the table, then placed at (2.00, 7.00) and rotated to 10°. The locker is at (1.75, 1.00). All gaps were worked out by hand from the catalog sizes.
- **Changing user:** when the step moves from Asha to Vikram, the design state is cleared to stand for another browser. In the real app the state lives only in each user's own session (no accounts, no cloud).
- **Landing after Create room:** the 2D editor (S02), as Mock 1 says.
- **Landing after a valid upload:** S02 with the design exactly as saved, no red lines and no popups (REQ-363, REQ-366).
- **Off-step controls:** catalog rows, header buttons and the toolbar are live on every S02/S03 step. Clicking one off-step shows the engine's hint (152 validator warnings of this kind, accepted).
