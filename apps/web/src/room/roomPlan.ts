// Room plan model, schema v1.0 (docs/project/room-plan-schema.md). Pure TypeScript: no React, no store.
// Units are feet; (0,0) is the top-left floor corner, x runs right along the width, y runs down along the length.

export const SCHEMA_VERSION = '1.0' as const;
export const ROOM_MIN_FT = 6;
export const ROOM_MAX_FT = 30;
export const ROOM_STEP_FT = 0.25;
export const WALL_HEIGHT_FT = 10;

export interface Point { x: number; y: number }
export type WallId = 'top' | 'right' | 'bottom' | 'left';
export interface Wall { id: WallId; from: Point; to: Point }
export interface Room { width: number; length: number; height: typeof WALL_HEIGHT_FT; walls: Wall[] }
export type CatalogId = 'bed' | 'sofa' | 'table' | 'chair' | 'tv' | 'locker';
export interface Item {
  id: string;
  catalogId: CatalogId;
  name: string;
  position: Point;
  size: { width: number; depth: number; height: number };
  rotation: number;
  colour: '#FFFFFF';
}
export interface RoomPlan {
  schemaVersion: typeof SCHEMA_VERSION;
  units: 'ft';
  origin: 'top-left';
  room: Room;
  items: Item[];
}

// The four walls of a width x length rectangle, clockwise from (0,0): top, right, bottom, left.
export function rectangleWalls(width: number, length: number): Wall[] {
  return [
    { id: 'top', from: { x: 0, y: 0 }, to: { x: width, y: 0 } },
    { id: 'right', from: { x: width, y: 0 }, to: { x: width, y: length } },
    { id: 'bottom', from: { x: width, y: length }, to: { x: 0, y: length } },
    { id: 'left', from: { x: 0, y: length }, to: { x: 0, y: 0 } }
  ];
}

export function createRoomPlan(width: number, length: number): RoomPlan {
  return {
    schemaVersion: SCHEMA_VERSION,
    units: 'ft',
    origin: 'top-left',
    room: { width, length, height: WALL_HEIGHT_FT, walls: rectangleWalls(width, length) },
    items: []
  };
}

// Validates one room dimension as typed (the raw string, so "1e1", "12." or "abc" are judged as written).
// Returns the error message, or null when the value is valid.
export function validateRoomSize(value: string | number, label = 'Width'): string | null {
  const raw = String(value ?? '').trim();
  if (raw === '') return `${label} is required.`;
  if (!/^\d+(\.\d+)?$/.test(raw)) return `${label} must be a number in feet.`;
  const n = Number(raw);
  if (n < ROOM_MIN_FT || n > ROOM_MAX_FT) return `${label} must be between ${ROOM_MIN_FT} and ${ROOM_MAX_FT} ft.`;
  if (Math.round(n * 4) !== n * 4) return `${label} must be in steps of ${ROOM_STEP_FT} ft (for example 12, 12.25, 12.5).`;
  return null;
}

// The parsed size when valid, otherwise null.
export function parseRoomSize(value: string): number | null {
  return validateRoomSize(value) === null ? Number(value.trim()) : null;
}
