// S03 3D view (REQ-364, REQ-365; Mocks 8-9). Built from the same room JSON as the 2D plan.
import { STYLE, header, view3d } from './_kit.js?v=2';

export const meta = { code: 'S03', name: '3D view', side: 'main', icon: 'parcel', roles: ['homeowner', 'designer'] };

export function render({ data }) {
  const n = data.plan.items.length;
  return `${STYLE}<div class="rd">
    ${header(data, 'S03')}
    <div class="rd-grid" style="grid-template-columns:minmax(0,1fr) 250px">
      <div class="rd-plan">
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:6px">
          <strong>3D view <span class="note">(everything white)</span></strong>
          <button class="btn" data-toast="Reset view would return the camera to the start view.">Reset view</button>
        </div>
        ${view3d(data)}
        <p class="note" style="text-align:center">drag = orbit · wheel = zoom · right-drag = pan</p>
      </div>
      <div class="card"><strong>Built from the room JSON</strong>
        <div class="kv" style="margin-top:8px">
          <div><span>Room</span><strong>${data.room.width} x ${data.room.length} ft</strong></div>
          <div><span>Walls</span><strong>10 ft high</strong></div>
          <div><span>Items</span><strong>${n}, all white</strong></div>
        </div>
        <p class="note">Camera opens at the start view on every visit. The start view angle, box vs per-item shapes, and how white items stand out from white walls are not defined:</p>
        <button class="link" data-not-defined="REQ-364 leaves open: simple boxes or per-item shapes; the exact start view (for example from the bottom-left corner); and how white items are told apart from white walls (shading, outlines). This mock draws boxes from a fixed front view.">What is not defined here</button>
        <p class="note">Every 2D edit (add, move, rotate, delete, open a file) is here with no refresh. Use the 2D plan tab to edit.</p>
      </div>
    </div>
  </div>`;
}
