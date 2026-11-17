// Where a dropped item lands (REQ-359). Pure TypeScript: no React, no store.
// Positions are the centre of the footprint, in feet from the top-left corner, multiples of 0.25 ft away from walls and
// exact to 0.01 ft where the item touches a wall.
import type { Item, Point, Room } from './roomPlan';

export const SNAP_FT = 0.25;
const EPS = 1e-9;

export const snap = (v: number): number => Math.round(v / SNAP_FT) * SNAP_FT;
// Positions stop exactly at a wall, to this precision (0.01 ft, rounded inward), so an item always touches the wall like in
// real life (a locker 1.75 ft deep turned 90 deg touches the wall, no 0.125 ft gap). Away from walls they stay on 0.25 ft.
export const WALL_PRECISION_FT = 0.01;
const ceilWall = (v: number): number => Math.ceil(v / WALL_PRECISION_FT - 1e-6) * WALL_PRECISION_FT;
const floorWall = (v: number): number => Math.floor(v / WALL_PRECISION_FT + 1e-6) * WALL_PRECISION_FT;
const round2 = (v: number): number => Math.round(v * 100) / 100;

// Snaps v to 0.25 ft, then clamps it into [half, max - half] (the item touches the wall). null when it cannot fit.
function axisPosition(v: number, half: number, max: number): number | null {
  const lo = ceilWall(half);
  const hi = floorWall(max - half);
  if (lo > hi + EPS) return null;
  return round2(Math.min(Math.max(snap(v), lo), hi));
}

// The drop point is on the floor (walls included).
export function isInsideRoom(room: Pick<Room, 'width' | 'length'>, p: Point): boolean {
  return p.x >= 0 && p.y >= 0 && p.x <= room.width && p.y <= room.length;
}

// Snaps the drop point and clamps the centre so the footprint (width along x, depth along y, facing 0 deg) stays inside the
// walls: an item dropped across a wall stops touching the wall (to 0.01 ft, rounded inward). Returns null when the drop is outside the room or the item cannot fit in the room at all.
export function placeInRoom(
  room: Pick<Room, 'width' | 'length'>,
  size: { width: number; depth: number },
  drop: Point
): Point | null {
  if (!isInsideRoom(room, drop)) return null;
  const x = axisPosition(drop.x, size.width / 2, room.width);
  const y = axisPosition(drop.y, size.depth / 2, room.length);
  return x === null || y === null ? null : { x, y };
}

// Where a moved item lands (REQ-360): the point is snapped to 0.25 ft, then the centre is clamped so the rotated footprint
// stays inside the walls (the item stops touching the wall, to 0.01 ft rounded inward). Returns null when the item cannot fit in the room at all.
export function clampCentre(
  room: Pick<Room, 'width' | 'length'>,
  item: Pick<Item, 'size' | 'rotation'>,
  point: Point
): Point | null {
  const b = footprintBounds({ position: { x: 0, y: 0 }, size: item.size, rotation: item.rotation });
  const x = axisPosition(point.x, b.maxX, room.width);
  const y = axisPosition(point.y, b.maxY, room.length);
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
