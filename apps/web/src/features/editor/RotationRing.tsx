// Rotation ring around the selected item (REQ-361): a ring, a knob at the item's current angle and a bubble with the angle.
// Drawn in plan units, not rotated with the item. Dragging the knob is handled by PlanView (pointer capture on the SVG).
import type { PointerEvent } from 'react';
import type { Item } from '../../room/roomPlan';
import { footprintBounds } from '../../room/placement';
import { pointOnRing } from '../../room/rotation';

interface RotationRingProps {
  item: Pick<Item, 'position' | 'size' | 'rotation'>;
  onKnobPointerDown?: (e: PointerEvent<SVGGElement>) => void;
}

export function ringRadius(item: Pick<Item, 'position' | 'size' | 'rotation'>): number {
  const b = footprintBounds(item);
  return Math.hypot(b.maxX - item.position.x, b.maxY - item.position.y) + 0.6;
}

export function RotationRing({ item, onKnobPointerDown }: RotationRingProps) {
  const r = ringRadius(item);
  const knob = pointOnRing(item.position, r, item.rotation);
  const bubble = pointOnRing(item.position, r + 0.7, item.rotation);
  return (
    <g data-testid="rotation-ring">
      <circle cx={item.position.x} cy={item.position.y} r={r} fill="none" stroke="#3182CE" strokeWidth={0.05} strokeDasharray="0.2 0.12" pointerEvents="none" />
      <g data-testid="rotation-knob" onPointerDown={onKnobPointerDown} style={{ cursor: 'grab' }}>
        <circle cx={knob.x} cy={knob.y} r={0.45} fill="transparent" />
        <circle cx={knob.x} cy={knob.y} r={0.25} fill="#3182CE" stroke="#FFFFFF" strokeWidth={0.06} />
      </g>
      <text data-testid="rotation-angle" x={bubble.x} y={bubble.y} fontSize={0.4} textAnchor="middle" dominantBaseline="middle" fill="#2B6CB0" pointerEvents="none">
        {item.rotation} deg
      </text>
    </g>
  );
}
