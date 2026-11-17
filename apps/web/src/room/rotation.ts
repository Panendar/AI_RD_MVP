// Rotation helpers (REQ-361). Pure TypeScript: no React, no store.
// `rotation` is the facing in degrees clockwise in the plan; 0 = the front faces the bottom wall (+y), 90 = the left wall (-x).
import type { Point } from './roomPlan';

export const ROTATION_STEP_DEG = 10;

// Normalises to 0..359 and snaps to the nearest 10 degrees (355 and above gives 0).
export function snapAngle(deg: number): number {
  const snapped = Math.round(deg / ROTATION_STEP_DEG) * ROTATION_STEP_DEG;
  return ((snapped % 360) + 360) % 360;
}

// The facing angle that points from `centre` towards `point`, in the same convention as `rotation` (0..360, not snapped).
export function angleFromPoint(centre: Point, point: Point): number {
  const deg = (Math.atan2(-(point.x - centre.x), point.y - centre.y) * 180) / Math.PI;
  return (deg + 360) % 360;
}

// Where the knob sits on a ring of `radius` around `centre` for a facing angle.
export function pointOnRing(centre: Point, radius: number, deg: number): Point {
  const rad = (deg * Math.PI) / 180;
  return { x: centre.x - radius * Math.sin(rad), y: centre.y + radius * Math.cos(rad) };
}

// Which wall the front faces, for the panel.
export function facingLabel(deg: number): string {
  const names = ['bottom wall', 'bottom-left corner', 'left wall', 'top-left corner', 'top wall', 'top-right corner', 'right wall', 'bottom-right corner'];
  return names[Math.round(deg / 45) % 8];
}
