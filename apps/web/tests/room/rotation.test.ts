/** @jest-environment node */
import { angleFromPoint, facingLabel, pointOnRing, snapAngle } from '../../src/room/rotation';

describe('rotation helpers', () => {
  it('snaps to the nearest 10 degrees and wraps 355+ to 0', () => {
    expect(snapAngle(14)).toBe(10);
    expect(snapAngle(15)).toBe(20);
    expect(snapAngle(354)).toBe(350);
    expect(snapAngle(355)).toBe(0);
    expect(snapAngle(360)).toBe(0);
    expect(snapAngle(-10)).toBe(350);
  });

  it('angleFromPoint uses 0 = bottom, 90 = left, 180 = top, 270 = right', () => {
    const c = { x: 5, y: 5 };
    expect(angleFromPoint(c, { x: 5, y: 8 })).toBeCloseTo(0);
    expect(angleFromPoint(c, { x: 2, y: 5 })).toBeCloseTo(90);
    expect(angleFromPoint(c, { x: 5, y: 2 })).toBeCloseTo(180);
    expect(angleFromPoint(c, { x: 8, y: 5 })).toBeCloseTo(270);
  });

  it('pointOnRing is the inverse of angleFromPoint', () => {
    const c = { x: 5, y: 5 };
    for (const a of [0, 90, 180, 270, 40]) expect(angleFromPoint(c, pointOnRing(c, 3, a))).toBeCloseTo(a);
  });

  it('names the wall the front faces', () => {
    expect(facingLabel(0)).toBe('bottom wall');
    expect(facingLabel(90)).toBe('left wall');
    expect(facingLabel(180)).toBe('top wall');
    expect(facingLabel(270)).toBe('right wall');
  });
});
