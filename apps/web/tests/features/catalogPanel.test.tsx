/** @jest-environment jsdom */
import { fireEvent, screen, within } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { renderApp } from '../../src/testing/render';
import { EditorPage } from '../../src/features/editor/EditorPage';
import { PlanView } from '../../src/features/editor/PlanView';
import { labelFontSize } from '../../src/features/editor/PlanItem';
import { CATALOG_DRAG_TYPE, useDragState } from '../../src/features/editor/dragState';
import { useRoomStore } from '../../src/state/roomStore';
import { createRoomPlan } from '../../src/room/roomPlan';
import { toPlanPoint } from '../../src/features/editor/toPlanPoint';

jest.mock('../../src/features/editor/toPlanPoint', () => ({ toPlanPoint: jest.fn() }));
const mockPoint = toPlanPoint as jest.MockedFunction<typeof toPlanPoint>;

// A minimal DataTransfer for jsdom.
function dataTransfer() {
  const data: Record<string, string> = {};
  return {
    data,
    types: [] as string[],
    setData(type: string, value: string) { data[type] = value; this.types.push(type); },
    getData(type: string) { return data[type] ?? ''; },
    dropEffect: 'none',
    effectAllowed: 'all'
  };
}

const editor = () => renderApp(<Routes><Route path="/editor" element={<EditorPage />} /></Routes>, { route: '/editor' });

beforeEach(() => useRoomStore.getState().createRoom(12, 10));
afterEach(() => { useRoomStore.getState().reset(); useDragState.getState().reset(); mockPoint.mockReset(); });

describe('Catalog panel', () => {
  it('lists the six items with width x depth x height in ft', () => {
    editor();
    const rows = screen.getAllByTestId('catalog-item');
    expect(rows.map((r) => r.getAttribute('data-catalog-id'))).toEqual(['bed', 'sofa', 'table', 'chair', 'tv', 'locker']);
    expect(within(rows[1]).getByText('Sofa (3 seat)')).toBeTruthy();
    expect(within(rows[1]).getByTestId('catalog-item-size').textContent).toBe('6.5 x 3.0 x 2.75 ft');
  });

  it('search narrows the list; no match shows "no match" and leaves the plan unchanged', () => {
    editor();
    const search = screen.getByLabelText('Search catalog');
    fireEvent.change(search, { target: { value: 'so' } });
    expect(screen.getAllByTestId('catalog-item').map((r) => r.getAttribute('data-catalog-id'))).toEqual(['sofa']);
    expect(screen.getByText('1 of 6 items match')).toBeTruthy();
    const before = useRoomStore.getState().plan;
    fireEvent.change(search, { target: { value: 'xyz' } });
    expect(screen.queryAllByTestId('catalog-item')).toHaveLength(0);
    expect(screen.getByTestId('catalog-no-match').textContent).toBe('no match');
    expect(useRoomStore.getState().plan).toBe(before);
  });

  it('there is no Add button', () => {
    editor();
    expect(screen.queryByRole('button', { name: /add/i })).toBeNull();
  });
});

describe('Drag and drop onto the plan', () => {
  const drag = (catalogId: string) => {
    const dt = dataTransfer();
    const row = screen.getAllByTestId('catalog-item').find((r) => r.getAttribute('data-catalog-id') === catalogId)!;
    fireEvent.dragStart(row, { dataTransfer: dt });
    return dt;
  };

  it('dropped inside the room: placed where dropped, white, at catalog size, with its name', () => {
    editor();
    const plan = screen.getByTestId('plan-view');
    const dt = drag('sofa');
    expect(dt.data[CATALOG_DRAG_TYPE]).toBe('sofa');

    mockPoint.mockReturnValue({ x: 6.1, y: 4.6 });
    fireEvent.dragOver(plan, { dataTransfer: dt, clientX: 10, clientY: 10 });
    const outline = screen.getByTestId('drag-outline').querySelector('rect')!;
    expect([outline.getAttribute('width'), outline.getAttribute('height')]).toEqual(['6.5', '3']);

    fireEvent.drop(plan, { dataTransfer: dt, clientX: 10, clientY: 10 });
    expect(screen.queryByTestId('drag-outline')).toBeNull();
    const items = useRoomStore.getState().plan!.items;
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ catalogId: 'sofa', position: { x: 6, y: 4.5 }, rotation: 0, colour: '#FFFFFF' });

    const drawn = screen.getByTestId('plan-item');
    const rect = drawn.querySelector('rect')!;
    expect([rect.getAttribute('x'), rect.getAttribute('y'), rect.getAttribute('width'), rect.getAttribute('height')]).toEqual(['2.75', '3', '6.5', '3']);
    expect(rect.getAttribute('fill')).toBe('#FFFFFF');
    expect(within(drawn).getByText('Sofa (3 seat)')).toBeTruthy();
  });

  it('dropped across a wall: stops at the wall', () => {
    editor();
    const dt = drag('sofa');
    mockPoint.mockReturnValue({ x: 0.5, y: 0.2 });
    fireEvent.drop(screen.getByTestId('plan-view'), { dataTransfer: dt });
    expect(useRoomStore.getState().plan!.items[0].position).toEqual({ x: 3.25, y: 1.5 });
  });

  it('dropped outside the room: nothing is added and no outline is shown', () => {
    editor();
    const plan = screen.getByTestId('plan-view');
    const dt = drag('chair');
    mockPoint.mockReturnValue({ x: -1, y: 5 });
    fireEvent.dragOver(plan, { dataTransfer: dt });
    expect(screen.queryByTestId('drag-outline')).toBeNull();
    fireEvent.drop(plan, { dataTransfer: dt });
    expect(useRoomStore.getState().plan!.items).toEqual([]);
    expect(screen.queryByTestId('plan-item')).toBeNull();
  });

  it('drag end and drag leave clear the drag state', () => {
    editor();
    const plan = screen.getByTestId('plan-view');
    const dt = drag('tv');
    mockPoint.mockReturnValue({ x: 5, y: 5 });
    fireEvent.dragOver(plan, { dataTransfer: dt });
    expect(screen.getByTestId('drag-outline')).toBeTruthy();
    fireEvent.dragLeave(plan);
    expect(screen.queryByTestId('drag-outline')).toBeNull();
    fireEvent.dragEnd(screen.getAllByTestId('catalog-item')[4]);
    expect(useDragState.getState().draggingCatalogId).toBeNull();
  });

  it('a plan without a drop handler ignores drops', () => {
    const { room } = createRoomPlan(12, 10);
    renderApp(<PlanView room={room} />);
    mockPoint.mockReturnValue({ x: 5, y: 5 });
    useDragState.getState().setDragging('sofa');
    fireEvent.dragOver(screen.getByTestId('plan-view'));
    fireEvent.drop(screen.getByTestId('plan-view'));
    expect(screen.queryByTestId('drag-outline')).toBeNull();
  });
});

describe('item label', () => {
  it('fits small footprints', () => {
    expect(labelFontSize('Chair', 1.5, 1.5)).toBeLessThanOrEqual(0.4);
    expect(labelFontSize('Locker (steel almirah)', 3, 1.75) * 'Locker (steel almirah)'.length * 0.55).toBeLessThanOrEqual(3);
  });
});
