/** @jest-environment jsdom */
import { fireEvent, screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { renderApp } from '../../src/testing/render';
import { EditorPage } from '../../src/features/editor/EditorPage';
import { useDragState } from '../../src/features/editor/dragState';
import { toPlanPoint } from '../../src/features/editor/toPlanPoint';
import { useRoomStore } from '../../src/state/roomStore';

jest.mock('../../src/features/editor/toPlanPoint', () => ({ toPlanPoint: jest.fn() }));
const mockPoint = toPlanPoint as jest.MockedFunction<typeof toPlanPoint>;

afterEach(() => { useRoomStore.getState().reset(); useDragState.getState().reset(); });

function editor() {
  useRoomStore.getState().createRoom(12, 10);
  useRoomStore.getState().addItem('sofa', { x: 6, y: 5 });
  return renderApp(<Routes><Route path="/editor" element={<EditorPage />} /></Routes>, { route: '/editor' });
}
const pos = () => useRoomStore.getState().plan!.items[0].position;

describe('select and move (REQ-360)', () => {
  it('clicking an item selects it and the panel shows its values', () => {
    editor();
    mockPoint.mockReturnValue({ x: 6, y: 5 });
    const item = screen.getByTestId('plan-item');
    expect(item.getAttribute('data-selected')).toBe('false');
    fireEvent.pointerDown(item);
    expect(screen.getByTestId('plan-item').getAttribute('data-selected')).toBe('true');
    const panel = screen.getByTestId('selected-item');
    expect(panel.textContent).toContain('Centre  X 6.00  Y 5.00');
    expect(panel.textContent).toContain('W 6.5');
    expect(panel.textContent).toContain('Rotation  0 deg');
  });

  it('dragging moves the item in 0.25 ft steps, panel and JSON match', () => {
    editor();
    mockPoint.mockReturnValue({ x: 6, y: 5 });
    fireEvent.pointerDown(screen.getByTestId('plan-item'));
    mockPoint.mockReturnValue({ x: 7.3, y: 5.7 });
    fireEvent.pointerMove(screen.getByTestId('plan-view'));
    expect(pos()).toEqual({ x: 7.25, y: 5.75 });
    expect(screen.getByTestId('selected-item').textContent).toContain('Centre  X 7.25  Y 5.75');
    expect(screen.getByTestId('plan-item').querySelector('rect')!.getAttribute('x')).toBe(String(7.25 - 3.25));
  });

  it('dragging past a wall stops the item at the wall', () => {
    editor();
    mockPoint.mockReturnValue({ x: 6, y: 5 });
    fireEvent.pointerDown(screen.getByTestId('plan-item'));
    mockPoint.mockReturnValue({ x: 40, y: -9 });
    fireEvent.pointerMove(screen.getByTestId('plan-view'));
    expect(pos()).toEqual({ x: 8.75, y: 1.5 });
  });

  it('after pointer up the item no longer follows the pointer', () => {
    editor();
    mockPoint.mockReturnValue({ x: 6, y: 5 });
    fireEvent.pointerDown(screen.getByTestId('plan-item'));
    fireEvent.pointerUp(screen.getByTestId('plan-view'));
    mockPoint.mockReturnValue({ x: 9, y: 9 });
    fireEvent.pointerMove(screen.getByTestId('plan-view'));
    expect(pos()).toEqual({ x: 6, y: 5 });
  });

  it('the item does not jump to the pointer when grabbed off-centre', () => {
    editor();
    mockPoint.mockReturnValue({ x: 7, y: 5.5 });
    fireEvent.pointerDown(screen.getByTestId('plan-item'));
    mockPoint.mockReturnValue({ x: 7, y: 5.5 });
    fireEvent.pointerMove(screen.getByTestId('plan-view'));
    expect(pos()).toEqual({ x: 6, y: 5 });
  });
});
