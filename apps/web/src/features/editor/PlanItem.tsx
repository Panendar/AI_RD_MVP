// One furniture item in the 2D plan: a white rectangle of its footprint at real size with its name on it
// (user decision 2026-11-17: no top-view symbols for now). Rotation is drawn around the centre, ready for REQ-361.
import type { Item } from '../../room/roomPlan';

// Font in ft, scaled so the name fits inside small footprints (about 0.55 ft per character width at 1 ft font).
export function labelFontSize(name: string, width: number, depth: number): number {
  const byWidth = (width * 0.9) / (name.length * 0.55);
  return Math.max(0.15, Math.min(0.4, byWidth, depth * 0.45));
}

export function PlanItem({ item, outline = false }: { item: Pick<Item, 'id' | 'name' | 'position' | 'size' | 'rotation'>; outline?: boolean }) {
  const { x, y } = item.position;
  const { width, depth } = item.size;
  const font = labelFontSize(item.name, width, depth);
  return (
    <g
      data-testid={outline ? 'drag-outline' : 'plan-item'}
      data-item-id={outline ? undefined : item.id}
      transform={`rotate(${item.rotation} ${x} ${y})`}
      pointerEvents={outline ? 'none' : undefined}
    >
      <rect
        x={x - width / 2}
        y={y - depth / 2}
        width={width}
        height={depth}
        fill="#FFFFFF"
        fillOpacity={outline ? 0.6 : 1}
        stroke={outline ? '#3182CE' : '#2D3748'}
        strokeWidth={0.05}
        strokeDasharray={outline ? '0.15 0.1' : undefined}
      />
      {!outline && (
        <text x={x} y={y} fontSize={font} textAnchor="middle" dominantBaseline="middle" fill="#2D3748">{item.name}</text>
      )}
    </g>
  );
}
