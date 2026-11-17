// S01 New room (REQ-358, Mock 1). Also hosts the Upload JSON picker for a user with no room open (placement assumed, gap 1).
import { esc } from '../../shared/components.js?v=1';
import { STYLE } from './_kit.js?v=2';

export const meta = { code: 'S01', name: 'New room', side: 'main', icon: 'home', roles: ['homeowner', 'designer'] };

function picker(data) {
  const u = data.upload;
  if (u.error)
    return `<div class="overlay"><div class="dialog" role="dialog" aria-label="Invalid file"><h2>! This file is not a valid room design.</h2>
      <p>${esc(u.errorText)}</p>
      <p class="note">Nothing was opened. Whether the message names the exact rule is an open question (REQ-363).</p>
      <div class="dialog-actions"><button class="btn btn-primary" data-action="ok-invalid">OK</button></div></div></div>`;
  if (!u.picker) return '';
  const files = u.files
    .map((f) => `<button class="btn rd-file" data-action="${esc(f.action)}"><span>📄 ${esc(f.name)}</span><small class="note">${esc(f.note)}</small></button>`)
    .join('');
  return `<div class="overlay"><div class="dialog" role="dialog" aria-label="Choose a file"><h2>Choose a .json design file</h2>
    <p class="note">The browser's file picker (sample files).</p>${files}
    <div class="dialog-actions"><button class="btn" data-toast="Cancel would close the picker; nothing is opened.">Cancel</button></div></div></div>`;
}

export function render({ data }) {
  const r = data.room;
  const scale = 14;
  return `${STYLE}<div class="rd">
    <div class="rd-head"><span class="room">New room</span>
      <button class="btn rd-assumed" data-action="upload-json" title="Placement assumed">Upload JSON</button></div>
    <p class="note">The dashed Upload JSON button is not in Mock 1: where a user with no room open opens a file is not defined (gap 1).</p>
    <div class="rd-grid" style="grid-template-columns:minmax(0,1fr) minmax(0,1fr)">
      <div class="card"><h2 style="margin-top:0">Start from scratch</h2>
        <div class="kv" style="margin-bottom:12px"><div><span>Shape</span><strong>Rectangle</strong></div></div>
        <label class="field"><span>Width (ft) · 6 to 30</span><input type="number" step="0.25" value="${esc(r.width)}" data-toast="Width would be checked: 6 to 30 ft in 0.25 ft steps; otherwise &quot;Width must be between 6 and 30 ft.&quot; shows under the field."></label>
        <label class="field" style="margin-top:10px"><span>Length (ft) · 6 to 30</span><input type="number" step="0.25" value="${esc(r.length)}" data-toast="Length would be checked: 6 to 30 ft in 0.25 ft steps; otherwise a message shows under the field and Create room does nothing."></label>
        <div class="kv" style="margin-top:12px"><div><span>Walls</span><strong>10 ft high (standard, fixed)</strong></div></div>
        <p class="note">The room size cannot be changed later.</p>
        <button class="btn btn-primary btn-block" data-action="create-room" style="margin-top:12px">Create room</button>
      </div>
      <div class="card"><h2 style="margin-top:0">Preview (top view)</h2>
        <svg viewBox="-1 -1.2 ${r.width + 2} ${r.length + 2.4}" style="width:100%;max-height:260px" role="img" aria-label="Room preview">
          <text x="0" y="-0.4" font-size="0.6" fill="#5b6577">0</text><text x="${r.width}" y="-0.4" font-size="0.6" text-anchor="end" fill="#5b6577">${esc(r.width)} ft</text>
          <rect x="0" y="0" width="${r.width}" height="${r.length}" fill="#f7f8fa" stroke="#1d2433" stroke-width="0.12"/>
          <text x="${r.width / 2}" y="${r.length / 2}" font-size="${scale / 14}" text-anchor="middle">${esc(r.width)} x ${esc(r.length)} ft</text>
          <text x="0" y="${r.length + 0.9}" font-size="0.5" fill="#5b6577">(0,0) = top-left corner</text>
        </svg>
        <p class="note">The preview follows the width and length as you type.</p>
      </div>
    </div>
    ${picker(data)}
  </div>`;
}
