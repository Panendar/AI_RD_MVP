// Room designer mock: shared drawing helpers and styles for S01-S03 (not a screen; not registered).
// Everything renders from the seed state. Sample data only.
import { esc } from '../../shared/components.js?v=1';

export const CATALOG = [
  { id: 'bed', name: 'Bed (queen)', w: 5.0, d: 6.5, h: 1.5 },
  { id: 'sofa', name: 'Sofa (3 seat)', w: 6.5, d: 3.0, h: 2.75 },
  { id: 'table', name: 'Table (4 seat)', w: 4.0, d: 2.5, h: 2.5 },
  { id: 'chair', name: 'Chair', w: 1.5, d: 1.5, h: 3.0 },
  { id: 'tv', name: 'TV (on stand)', w: 4.0, d: 1.0, h: 3.0 },
  { id: 'locker', name: 'Locker (steel almirah)', w: 3.0, d: 1.75, h: 6.5 }
];

const short = (name) => name.split(' (')[0];
const ft = (n) => Number(n).toFixed(2).replace(/\.?0+$/, '') || '0';

export const STYLE = `<style>
.shell:has(.rd){max-width:none}
.rd{display:grid;gap:12px}
.rd-head{display:flex;flex-wrap:wrap;align-items:center;gap:8px;background:#fff;border:1px solid var(--line);border-radius:12px;padding:8px 10px}
.rd-head .room{font-weight:700;margin-right:auto}
.rd-tab{font:inherit;min-height:44px;padding:8px 14px;border-radius:10px;border:1px solid var(--line);background:#fff;cursor:pointer}
.rd-tab.on{background:var(--brand);color:#fff;border-color:var(--brand);font-weight:700}
.rd-grid{display:grid;grid-template-columns:230px minmax(0,1fr) 250px;gap:12px;align-items:start}
.rd-cat{display:grid;gap:6px}
.rd-cat button{display:flex;justify-content:space-between;gap:8px;align-items:center;min-height:44px;padding:8px 10px;border:1px dashed #9aa4b5;border-radius:10px;background:#fff;font:inherit;cursor:grab;text-align:left}
.rd-cat button small{color:var(--muted);white-space:nowrap}
.rd-plan{background:#fff;border:1px solid var(--line);border-radius:12px;padding:8px}
.rd-plan svg{width:100%;height:auto;max-height:min(58vh,560px);display:block}
.rd-zoom{display:flex;gap:6px;justify-content:flex-end;align-items:center;margin-bottom:6px}
.rd-zoom .btn{min-height:44px;padding:6px 12px}
.rd-tools{display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;justify-content:center}
.rd-json{margin:0;background:#1d2433;color:#d6e2f5;border-radius:10px;padding:10px 12px;font-size:12px;overflow-x:auto;max-height:220px}
.rd-assumed{outline:2px dashed var(--warn);outline-offset:2px}
.rd-red{color:var(--bad);font-weight:700}
.rd-file{display:flex;justify-content:space-between;width:100%;margin-top:8px}
@media (max-width:768px){.rd-grid{grid-template-columns:1fr}}
</style>`;

// Header with the room label, the 2D / 3D tabs and the file buttons (Mock 1-9 header).
export function header(data, active) {
  const r = data.room;
  return `<div class="rd-head">
    <span class="room">Room ${ft(r.width)} x ${ft(r.length)} ft (fixed)</span>
    <button class="rd-tab${active === 'S02' ? ' on' : ''}" ${active === 'S02' ? 'data-toast="You are on the 2D plan tab."' : 'data-goto="S02"'}>2D plan</button>
    <button class="rd-tab${active === 'S03' ? ' on' : ''}" ${active === 'S03' ? 'data-toast="You are on the 3D view tab."' : 'data-goto="S03"'}>3D view</button>
    <button class="btn" data-action="upload-json">Upload JSON</button>
    <button class="btn btn-primary" data-action="download-json">Download JSON</button>
  </div>`;
}

// The room JSON in schema v1.0 built from the state (shown as a walkthrough aid only).
export function roomJson(data) {
  const { width: w, length: l } = data.room;
  return {
    schemaVersion: '1.0',
    units: 'ft',
    origin: 'top-left',
    room: {
      width: w,
      length: l,
      height: 10,
      walls: [
        { id: 'top', from: { x: 0, y: 0 }, to: { x: w, y: 0 } },
        { id: 'right', from: { x: w, y: 0 }, to: { x: w, y: l } },
        { id: 'bottom', from: { x: w, y: l }, to: { x: 0, y: l } },
        { id: 'left', from: { x: 0, y: l }, to: { x: 0, y: 0 } }
      ]
    },
    items: data.plan.items
  };
}

export function jsonStrip(data) {
  const j = roomJson(data);
  const compact = JSON.stringify({ ...j, room: { ...j.room, walls: '[4 walls: top, right, bottom, left]' } }, null, 1)
    .replace(/\n\s*/g, ' ');
  return `<div class="card"><strong>Room JSON</strong> <span class="note">(walkthrough aid: the spec says this is not on the real screen) · schema check: ${esc(data.json.check)}</span>
    <pre class="rd-json">${esc(compact)}</pre></div>`;
}

export function catalog(data, { search = '' } = {}) {
  const rows = CATALOG.map(
    (c) => `<button data-action="drop-${c.id}" title="Drag onto the room"><span>⠿ ${esc(short(c.name))}</span><small>${c.w}x${c.d}x${c.h}</small></button>`
  ).join('');
  return `<div class="card"><strong>Catalog</strong> <span class="note">(all white)</span>
    <label class="field" style="margin-top:8px"><span>Search</span><input value="${esc(search)}" placeholder="Search by name" data-toast="Typing would narrow the list by name; no match shows &quot;No furniture matches&quot; and the plan does not change."></label>
    <p class="note">Item · W x D x H ft</p>
    <div class="rd-cat">${rows}</div>
    <p class="note">Drag an item onto the room. No Add button. Dropped outside the room: nothing is added.<br>In this mock a click stands for the drag and drop.</p></div>`;
}

// Rotated footprint corners of an item (rotation clockwise in the plan, y down).
function corners(it) {
  const a = (it.rotation * Math.PI) / 180;
  const hw = it.size.width / 2;
  const hd = it.size.depth / 2;
  return [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]].map(([x, y]) => [
    it.position.x + x * Math.cos(a) - y * Math.sin(a),
    it.position.y + x * Math.sin(a) + y * Math.cos(a)
  ]);
}

function itemSvg(it, { selected = false, pending = false } = {}) {
  const { width: w, depth: d } = it.size;
  const stroke = pending ? '#b42318' : selected ? '#0f4c81' : '#2b3445';
  const label = short(it.name).toUpperCase();
  const fs = Math.min(0.5, w / (label.length * 0.62));
  const attr = selected
    ? `data-action="drag-selected" title="Drag to move (0.25 ft steps; stops at a wall)"`
    : `data-toast="Clicking ${esc(it.name)} would select it and show its size, centre and rotation."`;
  return `<g transform="translate(${it.position.x} ${it.position.y}) rotate(${it.rotation})" style="cursor:pointer" ${attr}>
    <rect x="${-w / 2}" y="${-d / 2}" width="${w}" height="${d}" fill="#fff" stroke="${stroke}" stroke-width="${selected || pending ? 0.1 : 0.06}" ${pending ? 'stroke-dasharray=".25 .15"' : ''}/>
    <line x1="${-w / 2 + 0.15}" y1="${d / 2 - 0.12}" x2="${w / 2 - 0.15}" y2="${d / 2 - 0.12}" stroke="${stroke}" stroke-width="0.08"/>
    <text x="0" y="${fs / 3}" font-size="${fs}" text-anchor="middle" fill="#2b3445" transform="rotate(${-it.rotation})">${esc(label)}</text>
  </g>`;
}

function ringSvg(it) {
  const r = Math.hypot(it.size.width, it.size.depth) / 2 + 0.45;
  const { x, y } = it.position;
  const a = ((it.rotation - 90) * Math.PI) / 180;
  const kx = x + r * Math.cos(a);
  const ky = y + r * Math.sin(a);
  return `<g data-action="rotate-knob">
    <circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#0f4c81" stroke-width="0.05" stroke-dasharray=".2 .15"/>
    <circle cx="${kx}" cy="${ky}" r="0.28" fill="#0f4c81" style="cursor:grab"/>
    <rect x="${x - 0.8}" y="${y + r - 0.3}" width="1.6" height="0.6" rx="0.3" fill="#0f4c81"/>
    <text x="${x}" y="${y + r + 0.15}" font-size="0.4" text-anchor="middle" fill="#fff">${it.rotation}°</text>
  </g>`;
}

// 2D plan: room to scale in feet, ruler every 2 ft, grid dot every 2 ft, items, selection ring, red line.
export function plan(data) {
  const { width: W, length: L } = data.room;
  const p = data.plan;
  const m = 1.3;
  let ruler = '';
  for (let x = 0; x <= W; x += 2) ruler += `<text x="${x}" y="-0.45" font-size="0.42" text-anchor="middle" fill="#5b6577">${x}</text>`;
  for (let y = 0; y <= L; y += 2) ruler += `<text x="-0.45" y="${y + 0.15}" font-size="0.42" text-anchor="end" fill="#5b6577">${y}</text>`;
  let dots = '';
  for (let x = 2; x < W; x += 2) for (let y = 2; y < L; y += 2) dots += `<circle cx="${x}" cy="${y}" r="0.05" fill="#9aa4b5"/>`;
  const items = p.items.map((it) => itemSvg(it, { selected: it.id === p.selected })).join('');
  const pending = p.pending ? itemSvg(p.pending, { pending: true }) : '';
  const sel = p.items.find((it) => it.id === p.selected);
  const red = p.redLine
    ? `<line x1="${p.redLine.x1}" y1="${p.redLine.y1}" x2="${p.redLine.x2}" y2="${p.redLine.y2}" stroke="#d92d20" stroke-width="0.08" stroke-dasharray=".18 .1"/>
       <text x="${(p.redLine.x1 + p.redLine.x2) / 2 + 0.15}" y="${(p.redLine.y1 + p.redLine.y2) / 2 + 0.12}" font-size="0.4" fill="#d92d20" font-weight="700">${esc(p.redLine.label)}</text>`
    : '';
  const empty = p.items.length || p.pending ? '' : `<text x="${W / 2}" y="${L / 2}" font-size="0.5" text-anchor="middle" fill="#9aa4b5">empty room ${ft(W)} x ${ft(L)} ft</text>`;
  // Whole room fits by default; zoom only when the user asks (plan.zoom.level > 1, centred on cx, cy).
  const z = p.zoom ?? { level: 1 };
  let vb = [-m, -m, W + m + 0.6, L + m + 0.6];
  if (z.level > 1) {
    const vw = vb[2] / z.level;
    const vh = vb[3] / z.level;
    vb = [z.cx - vw / 2, z.cy - vh / 2, vw, vh];
  }
  return `<div class="rd-plan">
    <div class="rd-zoom"><span class="note" style="margin:0 auto 0 0">${z.level > 1 ? `Zoomed in x${z.level}` : 'Whole room'}</span>
      <button class="btn" data-action="zoom-in" aria-label="Zoom in">＋ Zoom in</button>
      <button class="btn" data-action="zoom-fit" aria-label="Fit the whole room">Fit</button></div>
    <svg viewBox="${vb.map((n) => n.toFixed(2)).join(' ')}" role="img" aria-label="2D plan, ${W} by ${L} feet">
      ${ruler}
      <rect x="0" y="0" width="${W}" height="${L}" fill="#f7f8fa" stroke="#1d2433" stroke-width="0.12" data-toast="Clicking empty floor: how an item is deselected is an open question in REQ-360."/>
      <text x="0.1" y="0.4" font-size="0.32" fill="#9aa4b5">(0,0)</text>
      ${dots}${empty}${items}${pending}${red}${sel ? ringSvg(sel) : ''}
    </svg>
    ${sel ? `<div class="rd-tools"><button class="btn" data-action="rotate-10">Rotate 10°</button><button class="btn btn-danger" data-action="delete-item">Delete</button></div>` : ''}
    <p class="note" style="text-align:center">ft · grid: 1 dot = 2 ft · moves snap to 0.25 ft</p>
  </div>`;
}

// Right panel: selected item, last note, opened file or download result.
export function panel(data) {
  const p = data.plan;
  const sel = p.items.find((it) => it.id === p.selected);
  let html = '';
  if (sel) {
    html += `<strong>Selected: ${esc(short(sel.name))}</strong>
      <div class="kv" style="margin-top:8px">
        <div><span>Size W x D x H</span><strong>${sel.size.width} x ${sel.size.depth} x ${sel.size.height} ft</strong></div>
        <div><span>Centre X, Y</span><strong>${ft(sel.position.x)}, ${ft(sel.position.y)}</strong></div>
        <div><span>Rotation</span><strong>${sel.rotation}° (0 = faces bottom wall)</strong></div>
        <div><span>Colour</span><strong>White (fixed)</strong></div>
      </div>
      <p class="note">Size is fixed (no resizing). Drag the knob or press Rotate 10°; steps of 10°.</p>
      <button class="btn btn-danger btn-block" data-action="delete-item" style="margin-top:8px">Delete</button>`;
  } else if (!p.opened && !p.downloaded) {
    html += `<strong>Selected item</strong><p class="note">Nothing selected. Add furniture from the catalog on the left.</p>`;
  }
  if (p.redLine && p.pending) html += `<p class="rd-red">Gap to ${esc(p.redLine.to)}: ${esc(p.redLine.label)}</p><p class="note">Recommended 1.5 ft · minimum 0.5 ft · measured edge to edge after rotation.</p>`;
  if (p.note) html += `<p class="note" style="color:var(--ink)">${esc(p.note)}</p>`;
  if (p.opened)
    html += `<strong>Opened</strong><div class="kv" style="margin-top:8px">
      <div><span>File</span><strong>${esc(p.opened)}</strong></div>
      <div><span>Schema check</span><strong>OK</strong></div><div><span>Rules check</span><strong>OK</strong></div>
      <div><span>Items</span><strong>${p.items.length}</strong></div></div>
      <p class="note">Shown exactly as saved: no red lines, no popups. Keep editing: move, rotate, delete or drag from the catalog.</p>`;
  if (p.downloaded)
    html += `<strong>After Download JSON</strong><div class="kv" style="margin-top:8px">
      <div><span>Browser saves</span><strong><button class="link" data-not-defined="The default file name, and whether the user can name the design, are open questions in REQ-362.">&lt;design&gt;.json</button></strong></div>
      <div><span>Schema check</span><strong>OK</strong></div><div><span>Rules check</span><strong>OK</strong></div></div>
      <p class="note">Send this file to anyone; they open it with Upload JSON. No account, no cloud storage.</p>`;
  return `<div class="card">${html}</div>`;
}

export function popup(data) {
  const p = data.plan;
  if (p.popup === 'clearance')
    return `<div class="overlay"><div class="dialog" role="dialog" aria-label="Too close"><h2>! Too close</h2>
      <p>${esc(p.popupText)}</p>
      <div class="dialog-actions" style="gap:8px"><button class="btn" data-toast="Cancel would put the item back where it was (or remove it, if it was just added).">Cancel</button>
      <button class="btn btn-primary" data-action="place-here">Place here</button></div></div></div>`;
  if (p.popup === 'refused')
    return `<div class="overlay"><div class="dialog" role="dialog" aria-label="Not allowed"><h2>! Not allowed</h2>
      <p>Items must be at least 0.5 ft apart.</p><p class="note">${esc(p.popupText)}</p>
      <div class="dialog-actions"><button class="btn btn-primary" data-action="ok-refused">OK</button></div></div></div>`;
  if (p.popup === 'delete')
    return `<div class="overlay"><div class="dialog" role="dialog" aria-label="Delete"><h2>${esc(p.popupText)}</h2>
      <div class="dialog-actions" style="gap:8px"><button class="btn" data-toast="Cancel would close this and change nothing.">Cancel</button>
      <button class="btn btn-primary" data-action="confirm-delete">Delete</button></div></div></div>`;
  return '';
}

// 3D preview: a fixed oblique "start view" drawn from the same room JSON. Everything is white.
export function view3d(data) {
  const { width: W, length: L } = data.room;
  const H = 10;
  const k = 0.45;
  const P = (x, y, z) => [x + (L - y) * k * 0.87, -z - (L - y) * k * 0.5];
  const poly = (pts, fill, stroke = '#8792a5') =>
    `<polygon points="${pts.map((q) => P(...q).map((n) => n.toFixed(2)).join(',')).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="0.05"/>`;
  let s = '';
  s += poly([[0, 0, 0], [W, 0, 0], [W, 0, H], [0, 0, H]], '#eef0f4'); // back (top) wall
  s += poly([[0, 0, 0], [0, L, 0], [0, L, H], [0, 0, H]], '#e3e6ec'); // left wall
  s += poly([[W, 0, 0], [W, L, 0], [W, L, H], [W, 0, H]], '#f3f4f7'); // right wall
  s += poly([[0, 0, 0], [W, 0, 0], [W, L, 0], [0, L, 0]], '#dfe3ea'); // floor
  const depth = (it) => -it.position.y + it.position.x * 0.01;
  for (const it of [...data.plan.items].sort((a, b) => depth(b) - depth(a))) {
    const c = corners(it);
    const h = it.size.height;
    const sides = [0, 1, 2, 3]
      .map((i) => [c[i], c[(i + 1) % 4]])
      .sort((a, b) => (a[0][1] + a[1][1]) - (b[0][1] + b[1][1]));
    for (const [a, b] of sides) s += poly([[a[0], a[1], 0], [b[0], b[1], 0], [b[0], b[1], h], [a[0], a[1], h]], '#e9ecf1', '#5b6577');
    s += poly(c.map(([x, y]) => [x, y, h]), '#ffffff', '#5b6577');
    const [tx, ty] = P(it.position.x, it.position.y, h);
    s += `<text x="${tx.toFixed(2)}" y="${(ty + 0.15).toFixed(2)}" font-size="0.42" text-anchor="middle" fill="#2b3445">${esc(short(it.name).toUpperCase())}</text>`;
  }
  const [minX, minY] = [-0.5, -H - L * k * 0.5 - 0.5];
  const vw = W + L * k * 0.87 + 1;
  const vh = H + L * k * 0.5 + 1;
  return `<svg viewBox="${minX} ${minY.toFixed(2)} ${vw.toFixed(2)} ${vh.toFixed(2)}" style="width:100%;height:auto;max-height:70vh;display:block;cursor:move" role="img" aria-label="3D view of the room"
    data-toast="Drag would orbit, the wheel would zoom and right-drag would pan (proposed controls; open question in REQ-364).">${s}</svg>`;
}
