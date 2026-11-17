// The 2D plan: an SVG drawn from `plan.room` only, in feet (1 viewBox unit = 1 ft) so the room is to scale.
// Ruler along the top and left (ticks every 1 ft, labels every 2 ft), grid dots every 2 ft, walls from `room.walls`.
// Items (REQ-359) are drawn on top as white rectangles with their name. When `onDropItem` is given, the plan is a drop
// target for catalog items: while dragging, a real-size outline shows where the item would land (snapped, stopped at walls).
// Later stories (moves, clearance) draw on top of this.
import { useRef, useState, type DragEvent } from 'react';
import type { Item, Point, Room } from '../../room/roomPlan';
import { getCatalogEntry } from '../../room/catalog';
import { placeInRoom } from '../../room/placement';
import { PlanItem } from './PlanItem';
import { CATALOG_DRAG_TYPE, useDragState } from './dragState';
import { toPlanPoint } from './toPlanPoint';

export const RULER_FT = 1.5;           // space for the ruler, outside the room
export const GRID_FT = 2;
const MARGIN_FT = 0.5;

function steps(max: number, every: number): number[] {
  const out: number[] = [];
  for (let v = 0; v <= max + 1e-9; v += every) out.push(Math.round(v * 100) / 100);
  if (out[out.length - 1] !== max) out.push(max);                     // always label the far end (e.g. 12.25)
  return out;
}

export interface PlanViewProps {
  room: Room;
  items?: Item[];
  onDropItem?: (catalogId: string, drop: Point) => void;
}

export function PlanView({ room, items = [], onDropItem }: PlanViewProps) {
  const { width, length, walls } = room;
  const svgRef = useRef<SVGSVGElement>(null);
  const draggingId = useDragState((s) => s.draggingCatalogId);
  const setDragging = useDragState((s) => s.setDragging);
  const [preview, setPreview] = useState<{ name: string; position: Point; size: Item['size'] } | null>(null);

  const pointOf = (e: DragEvent): Point | null => (svgRef.current ? toPlanPoint(svgRef.current, e.clientX, e.clientY) : null);
  const isCatalogDrag = (e: DragEvent) => draggingId !== null || Array.from(e.dataTransfer?.types ?? []).includes(CATALOG_DRAG_TYPE);

  const onDragOver = (e: DragEvent<SVGSVGElement>) => {
    if (!onDropItem || !isCatalogDrag(e)) return;
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
    const entry = draggingId ? getCatalogEntry(draggingId) : undefined;
    const p = pointOf(e);
    const position = entry && p ? placeInRoom(room, entry, p) : null;
    setPreview(entry && position ? { name: entry.name, position, size: { width: entry.width, depth: entry.depth, height: entry.height } } : null);
  };
  const onDrop = (e: DragEvent<SVGSVGElement>) => {
    if (!onDropItem) return;
    e.preventDefault();
    const catalogId = e.dataTransfer?.getData(CATALOG_DRAG_TYPE) || draggingId;
    const p = pointOf(e);
    setPreview(null);
    setDragging(null);
    if (catalogId && p) onDropItem(catalogId, p);
  };
  const clear = () => setPreview(null);
  const vb = `${-RULER_FT} ${-RULER_FT} ${width + RULER_FT + MARGIN_FT} ${length + RULER_FT + MARGIN_FT}`;
  const ticksX = steps(Math.floor(width), 1);
  const ticksY = steps(Math.floor(length), 1);
  const labelsX = steps(width, GRID_FT);
  const labelsY = steps(length, GRID_FT);
  const dots: { x: number; y: number }[] = [];
  for (let x = GRID_FT; x < width; x += GRID_FT) for (let y = GRID_FT; y < length; y += GRID_FT) dots.push({ x, y });
  const font = 0.45;

  return (
    <svg
      ref={svgRef}
      data-testid="plan-view"
      role="img"
      aria-label={items.length === 0
        ? `2D plan of the empty room, ${width} x ${length} ft`
        : `2D plan of the room, ${width} x ${length} ft, ${items.length} item${items.length === 1 ? '' : 's'}`}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragLeave={clear}
      viewBox={vb}
      preserveAspectRatio="xMidYMid meet"
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <rect data-testid="plan-floor" x={0} y={0} width={width} height={length} fill="white" />

      <g data-testid="plan-grid" fill="#A0AEC0">
        {dots.map((d) => <circle key={`${d.x},${d.y}`} cx={d.x} cy={d.y} r={0.07} />)}
      </g>

      {/* items under the walls, so a wall line stays visible where an item touches it */}
      <g data-testid="plan-items">
        {items.map((it) => <PlanItem key={it.id} item={it} />)}
      </g>
      {preview && <PlanItem outline item={{ id: 'drag-outline', rotation: 0, ...preview }} />}

      <g data-testid="plan-walls" stroke="#1A202C" strokeWidth={0.15} strokeLinecap="square">
        {walls.map((w) => (
          <line key={w.id} data-wall={w.id} x1={w.from.x} y1={w.from.y} x2={w.to.x} y2={w.to.y} />
        ))}
      </g>

      <g data-testid="ruler-top" stroke="#718096" strokeWidth={0.03} fontSize={font} fill="#4A5568">
        {ticksX.map((x) => <line key={`tx${x}`} x1={x} y1={-0.4} x2={x} y2={-0.15} />)}
        {labelsX.map((x) => (
          <text key={`lx${x}`} data-ruler-label={x} x={x} y={-0.6} textAnchor="middle" stroke="none">{x}</text>
        ))}
      </g>
      <g data-testid="ruler-left" stroke="#718096" strokeWidth={0.03} fontSize={font} fill="#4A5568">
        {ticksY.map((y) => <line key={`ty${y}`} x1={-0.4} y1={y} x2={-0.15} y2={y} />)}
        {labelsY.map((y) => (
          <text key={`ly${y}`} data-ruler-label={y} x={-0.55} y={y} textAnchor="end" dominantBaseline="middle" stroke="none">{y}</text>
        ))}
      </g>
      <text x={-RULER_FT + 0.1} y={-RULER_FT + 0.5} fontSize={font} fill="#4A5568">ft</text>
      <text x={0.15} y={0.6} fontSize={font} fill="#718096">(0,0)</text>
    </svg>
  );
}
