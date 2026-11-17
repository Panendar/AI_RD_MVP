// Small top view of the room being typed on the New room screen. Drawn in feet (viewBox), so it is to scale.
export interface RoomPreviewProps { width: number | null; length: number | null }

export function RoomPreview({ width, length }: RoomPreviewProps) {
  if (width === null || length === null) {
    return <p data-testid="room-preview-empty">Enter a valid width and length to see the room.</p>;
  }
  const pad = 2;
  const font = Math.max(width, length) / 18;
  return (
    <svg
      data-testid="room-preview"
      role="img"
      aria-label={`Top view of a ${width} x ${length} ft room`}
      viewBox={`${-pad} ${-pad} ${width + pad * 2} ${length + pad * 2}`}
      preserveAspectRatio="xMidYMid meet"
      style={{ width: '100%', maxHeight: 260 }}
    >
      <rect x={0} y={0} width={width} height={length} fill="white" stroke="currentColor" strokeWidth={0.15} />
      <text x={width / 2} y={length / 2} fontSize={font * 1.2} textAnchor="middle" dominantBaseline="middle">
        {width} x {length} ft
      </text>
      <text x={0} y={-0.5} fontSize={font}>(0,0) = top-left corner</text>
    </svg>
  );
}
