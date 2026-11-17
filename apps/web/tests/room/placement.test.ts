/** @jest-environment node */
import { clampCentre, footprintBounds, isInsideRoom, nextItemId, placeInRoom, snap } from '../../src/room/placement';

const room = { width: 12, length: 10 };
const sofa = { width: 6.5, depth: 3.0 };
const locker = { width: 3.0, depth: 1.75 };
const bed = { width: 5.0, depth: 6.5 };

describe('placement', () => {
  it('snaps to 0.25 ft', () => {
    expect(snap(6.1)).toBe(6);
    expect(snap(4.6)).toBe(4.5);
    expect(snap(4.63)).toBe(4.75);
  });

  it('places the item where it was dropped, snapped', () => {
    expect(placeInRoom(room, sofa, { x: 6.1, y: 4.6 })).toEqual({ x: 6, y: 4.5 });
  });

  it('stops at the wall when the footprint would cross it', () => {
    expect(placeInRoom(room, sofa, { x: 0.5, y: 0.2 })).toEqual({ x: 3.25, y: 1.5 });
    expect(placeInRoom(room, sofa, { x: 11.9, y: 9.9 })).toEqual({ x: 8.75, y: 8.5 });
  });

  it('keeps positions on the 0.25 grid for odd half sizes (locker depth 1.75)', () => {
    expect(placeInRoom(room, locker, { x: 6, y: 0 })).toEqual({ x: 6, y: 1 });
    expect(placeInRoom(room, locker, { x: 6, y: 10 })).toEqual({ x: 6, y: 9 });
  });

  it('adds nothing when dropped outside the room', () => {
    expect(placeInRoom(room, sofa, { x: -0.1, y: 5 })).toBeNull();
    expect(placeInRoom(room, sofa, { x: 5, y: 10.5 })).toBeNull();
    expect(isInsideRoom(room, { x: 12, y: 10 })).toBe(true);
  });

  it('adds nothing when the item cannot fit (bed in a 6 ft long room)', () => {
    expect(placeInRoom({ width: 12, length: 6 }, bed, { x: 6, y: 3 })).toBeNull();
    expect(placeInRoom({ width: 12, length: 6.5 }, bed, { x: 6, y: 3 })).toEqual({ x: 6, y: 3.25 });
  });

  it('numbers new items after the highest id', () => {
    expect(nextItemId([])).toBe('item-1');
    expect(nextItemId([{ id: 'item-1' }, { id: 'item-7' }, { id: 'x' }])).toBe('item-8');
  });

  it('footprint bounds account for rotation', () => {
    const b0 = footprintBounds({ position: { x: 5, y: 5 }, size: { width: 6.5, depth: 3, height: 1 }, rotation: 0 });
    expect(b0).toEqual({ minX: 1.75, maxX: 8.25, minY: 3.5, maxY: 6.5 });
    const b90 = footprintBounds({ position: { x: 5, y: 5 }, size: { width: 6.5, depth: 3, height: 1 }, rotation: 90 });
    expect(b90.minX).toBeCloseTo(3.5);
    expect(b90.maxY).toBeCloseTo(8.25);
  });
});

describe('clampCentre (REQ-360)', () => {
  const size = { width: 6.5, depth: 3.0, height: 2.75 };
  it('snaps to 0.25 ft', () => {
    expect(clampCentre(room, { size, rotation: 0 }, { x: 6.1, y: 4.6 })).toEqual({ x: 6, y: 4.5 });
  });
  it('stops at the walls, touching them', () => {
    expect(clampCentre(room, { size, rotation: 0 }, { x: 99, y: -5 })).toEqual({ x: 8.75, y: 1.5 });
    expect(clampCentre(room, { size, rotation: 0 }, { x: -3, y: 99 })).toEqual({ x: 3.25, y: 8.5 });
  });
  it('uses the rotated footprint', () => {
    const c = clampCentre(room, { size, rotation: 90 }, { x: 99, y: 99 })!;
    expect(c).toEqual({ x: 10.5, y: 6.75 });
  });
  it('keeps multiples of 0.25 for odd sizes (locker 1.75 deep)', () => {
    const c = clampCentre(room, { size: { width: 3, depth: 1.75, height: 6.5 }, rotation: 0 }, { x: 5, y: 99 })!;
    expect(c.y % 0.25).toBe(0);
    expect(c.y + 0.875).toBeLessThanOrEqual(10);
  });
  it('returns null when the item cannot fit', () => {
    expect(clampCentre({ width: 6, length: 6 }, { size: { width: 7, depth: 1, height: 1 }, rotation: 0 }, { x: 3, y: 3 })).toBeNull();
  });
});
