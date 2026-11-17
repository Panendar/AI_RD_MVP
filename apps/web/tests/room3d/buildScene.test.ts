import * as THREE from 'three';
import { buildRoomScene } from '../../src/room3d/buildScene';
import { buildItemShape } from '../../src/room3d/shapes';
import { CATALOG } from '../../src/room/catalog';
import { createRoomPlan, type Item, type RoomPlan } from '../../src/room/roomPlan';

const sizeOf = (id: string) => {
  const e = (CATALOG as unknown as Array<{ id?: string; catalogId?: string; width: number; depth: number; height: number }>)
    .find((c) => (c.id ?? c.catalogId) === id)!;
  return { width: e.width, depth: e.depth, height: e.height };
};

function item(catalogId: Item['catalogId'], x: number, y: number, rotation = 0, id = `i-${catalogId}`): Item {
  return { id, catalogId, name: catalogId, position: { x, y }, size: sizeOf(catalogId), rotation, colour: '#FFFFFF' };
}
const planWith = (items: Item[], w = 12, l = 10): RoomPlan => ({ ...createRoomPlan(w, l), items });
const bounds = (o: THREE.Object3D) => new THREE.Box3().setFromObject(o);

describe('buildRoomScene (REQ-364)', () => {
  it('builds a floor of the room size and four 10 ft walls', () => {
    const root = buildRoomScene(planWith([]));
    const floor = bounds(root.getObjectByName('floor')!);
    expect(floor.max.x - floor.min.x).toBeCloseTo(12);
    expect(floor.max.z - floor.min.z).toBeCloseTo(10);
    for (const n of ['top', 'right', 'bottom', 'left']) {
      const b = bounds(root.getObjectByName(`wall-${n}`)!);
      expect(b.max.y - b.min.y).toBeCloseTo(10);
    }
  });

  it('has one object per item, standing on the floor with the catalog footprint and height', () => {
    const items = (['bed', 'sofa', 'table', 'chair', 'tv', 'locker'] as const).map((c, i) => item(c, 6, 5, 0, `i${i}`));
    const root = buildRoomScene(planWith(items, 20, 20));
    for (const it of items) {
      const b = bounds(root.getObjectByName(`item-${it.id}`)!);
      expect(b.min.y).toBeCloseTo(0);
      expect(b.max.y - b.min.y).toBeCloseTo(it.size.height);
      expect(b.max.x - b.min.x).toBeCloseTo(it.size.width);
      expect(b.max.z - b.min.z).toBeCloseTo(it.size.depth);
      expect((b.min.x + b.max.x) / 2).toBeCloseTo(6);
      expect((b.min.z + b.max.z) / 2).toBeCloseTo(5);
    }
  });

  it('swaps width and depth at 90 and 270 degrees and keeps them at 180', () => {
    const sofa = sizeOf('sofa');
    for (const [rot, w, d] of [[0, sofa.width, sofa.depth], [90, sofa.depth, sofa.width], [180, sofa.width, sofa.depth], [270, sofa.depth, sofa.width]]) {
      const b = bounds(buildRoomScene(planWith([item('sofa', 6, 5, rot, 's')])).getObjectByName('item-s')!);
      expect(b.max.x - b.min.x).toBeCloseTo(w);
      expect(b.max.z - b.min.z).toBeCloseTo(d);
    }
  });

  it('turns the front clockwise as in the plan: 0 faces the bottom wall (+z), 90 the left wall (-x)', () => {
    const front = (rot: number) => {
      const shape = buildRoomScene(planWith([item('tv', 6, 5, rot, 't')])).getObjectByName('item-t')!;
      shape.updateMatrixWorld(true);
      return new THREE.Vector3(0, 0, 1).transformDirection(shape.matrixWorld);
    };
    expect(front(0).z).toBeCloseTo(1);
    expect(front(90).x).toBeCloseTo(-1);
    expect(front(180).z).toBeCloseTo(-1);
    expect(front(270).x).toBeCloseTo(1);
  });

  it('draws everything white, ignoring the item colour, with outlines on every mesh', () => {
    const odd = { ...item('bed', 4, 4, 0, 'b'), colour: '#FF0000' } as unknown as Item;
    const root = buildRoomScene(planWith([odd]));
    let meshes = 0;
    root.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        meshes++;
        expect((o.material as THREE.MeshStandardMaterial).color.getHexString()).toBe('ffffff');
        expect(o.children.some((c) => c instanceof THREE.LineSegments)).toBe(true);
      }
    });
    expect(meshes).toBeGreaterThan(5);
  });

  it('falls back to a plain box for an unknown catalog id', () => {
    const g = buildItemShape('mystery', { width: 2, depth: 3, height: 4 });
    expect(g.children).toHaveLength(1);
    const b = bounds(g);
    expect([b.max.x - b.min.x, b.max.y - b.min.y, b.max.z - b.min.z]).toEqual([2, 4, 3].map((n) => expect.closeTo(n)));
  });
});

describe('item shapes', () => {
  it.each(['bed', 'sofa', 'table', 'chair', 'tv', 'locker'])('%s is made of several parts and fits its catalog size', (id) => {
    const size = sizeOf(id);
    const g = buildItemShape(id, size);
    expect(g.children.length).toBeGreaterThan(1);
    const b = bounds(g);
    expect(b.max.x - b.min.x).toBeCloseTo(size.width);
    expect(b.max.y - b.min.y).toBeCloseTo(size.height);
    expect(b.max.z - b.min.z).toBeCloseTo(size.depth);
    expect(b.min.y).toBeCloseTo(0);
  });
});
