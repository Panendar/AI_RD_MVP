/** @jest-environment jsdom */
import { act, fireEvent, screen, waitFor } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { renderApp } from '../../src/testing/render';
import { EditorPage } from '../../src/features/editor/EditorPage';
import { useDragState } from '../../src/features/editor/dragState';
import { useRoomStore } from '../../src/state/roomStore';
import type { RoomPlan } from '../../src/room/roomPlan';

// REQ-365: the 3D tab always shows the current room JSON. jsdom has no WebGL, so the scene builder is observed instead of pixels.
const mockBuilt: RoomPlan[] = [];
jest.mock('../../src/room3d/buildScene', () => {
  const actual = jest.requireActual('../../src/room3d/buildScene');
  return { ...actual, buildRoomScene: (plan: RoomPlan) => { mockBuilt.push(plan); return actual.buildRoomScene(plan); } };
});
jest.mock('three', () => {
  const actual = jest.requireActual('three');
  return {
    ...actual,
    WebGLRenderer: function WebGLRenderer(this: any) {
      this.domElement = document.createElement('canvas');
      this.setPixelRatio = jest.fn(); this.setSize = jest.fn(); this.setClearColor = jest.fn();
      this.render = jest.fn(); this.dispose = jest.fn();
    }
  };
});
jest.mock('three/examples/jsm/controls/OrbitControls.js', () => {
  const actual = jest.requireActual('three');
  return {
    OrbitControls: function OrbitControls(this: any, camera: any) {
      this.target = new actual.Vector3(); this.camera = camera;
      this.update = jest.fn(); this.dispose = jest.fn(); this.addEventListener = jest.fn();
    }
  };
});

afterEach(() => { useRoomStore.getState().reset(); useDragState.getState().reset(); mockBuilt.length = 0; });

const store = () => useRoomStore.getState();
const tab = (name: string) => screen.getByRole('tab', { name });
const lastBuilt = () => mockBuilt[mockBuilt.length - 1];
const open3d = () => fireEvent.click(tab('3D view'));
const open2d = () => fireEvent.click(tab('2D plan'));

function editor() {
  store().createRoom(14, 10);
  store().addItem('sofa', { x: 7, y: 2 });
  renderApp(<Routes><Route path="/editor" element={<EditorPage />} /></Routes>, { route: '/editor' });
}

describe('2D edits appear in 3D (REQ-365)', () => {
  it('shows an item added in 2D', () => {
    editor();
    act(() => { store().addItem('chair', { x: 12, y: 8 }); });
    open3d();
    expect(lastBuilt()).toBe(store().plan);
    expect(lastBuilt().items.map((i) => i.catalogId)).toEqual(['sofa', 'chair']);
    expect(screen.getByText('2 items, all white')).toBeTruthy();
  });

  it('shows a moved item', () => {
    editor();
    const id = store().plan!.items[0].id;
    act(() => { store().moveItem(id, { x: 4, y: 5 }); });
    open3d();
    expect(lastBuilt().items[0].position).toEqual(store().plan!.items[0].position);
    expect(lastBuilt().items[0].position).toEqual({ x: 4, y: 5 });
  });

  it('shows a rotated item', () => {
    editor();
    const id = store().plan!.items[0].id;
    act(() => { store().moveItem(id, { x: 7, y: 5 }); store().rotateItem(id, 90); });
    open3d();
    expect(lastBuilt().items[0].rotation).toBe(90);
  });

  it('no longer shows a deleted item', () => {
    editor();
    const id = store().plan!.items[0].id;
    act(() => { store().deleteItem(id); });
    open3d();
    expect(lastBuilt().items).toHaveLength(0);
    expect(screen.getByText('0 items, all white')).toBeTruthy();
  });

  it('shows the same design after switching tabs many times, with 2D unchanged', () => {
    editor();
    const before = JSON.stringify(store().plan);
    for (let i = 0; i < 3; i++) {
      open3d();
      expect(JSON.stringify(lastBuilt())).toBe(before);
      open2d();
      expect(JSON.stringify(store().plan)).toBe(before);
    }
  });

  it('builds a fresh scene from the changed plan each time (nothing is cached)', () => {
    editor();
    open3d();
    const first = lastBuilt();
    open2d();
    act(() => { store().addItem('table', { x: 7, y: 7 }); });
    open3d();
    expect(lastBuilt()).not.toBe(first);
    expect(lastBuilt().items).toHaveLength(2);
  });

  it('shows a design opened from a file, also while the 3D tab is open', async () => {
    editor();
    open3d();
    const other: RoomPlan = { ...store().plan!, items: [] };
    const text = JSON.stringify(other);
    const f = new File([text], 'other.json', { type: 'application/json' });
    Object.defineProperty(f, 'text', { value: async () => text });
    fireEvent.change(screen.getByTestId('upload-input'), { target: { files: [f] } });
    fireEvent.click(await screen.findByRole('button', { name: 'Replace' }));
    await waitFor(() => expect(screen.getByText('0 items, all white')).toBeTruthy());
    expect(lastBuilt().items).toHaveLength(0);
  });

  it('needs no extra control: the 3D panel only offers Reset view', () => {
    editor();
    open3d();
    const labels = screen.getAllByRole('button').map((b) => b.textContent);
    expect(labels).toEqual(expect.arrayContaining(['Reset view']));
    expect(labels.some((l) => /refresh|reload|update|sync|rotate|delete|add/i.test(l ?? ''))).toBe(false);
  });

  it('is view-only: clicking or typing in the 3D area changes nothing', () => {
    editor();
    open3d();
    const plan = store().plan;
    const canvas = screen.getByTestId('three-d-canvas');
    fireEvent.click(canvas); fireEvent.pointerDown(canvas); fireEvent.keyDown(canvas, { key: 'Delete' }); fireEvent.keyDown(document.body, { key: 'Delete' });
    expect(store().plan).toBe(plan);
    expect(store().plan!.items).toHaveLength(1);
    expect(screen.queryByRole('button', { name: /delete|rotate/i })).toBeNull();
  });
});
