// Clearance between furniture items (REQ-366). Pure TypeScript: no React, no store.
// The gap is the shortest edge-to-edge distance between the rotated footprints, in feet. Items may touch (gap 0); only
// overlap is refused. A gap or an overlap smaller than 0.01 ft counts as touching.
import type { Item, Point } from './roomPlan';

export const RECOMMENDED_GAP_FT = 1.5;
export const TOUCH_TOLERANCE_FT = 0.01;

type Placed = Pick<Item, 'position' | 'size' | 'rotation'>;
type Named = Placed & Pick<Item, 'id' | 'name'>;

// The four corners of the footprint after rotation (degrees clockwise in the plan, same as the SVG rotate() of PlanItem).
export function footprintPolygon(item: Placed): Point[] {
  const rad = (item.rotation * Math.PI) / 180;
  const c = Math.cos(rad);
  const s = Math.sin(rad);
  const hw = item.size.width / 2;
  const hd = item.size.depth / 2;
  return [[-hw, -hd], [hw, -hd], [hw, hd], [-hw, hd]].map(([x, y]) => ({
    x: item.position.x + x * c - y * s,
    y: item.position.y + x * s + y * c
  }));
}

export type PairKind = 'ok' | 'close' | 'overlap';
export interface PairMeasure {
  kind: PairKind;
  gap: number;          // feet, 0 when touching or overlapping
  from: Point;          // the closest point on the first outline
  to: Point;            // the closest point on the second outline
}

// How deep two convex polygons overlap (0 when they are apart or only touch), by the separating axis test.
function penetration(a: Point[], b: Point[]): number {
  let depth = Infinity;
  for (const poly of [a, b]) {
    for (let i = 0; i < poly.length; i++) {
      const p = poly[i];
      const q = poly[(i + 1) % poly.length];
      const len = Math.hypot(q.x - p.x, q.y - p.y);
      const nx = -(q.y - p.y) / len;
      const ny = (q.x - p.x) / len;
      const project = (pts: Point[]) => pts.map((pt) => pt.x * nx + pt.y * ny);
      const pa = project(a);
      const pb = project(b);
      const overlap = Math.min(Math.max(...pa), Math.max(...pb)) - Math.max(Math.min(...pa), Math.min(...pb));
      if (overlap <= 0) return 0;
      depth = Math.min(depth, overlap);
    }
  }
  return depth;
}

function closestOnSegment(p: Point, a: Point, b: Point): Point {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const t = Math.max(0, Math.min(1, ((p.x - a.x) * dx + (p.y - a.y) * dy) / (dx * dx + dy * dy)));
  return { x: a.x + t * dx, y: a.y + t * dy };
}

// The closest pair of points between two convex polygons that do not overlap (the closest pair always has a vertex of one).
function closestPoints(a: Point[], b: Point[]): { from: Point; to: Point; dist: number } {
  let best = { from: a[0], to: b[0], dist: Infinity };
  const consider = (v: Point, poly: Point[], vertexIsFirst: boolean) => {
    for (let i = 0; i < poly.length; i++) {
      const q = closestOnSegment(v, poly[i], poly[(i + 1) % poly.length]);
      const dist = Math.hypot(v.x - q.x, v.y - q.y);
      if (dist < best.dist) best = vertexIsFirst ? { from: v, to: q, dist } : { from: q, to: v, dist };
    }
  };
  a.forEach((v) => consider(v, b, true));
  b.forEach((v) => consider(v, a, false));
  return best;
}

const centreOf = (poly: Point[]): Point => ({ x: poly.reduce((s, p) => s + p.x, 0) / poly.length, y: poly.reduce((s, p) => s + p.y, 0) / poly.length });

export function measurePair(a: Placed, b: Placed): PairMeasure {
  const pa = footprintPolygon(a);
  const pb = footprintPolygon(b);
  const depth = penetration(pa, pb);
  if (depth > TOUCH_TOLERANCE_FT) return { kind: 'overlap', gap: 0, from: centreOf(pa), to: centreOf(pb) };
  const near = closestPoints(pa, pb);
  const gap = depth > 0 || near.dist < TOUCH_TOLERANCE_FT ? 0 : near.dist;
  return { kind: gap < RECOMMENDED_GAP_FT ? 'close' : 'ok', gap, from: near.from, to: near.to };
}

export interface ClearanceIssue extends PairMeasure { other: Pick<Item, 'id' | 'name'> }

// Every other item with its measure, nearest first.
export function measureAll(items: Named[], item: Named): ClearanceIssue[] {
  return items
    .filter((it) => it.id !== item.id)
    .map((it) => ({ ...measurePair(item, it), other: { id: it.id, name: it.name } }))
    .sort((x, y) => x.gap - y.gap);
}

// Only the items that are overlapped or closer than the recommended gap.
export function findClearanceIssues(items: Named[], item: Named): ClearanceIssue[] {
  return measureAll(items, item).filter((m) => m.kind !== 'ok');
}

export const formatGap = (gap: number): string => `${gap.toFixed(2)} ft`;
