// Red lines of the clearance rule (REQ-366), drawn for the item being dragged / rotated (or waiting for the user's answer):
// a line along the shortest edge-to-edge distance to every item closer than 1.5 ft, labelled with the gap in feet,
// and a red tint over items that overlap. Plan units, never catches the pointer.
import type { Item } from '../../room/roomPlan';
import { footprintPolygon, formatGap, findClearanceIssues } from '../../room/clearance';

const RED = '#E53E3E';
const points = (item: Item) => footprintPolygon(item).map((p) => `${p.x},${p.y}`).join(' ');

export function ClearanceLines({ items, activeId }: { items: Item[]; activeId: string | null }) {
  const active = items.find((it) => it.id === activeId);
  if (!active) return null;
  const issues = findClearanceIssues(items, active);
  if (issues.length === 0) return null;
  return (
    <g data-testid="clearance-lines" pointerEvents="none">
      {issues.map((i) => {
        if (i.kind === 'overlap') {
          const other = items.find((it) => it.id === i.other.id)!;
          return (
            <g key={i.other.id} data-testid="clearance-overlap" data-other-id={i.other.id}>
              <polygon points={points(active)} fill={RED} fillOpacity={0.35} />
              <polygon points={points(other)} fill={RED} fillOpacity={0.35} />
            </g>
          );
        }
        const mx = (i.from.x + i.to.x) / 2;
        const my = (i.from.y + i.to.y) / 2;
        return (
          <g key={i.other.id} data-testid="clearance-line" data-other-id={i.other.id} data-gap={i.gap.toFixed(2)}>
            {i.gap === 0
              ? <circle cx={mx} cy={my} r={0.2} fill={RED} />
              : <line x1={i.from.x} y1={i.from.y} x2={i.to.x} y2={i.to.y} stroke={RED} strokeWidth={0.1} strokeLinecap="round" />}
            <text x={mx + 0.25} y={my - 0.25} fontSize={0.4} fill={RED} stroke="#FFFFFF" strokeWidth={0.08} paintOrder="stroke">{formatGap(i.gap)}</text>
          </g>
        );
      })}
    </g>
  );
}
