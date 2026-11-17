// Converts a pointer position (client pixels) to plan feet using the SVG's own transform (viewBox units are feet).
// Kept in its own module so tests (jsdom has no getScreenCTM) can replace it.
import type { Point } from '../../room/roomPlan';

export function toPlanPoint(svg: SVGSVGElement, clientX: number, clientY: number): Point | null {
  const ctm = svg.getScreenCTM?.();
  if (!ctm || !svg.createSVGPoint) return null;
  const pt = svg.createSVGPoint();
  pt.x = clientX;
  pt.y = clientY;
  const p = pt.matrixTransform(ctm.inverse());
  return { x: p.x, y: p.y };
}
