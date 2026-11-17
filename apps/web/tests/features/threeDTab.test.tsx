/** @jest-environment jsdom */
import { fireEvent, screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { renderApp } from '../../src/testing/render';
import { EditorPage } from '../../src/features/editor/EditorPage';
import { NO_WEBGL_MESSAGE } from '../../src/features/editor/ThreeDView';
import { useDragState } from '../../src/features/editor/dragState';
import { useRoomStore } from '../../src/state/roomStore';

// jsdom has no WebGL and three's OrbitControls is an ES module: replace both with small fakes.
const mockRenderers: Array<{ render: jest.Mock; dispose: jest.Mock }> = [];
let mockWebGl = true;
jest.mock('three', () => {
  const actual = jest.requireActual('three');
  return {
    ...actual,
    WebGLRenderer: function WebGLRenderer(this: any) {
      if (!mockWebGl) throw new Error('no webgl');
      this.domElement = document.createElement('canvas');
      this.setPixelRatio = jest.fn(); this.setSize = jest.fn(); this.setClearColor = jest.fn();
      this.render = jest.fn(); this.dispose = jest.fn();
      mockRenderers.push(this);
    }
  };
});
const mockControls: any[] = [];
jest.mock('three/examples/jsm/controls/OrbitControls.js', () => {
  const actual = jest.requireActual('three');
  return {
    OrbitControls: function OrbitControls(this: any, camera: any) {
      this.target = new actual.Vector3(); this.camera = camera;
      this.update = jest.fn(); this.dispose = jest.fn(); this.addEventListener = jest.fn();
      mockControls.push(this);
    }
  };
});

afterEach(() => { useRoomStore.getState().reset(); useDragState.getState().reset(); mockRenderers.length = 0; mockControls.length = 0; mockWebGl = true; });

function editor() {
  const s = useRoomStore.getState();
  s.createRoom(12, 10);
  s.addItem('sofa', { x: 6, y: 2 });
  renderApp(<Routes><Route path="/editor" element={<EditorPage />} /></Routes>, { route: '/editor' });
}
const tab = (name: string) => screen.getByRole('tab', { name });

describe('3D tab (REQ-364)', () => {
  it('has the 3D tab enabled, and the 2D tab selected first', () => {
    editor();
    expect((tab('3D view') as HTMLButtonElement).disabled).toBe(false);
    expect(tab('2D plan').getAttribute('aria-selected')).toBe('true');
    expect(screen.queryByTestId('three-d-canvas')).toBeNull();
  });

  it('shows the 3D view with Reset view and the controls hint', () => {
    editor();
    fireEvent.click(tab('3D view'));
    expect(screen.getByTestId('three-d-canvas')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'Reset view' })).toBeTruthy();
    expect(screen.getByText(/drag = orbit/)).toBeTruthy();
    expect(screen.getByText('Walls 10 ft high')).toBeTruthy();
    expect(screen.getByText('1 items, all white')).toBeTruthy();
    expect(mockRenderers).toHaveLength(1);
  });

  it('starts from the start view every time, even after the camera was moved', () => {
    editor();
    fireEvent.click(tab('3D view'));
    const start = mockControls[0].camera.position.clone();
    mockControls[0].camera.position.set(100, 5, 100);
    fireEvent.click(tab('2D plan'));
    fireEvent.click(tab('3D view'));
    expect(mockControls).toHaveLength(2);
    expect(mockControls[1].camera.position.toArray()).toEqual(start.toArray());
  });

  it('Reset view returns the camera to the start view', () => {
    editor();
    fireEvent.click(tab('3D view'));
    const { camera, target } = mockControls[0];
    const start = camera.position.clone();
    camera.position.set(100, 5, 100);
    target.set(9, 9, 9);
    fireEvent.click(screen.getByRole('button', { name: 'Reset view' }));
    expect(camera.position.toArray()).toEqual(start.toArray());
    expect(target.x).toBeCloseTo(6);
  });

  it('frees the renderer when leaving the 3D tab, and the 2D plan is unchanged', () => {
    editor();
    const before = JSON.stringify(useRoomStore.getState().plan);
    fireEvent.click(tab('3D view'));
    fireEvent.click(tab('2D plan'));
    expect(mockRenderers[0].dispose).toHaveBeenCalled();
    expect(screen.queryByTestId('three-d-canvas')).toBeNull();
    expect(JSON.stringify(useRoomStore.getState().plan)).toBe(before);
    expect(tab('2D plan').getAttribute('aria-selected')).toBe('true');
  });

  it('shows a message instead of crashing when WebGL is not available', () => {
    mockWebGl = false;
    editor();
    fireEvent.click(tab('3D view'));
    expect(screen.getByRole('alert').textContent).toBe(NO_WEBGL_MESSAGE);
  });
});
