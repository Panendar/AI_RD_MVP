// Jest stand-in for three's OrbitControls (an ES module jest cannot load, and jsdom has no WebGL anyway).
// Tests that need to observe the controls replace it with jest.mock.
export class OrbitControls {
  target = { x: 0, y: 0, z: 0, copy() { return this; } };
  enableDamping = false;
  minDistance = 0;
  maxDistance = 0;
  maxPolarAngle = 0;
  constructor(public camera?: unknown, public domElement?: unknown) {}
  update() {}
  dispose() {}
  addEventListener() {}
}
