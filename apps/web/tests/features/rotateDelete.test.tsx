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

function editor(at = { x: 6, y: 5 }) {
  useRoomStore.getState().createRoom(12, 10);
  useRoomStore.getState().addItem('sofa', at);
  const view = renderApp(<Routes><Route path="/editor" element={<EditorPage />} /></Routes>, { route: '/editor' });
  mockPoint.mockReturnValue(at);
  fireEvent.pointerDown(screen.getByTestId('plan-item'));
  fireEvent.pointerUp(screen.getByTestId('plan-view'));
  return view;
}
const rot = () => useRoomStore.getState().plan!.items[0].rotation;

describe('rotate and delete (REQ-361)', () => {
  it('shows the ring only for the selected item, with the angle', () => {
    useRoomStore.getState().createRoom(12, 10);
    useRoomStore.getState().addItem('sofa', { x: 6, y: 5 });
    renderApp(<Routes><Route path="/editor" element={<EditorPage />} /></Routes>, { route: '/editor' });
    expect(screen.queryByTestId('rotation-ring')).toBeNull();
    mockPoint.mockReturnValue({ x: 6, y: 5 });
    fireEvent.pointerDown(screen.getByTestId('plan-item'));
    expect(screen.getByTestId('rotation-angle').textContent).toBe('0 deg');
  });

  it('dragging the knob turns the item in 10 degree steps; panel and JSON match', () => {
    editor();
    fireEvent.pointerDown(screen.getByTestId('rotation-knob'));
    mockPoint.mockReturnValue({ x: 3, y: 5 });          // pointer to the left of the centre = 90
    fireEvent.pointerMove(screen.getByTestId('plan-view'));
    expect(rot()).toBe(90);
    expect(screen.getByTestId('selected-item').textContent).toContain('Rotation  90 deg');
    expect(screen.getByTestId('rotation-angle').textContent).toBe('90 deg');
    const a = (43 * Math.PI) / 180;
    mockPoint.mockReturnValue({ x: 6 - 3 * Math.sin(a), y: 5 + 3 * Math.cos(a) });
    fireEvent.pointerMove(screen.getByTestId('plan-view'));
    expect(rot()).toBe(40);
  });

  it('the knob drag does not move the item and stops on pointer up', () => {
    editor();
    fireEvent.pointerDown(screen.getByTestId('rotation-knob'));
    mockPoint.mockReturnValue({ x: 3, y: 5 });
    fireEvent.pointerMove(screen.getByTestId('plan-view'));
    expect(useRoomStore.getState().plan!.items[0].position).toEqual({ x: 6, y: 5 });
    fireEvent.pointerUp(screen.getByTestId('plan-view'));
    mockPoint.mockReturnValue({ x: 6, y: 2 });
    fireEvent.pointerMove(screen.getByTestId('plan-view'));
    expect(rot()).toBe(90);
  });

  it('the Rotate button turns 10 clockwise and 350 goes to 0', () => {
    editor();
    fireEvent.click(screen.getByRole('button', { name: 'Rotate 10' }));
    expect(rot()).toBe(10);
    useRoomStore.getState().rotateItem('item-1', 350);
    fireEvent.click(screen.getByRole('button', { name: 'Rotate 10' }));
    expect(rot()).toBe(0);
  });

  it('a rotation across a wall is not applied', () => {
    editor({ x: 8.75, y: 1.5 });
    fireEvent.click(screen.getByRole('button', { name: 'Rotate 10' }));
    expect(rot()).toBe(0);
    expect(screen.getByTestId('selected-item').textContent).toContain('Rotation  0 deg');
  });

  it('Delete asks first; Cancel changes nothing, Delete removes the item', async () => {
    editor();
    fireEvent.click(screen.getByRole('button', { name: 'Delete' }));
    expect(await screen.findByText(/Delete Sofa/)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(useRoomStore.getState().plan!.items).toHaveLength(1);

    fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);
    const buttons = await screen.findAllByRole('button', { name: 'Delete' });
    fireEvent.click(buttons[buttons.length - 1]);
    expect(useRoomStore.getState().plan!.items).toHaveLength(0);
    expect(screen.queryByTestId('plan-item')).toBeNull();
    expect(screen.getByText('(nothing selected)')).toBeTruthy();
  });

  it('offers no control to change the size', () => {
    editor();
    expect(screen.queryByRole('button', { name: /size|resize/i })).toBeNull();
    expect(screen.getByTestId('selected-item').textContent).toContain('(size is fixed)');
  });
});

describe('clearance in the editor (REQ-366)', () => {
  const setup = () => {
    useRoomStore.getState().createRoom(12, 10);
    useRoomStore.getState().addItem('chair', { x: 2, y: 5 });
    useRoomStore.getState().addItem('chair', { x: 9, y: 5 });
    renderApp(<Routes><Route path="/editor" element={<EditorPage />} /></Routes>, { route: '/editor' });
  };
  const dragSecondTo = (x: number) => {
    const second = screen.getAllByTestId('plan-item')[1];
    mockPoint.mockReturnValue({ x: 9, y: 5 });
    fireEvent.pointerDown(second);
    mockPoint.mockReturnValue({ x, y: 5 });
    fireEvent.pointerMove(screen.getByTestId('plan-view'));
  };

  it('shows a red line with the gap while dragging, and a popup on drop; Place here removes the line', () => {
    setup();
    dragSecondTo(4.5);                                       // chairs 1.5 wide: gap 4.5-0.75 - 2.75 = 1.00
    expect(screen.getByTestId('clearance-line').textContent).toBe('1.00 ft');
    fireEvent.pointerUp(screen.getByTestId('plan-view'));
    expect(screen.getByText(/This is 1\.00 ft from the Chair/)).toBeTruthy();
    expect(screen.getByTestId('clearance-line')).toBeTruthy();
    fireEvent.click(screen.getByText('Place here'));
    expect(screen.queryByTestId('clearance-line')).toBeNull();
    expect(useRoomStore.getState().plan!.items[1].position.x).toBe(4.5);
  });

  it('Cancel puts the item back', () => {
    setup();
    dragSecondTo(4.5);
    fireEvent.pointerUp(screen.getByTestId('plan-view'));
    fireEvent.click(screen.getByText('Cancel'));
    expect(useRoomStore.getState().plan!.items[1].position.x).toBe(9);
  });

  it('touching asks with 0.00 ft; overlap shows the message and goes back', () => {
    setup();
    dragSecondTo(3.5);
    fireEvent.pointerUp(screen.getByTestId('plan-view'));
    expect(screen.getByText(/This is touching the Chair\. Gap 0\.00 ft/)).toBeTruthy();
    fireEvent.click(screen.getByText('Cancel'));
    dragSecondTo(3);
    expect(screen.getByTestId('clearance-overlap')).toBeTruthy();
    fireEvent.pointerUp(screen.getByTestId('plan-view'));
    expect(screen.getByText(/Items cannot overlap\./)).toBeTruthy();
    expect(useRoomStore.getState().plan!.items[1].position.x).toBe(9);
  });

  it('a gap of 1.5 ft or more shows no line and no popup', () => {
    setup();
    dragSecondTo(5);
    expect(screen.queryByTestId('clearance-line')).toBeNull();
    fireEvent.pointerUp(screen.getByTestId('plan-view'));
    expect(screen.queryByText('Place here')).toBeNull();
  });
});
