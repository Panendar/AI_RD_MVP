/** @jest-environment jsdom */
import { render, screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { renderApp } from '../../src/testing/render';
import { PlanView, RULER_FT } from '../../src/features/editor/PlanView';
import { EditorPage } from '../../src/features/editor/EditorPage';
import { createRoomPlan } from '../../src/room/roomPlan';
import { useRoomStore } from '../../src/state/roomStore';

afterEach(() => useRoomStore.getState().reset());

describe('PlanView', () => {
  it('the viewBox and walls are in feet and equal the room size', () => {
    const { room } = createRoomPlan(12, 10);
    render(<PlanView room={room} />);
    const [x, y, w, h] = screen.getByTestId('plan-view').getAttribute('viewBox')!.split(' ').map(Number);
    expect([x, y]).toEqual([-RULER_FT, -RULER_FT]);
    expect(w).toBeCloseTo(12 + RULER_FT + 0.5);
    expect(h).toBeCloseTo(10 + RULER_FT + 0.5);
    const floor = screen.getByTestId('plan-floor');
    expect([floor.getAttribute('width'), floor.getAttribute('height')]).toEqual(['12', '10']);
    const lines = Array.from(screen.getByTestId('plan-walls').querySelectorAll('line'));
    expect(lines.map((l) => l.getAttribute('data-wall'))).toEqual(['top', 'right', 'bottom', 'left']);
    const right = lines[1];
    expect([right.getAttribute('x1'), right.getAttribute('y1'), right.getAttribute('x2'), right.getAttribute('y2')]).toEqual(['12', '0', '12', '10']);
  });

  it('ruler labels every 2 ft reach the width and length, with a tick per foot', () => {
    const { room } = createRoomPlan(12.25, 9);
    render(<PlanView room={room} />);
    const labels = (id: string) => Array.from(screen.getByTestId(id).querySelectorAll('text')).map((t) => Number(t.getAttribute('data-ruler-label')));
    expect(labels('ruler-top')).toEqual([0, 2, 4, 6, 8, 10, 12, 12.25]);
    expect(labels('ruler-left')).toEqual([0, 2, 4, 6, 8, 9]);
    expect(screen.getByTestId('ruler-top').querySelectorAll('line').length).toBe(13);   // 0..12
    expect(screen.getByTestId('ruler-left').querySelectorAll('line').length).toBe(10);  // 0..9
  });

  it('grid dots are every 2 ft inside the room', () => {
    render(<PlanView room={createRoomPlan(12, 10).room} />);
    expect(screen.getByTestId('plan-grid').querySelectorAll('circle').length).toBe(5 * 4);
  });
});

describe('Editor screen', () => {
  const editor = () => renderApp(
    <Routes>
      <Route path="/" element={<h1>New room screen</h1>} />
      <Route path="/editor" element={<EditorPage />} />
    </Routes>,
    { route: '/editor' }
  );

  it('without a room it goes back to the New room screen', () => {
    editor();
    expect(screen.getByRole('heading', { name: 'New room screen' })).toBeTruthy();
  });

  it('shows the fixed room, the 2D plan and the empty selection', () => {
    useRoomStore.getState().createRoom(12, 10);
    editor();
    expect(screen.getByRole('heading', { name: 'Room 12 x 10 ft (fixed)' })).toBeTruthy();
    expect(screen.getByRole('tab', { name: '2D plan' }).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByText('Grid: 1 dot = 2 ft')).toBeTruthy();
    expect(screen.getByText('(nothing selected)')).toBeTruthy();
    expect(screen.getByTestId('plan-view')).toBeTruthy();
  });

  it('has no input or control that changes width or length (the only input is the catalog search)', () => {
    useRoomStore.getState().createRoom(12, 10);
    const { container } = editor();
    const inputs = Array.from(container.querySelectorAll('input, select, textarea, [contenteditable="true"]'));
    expect(inputs.map((i) => i.getAttribute('aria-label'))).toEqual(['Search catalog']);
    expect(screen.queryByRole('spinbutton')).toBeNull();
    const enabled = Array.from(container.querySelectorAll('button')).filter((b) => !b.disabled).map((b) => b.textContent);
    expect(enabled).toEqual(['2D plan']);
  });
});
