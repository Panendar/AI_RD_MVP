/** @jest-environment node */
import { measurePair, formatGap, findClearanceIssues } from '../../src/room/clearance';

const box = (x: number, y: number, w: number, d: number, rotation = 0) => ({ position: { x, y }, size: { width: w, depth: d, height: 1 }, rotation });

describe('clearance geometry (REQ-366)', () => {
  it('measures the edge-to-edge gap of axis-aligned items', () => {
    const m = measurePair(box(2, 2, 2, 2), box(5, 2, 2, 2));   // right edge 3, left edge 4
    expect(m.gap).toBeCloseTo(1, 6);
    expect(m.kind).toBe('close');
    expect(formatGap(m.gap)).toBe('1.00 ft');
  });
  it('1.5 ft or more is ok, just under is close', () => {
    expect(measurePair(box(2, 2, 2, 2), box(5.5, 2, 2, 2)).kind).toBe('ok');
    expect(measurePair(box(2, 2, 2, 2), box(5.49, 2, 2, 2)).kind).toBe('close');
  });
  it('touching items have gap 0 and are close, not overlapping', () => {
    const m = measurePair(box(2, 2, 2, 2), box(4, 2, 2, 2));
    expect(m).toMatchObject({ kind: 'close', gap: 0 });
  });
  it('treats under 0.01 ft of gap or overlap as touching', () => {
    expect(measurePair(box(2, 2, 2, 2), box(4.005, 2, 2, 2))).toMatchObject({ kind: 'close', gap: 0 });
    expect(measurePair(box(2, 2, 2, 2), box(3.995, 2, 2, 2))).toMatchObject({ kind: 'close', gap: 0 });
  });
  it('overlap deeper than 0.01 ft is an overlap', () => {
    expect(measurePair(box(2, 2, 2, 2), box(3.5, 2, 2, 2)).kind).toBe('overlap');
    expect(measurePair(box(2, 2, 2, 2), box(2, 2, 1, 1)).kind).toBe('overlap');   // one inside the other
  });
  it('uses the rotated outline, not the bounding box', () => {
    // a 4 x 1 bar turned 90 deg is 1 wide and 4 tall: a gap of 1 to the box on its right
    expect(measurePair(box(2, 5, 4, 1, 90), box(4, 5, 1, 1)).gap).toBeCloseTo(1, 6);
    // 45 deg: the corner of a 2x2 square reaches sqrt(2) from its centre; gap to a box at x=6 (left edge 5.5) is 5.5-(2+1.41421)
    expect(measurePair(box(2, 2, 2, 2, 45), box(6, 2, 1, 1)).gap).toBeCloseTo(5.5 - 2 - Math.SQRT2, 6);
  });
  it('lists only the others that are not ok, nearest first', () => {
    const items = [
      { id: 'a', name: 'A', ...box(2, 2, 2, 2) },
      { id: 'b', name: 'B', ...box(5, 2, 2, 2) },        // gap 1.00
      { id: 'c', name: 'C', ...box(4.25, 6, 1, 1) },     // a different row: gap is to the corner, sqrt(0.75^2+2.5^2)... > 1.5 (ok)
      { id: 'd', name: 'D', ...box(3.25, 2, 0.5, 0.5) }, // gap 0.00 (touching: left edge 3.0)
      { id: 'e', name: 'E', ...box(20, 20, 2, 2) }
    ];
    expect(findClearanceIssues(items, items[0]).map((i) => i.other.id)).toEqual(['d', 'b']);
  });
});
