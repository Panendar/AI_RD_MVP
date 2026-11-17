import * as THREE from 'three';
import { FOV_DEG, PITCH_DEG, computeStartView } from '../../src/room3d/startView';

describe('start view (REQ-364)', () => {
  it.each([[6, 6], [12, 10], [30, 30], [30, 6]])('shows the whole %s x %s ft room (walls included)', (w, l) => {
    const aspect = 1.6;
    const { position, target } = computeStartView(w, l, aspect);
    const cam = new THREE.PerspectiveCamera(FOV_DEG, aspect, 0.1, 500);
    cam.position.copy(position);
    cam.lookAt(target);
    cam.updateMatrixWorld(true);
    cam.updateProjectionMatrix();
    for (const x of [0, w]) for (const z of [0, l]) for (const y of [0, 10]) {
      const p = new THREE.Vector3(x, y, z).project(cam);
      expect(Math.abs(p.x)).toBeLessThanOrEqual(1);
      expect(Math.abs(p.y)).toBeLessThanOrEqual(1);
      expect(p.z).toBeLessThan(1);
    }
  });

  it('is on the bottom-left side, above the floor, looking toward the top-right about 45 deg down', () => {
    const { position, target } = computeStartView(12, 10);
    expect(position.x).toBeLessThan(target.x);   // left of the centre
    expect(position.z).toBeGreaterThan(target.z); // toward the bottom wall
    expect(position.y).toBeGreaterThan(10);
    const dir = target.clone().sub(position).normalize();
    expect((Math.asin(-dir.y) * 180) / Math.PI).toBeCloseTo(PITCH_DEG);
    expect(dir.x).toBeGreaterThan(0);
    expect(dir.z).toBeLessThan(0);
  });

  it('is always the same for the same room', () => {
    expect(computeStartView(12, 10).position.toArray()).toEqual(computeStartView(12, 10).position.toArray());
  });
});
