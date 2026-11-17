// Where a dropped item lands (REQ-359). Pure TypeScript: no React, no store.
// Positions are the centre of the footprint, in feet from the top-left corner, multiples of 0.25 ft.
import type { Item, Point, Room } from './roomPlan';

export const SNAP_FT = 0.25;
const EPS = 1e-9;

export const snap = (v: number): number => Math.round(v / SNAP_FT) * SNAP_FT;
const ceilSnap = (v: number): number => Math.ceil(v / SNAP_FT - EPS) * SNAP_FT;
const floorSnap = (v: number): number => Math.floor(v / SNAP_FT + EPS) * SNAP_FT;

// The drop point is on the floor (walls included).
export function isInsideRoom(room: Pick<Room, 'width' | 'length'>, p: Point): boolean {
  return p.x >= 0 && p.y >= 0 && p.x <= room.width && p.y <= room.length;
}

// Snaps the drop point and clamps the centre so the footprint (width along x, depth along y, facing 0 deg) stays inside the
// walls: an item dropped across a wall stops at the wall. The clamp range is rounded inward to the 0.25 ft grid, so the
// position stays schema-valid. Returns null when the drop is outside the room or the item cannot fit in the room at all.
export function placeInRoom(
  room: Pick<Room, 'width' | 'length'>,
  size: { width: number; depth: number },
  drop: Point
): Point | null {
  if (!isInsideRoom(room, drop)) return null;
  const axis = (v: number, half: number, max: number): number | null => {
    const lo = ceilSnap(half);
    const hi = floorSnap(max - half);
    if (lo > hi + EPS) return null;
    return Math.min(Math.max(snap(v), lo), hi);
  };
  const x = axis(drop.x, size.width / 2, room.width);
  const y = axis(drop.y, size.depth / 2, room.length);
  return x === null || y === null ? null : { x, y };
}

// Where a moved item lands (REQ-360): the point is snapped to 0.25 ft, then the centre is clamped so the rotated footprint
// stays inside the walls (the item stops touching the wall). The clamp range is rounded inward to the grid, so the position
// stays a multiple of 0.25 ft. Returns null when the item cannot fit in the room at all.
export function clampCentre(
  room: Pick<Room, 'width' | 'length'>,
  item: Pick<Item, 'size' | 'rotation'>,
  point: Point
): Point | null {
  const b = footprintBounds({ position: { x: 0, y: 0 }, size: item.size, rotation: item.rotation });
  const axis = (v: number, half: number, max: number): number | null => {
    const lo = ceilSnap(half);
    const hi = floorSnap(max - half);
    if (lo > hi + EPS) return null;
    return Math.min(Math.max(snap(v), lo), hi);
  };
  const x = axis(point.x, b.maxX, room.width);
  const y = axis(point.y, b.maxY, room.length);
  return x === null || y === null ? null : { x, y };
}

// item-<n>, one more than the highest existing number.
export function nextItemId(items: Pick<Item, 'id'>[]): string {
  const max = items.reduce((m, it) => {
    const n = /^item-(\d+)$/.exec(it.id);
    return n ? Math.max(m, Number(n[1])) : m;
  }, 0);
  return `item-${max + 1}`;
}

// The axis-aligned bounds of an item's footprint after rotation (degrees clockwise in the plan).
export function footprintBounds(item: Pick<Item, 'position' | 'size' | 'rotation'>) {
  const rad = (item.rotation * Math.PI) / 180;
  const c = Math.abs(Math.cos(rad));
  const s = Math.abs(Math.sin(rad));
  const halfX = (item.size.width * c + item.size.depth * s) / 2;
  const halfY = (item.size.width * s + item.size.depth * c) / 2;
  return { minX: item.position.x - halfX, maxX: item.position.x + halfX, minY: item.position.y - halfY, maxY: item.position.y + halfY };
}
