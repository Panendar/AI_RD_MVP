// The 2D plan: an SVG drawn from `plan.room` only, in feet (1 viewBox unit = 1 ft) so the room is to scale.
// Ruler along the top and left (ticks every 1 ft, labels every 2 ft), grid dots every 2 ft, walls from `room.walls`.
// Later stories (items, moves, clearance) draw on top of this.
import type { Room } from '../../room/roomPlan';

export const RULER_FT = 1.5;           // space for the ruler, outside the room
export const GRID_FT = 2;
const MARGIN_FT = 0.5;

function steps(max: number, every: number): number[] {
  const out: number[] = [];
  for (let v = 0; v <= max + 1e-9; v += every) out.push(Math.round(v * 100) / 100);
  if (out[out.length - 1] !== max) out.push(max);                     // always label the far end (e.g. 12.25)
  return out;
}

export function PlanView({ room }: { room: Room }) {
  const { width, length, walls } = room;
  const vb = `${-RULER_FT} ${-RULER_FT} ${width + RULER_FT + MARGIN_FT} ${length + RULER_FT + MARGIN_FT}`;
  const ticksX = steps(Math.floor(width), 1);
  const ticksY = steps(Math.floor(length), 1);
  const labelsX = steps(width, GRID_FT);
  const labelsY = steps(length, GRID_FT);
  const dots: { x: number; y: number }[] = [];
  for (let x = GRID_FT; x < width; x += GRID_FT) for (let y = GRID_FT; y < length; y += GRID_FT) dots.push({ x, y });
  const font = 0.45;

  return (
    <svg
      data-testid="plan-view"
      role="img"
      aria-label={`2D plan of the empty room, ${width} x ${length} ft`}
      viewBox={vb}
      preserveAspectRatio="xMidYMid meet"
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <rect data-testid="plan-floor" x={0} y={0} width={width} height={length} fill="white" />

      <g data-testid="plan-grid" fill="#A0AEC0">
        {dots.map((d) => <circle key={`${d.x},${d.y}`} cx={d.x} cy={d.y} r={0.07} />)}
      </g>

      <g data-testid="plan-walls" stroke="#1A202C" strokeWidth={0.15} strokeLinecap="square">
        {walls.map((w) => (
          <line key={w.id} data-wall={w.id} x1={w.from.x} y1={w.from.y} x2={w.to.x} y2={w.to.y} />
        ))}
      </g>

      <g data-testid="ruler-top" stroke="#718096" strokeWidth={0.03} fontSize={font} fill="#4A5568">
        {ticksX.map((x) => <line key={`tx${x}`} x1={x} y1={-0.4} x2={x} y2={-0.15} />)}
        {labelsX.map((x) => (
          <text key={`lx${x}`} data-ruler-label={x} x={x} y={-0.6} textAnchor="middle" stroke="none">{x}</text>
        ))}
      </g>
      <g data-testid="ruler-left" stroke="#718096" strokeWidth={0.03} fontSize={font} fill="#4A5568">
        {ticksY.map((y) => <line key={`ty${y}`} x1={-0.4} y1={y} x2={-0.15} y2={y} />)}
        {labelsY.map((y) => (
          <text key={`ly${y}`} data-ruler-label={y} x={-0.55} y={y} textAnchor="end" dominantBaseline="middle" stroke="none">{y}</text>
        ))}
      </g>
      <text x={-RULER_FT + 0.1} y={-RULER_FT + 0.5} fontSize={font} fill="#4A5568">ft</text>
      <text x={0.15} y={0.6} fontSize={font} fill="#718096">(0,0)</text>
    </svg>
  );
}
