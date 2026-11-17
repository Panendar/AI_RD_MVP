// REQ-364: simple white 3D shapes for the catalog items. Each shape stands on the floor, is centred on its footprint,
// has its front toward +z, and fits exactly inside the item's width (x) x depth (z) x height (y) from the catalog.
import * as THREE from 'three';
import type { CatalogId } from '../room/roomPlan';

export interface ItemSize { width: number; depth: number; height: number }

const WHITE = '#FFFFFF';
export const OUTLINE_COLOUR = '#555555';
export const SHADING_MATERIAL = new THREE.MeshStandardMaterial({ color: WHITE, roughness: 0.9, metalness: 0 });
const OUTLINE_MATERIAL = new THREE.LineBasicMaterial({ color: OUTLINE_COLOUR });

// A box from min/max corners (in the item's own frame: x and z from the centre, y from the floor), with an outline.
function part(g: THREE.Group, x0: number, x1: number, y0: number, y1: number, z0: number, z1: number): void {
  const geo = new THREE.BoxGeometry(x1 - x0, y1 - y0, z1 - z0);
  const mesh = new THREE.Mesh(geo, SHADING_MATERIAL);
  mesh.position.set((x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2);
  mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), OUTLINE_MATERIAL));
  g.add(mesh);
}

type Builder = (g: THREE.Group, w: number, d: number, h: number) => void;

const BUILDERS: Record<CatalogId, Builder> = {
  bed(g, w, d, h) {
    const x = w / 2, z = d / 2;
    part(g, -x, x, 0, h * 0.4, -z, z);                                    // frame
    part(g, -x + 0.1, x - 0.1, h * 0.4, h * 0.7, -z + 0.3, z - 0.1);      // mattress
    part(g, -x, x, h * 0.4, h, -z, -z + 0.3);                             // headboard at the back (-z)
    part(g, -x + 0.4, -0.2, h * 0.7, h * 0.85, -z + 0.4, -z + 1.4);       // pillows
    part(g, 0.2, x - 0.4, h * 0.7, h * 0.85, -z + 0.4, -z + 1.4);
  },
  sofa(g, w, d, h) {
    const x = w / 2, z = d / 2, arm = Math.min(0.6, w / 8);
    part(g, -x, x, 0, h * 0.4, -z, z);                                    // base
    part(g, -x + arm, x - arm, h * 0.4, h * 0.6, -z + 0.8, z);            // seat cushions
    part(g, -x, x, h * 0.4, h, -z, -z + 0.8);                             // back
    part(g, -x, -x + arm, h * 0.4, h * 0.75, -z + 0.8, z);                // arms
    part(g, x - arm, x, h * 0.4, h * 0.75, -z + 0.8, z);
  },
  table(g, w, d, h) {
    const x = w / 2, z = d / 2, t = 0.15, top = 0.2;
    part(g, -x, x, h - top, h, -z, z);                                    // top
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      part(g, sx < 0 ? -x + 0.1 : x - 0.1 - t, sx < 0 ? -x + 0.1 + t : x - 0.1, 0, h - top,
        sz < 0 ? -z + 0.1 : z - 0.1 - t, sz < 0 ? -z + 0.1 + t : z - 0.1);
    }
  },
  chair(g, w, d, h) {
    const x = w / 2, z = d / 2, t = 0.12, seat = h * 0.5;
    part(g, -x, x, seat - 0.15, seat, -z, z);                             // seat
    part(g, -x, x, seat, h, -z, -z + 0.15);                               // back at -z, seat faces +z
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      part(g, sx < 0 ? -x : x - t, sx < 0 ? -x + t : x, 0, seat - 0.15, sz < 0 ? -z : z - t, sz < 0 ? -z + t : z);
    }
  },
  tv(g, w, d, h) {
    const x = w / 2, z = d / 2, p = Math.min(0.1, z / 2);
    part(g, -x, x, 0, h * 0.4, -z, z);                                    // stand
    part(g, -x, x, h * 0.4, h, -p, p);                                    // thin screen panel
    part(g, -x * 0.9, x * 0.9, h * 0.45, h * 0.95, p, p * 2);             // screen face on the front (+z)
  },
  locker(g, w, d, h) {
    const x = w / 2, z = d / 2;
    part(g, -x, x, 0, h, -z, z - 0.05);                                   // body
    part(g, -x + 0.1, -0.02, 0.2, h - 0.2, z - 0.05, z);                  // left door (+z front)
    part(g, 0.02, x - 0.1, 0.2, h - 0.2, z - 0.05, z);                    // right door
  }
};

// The shape for one catalog item; an unknown catalog id falls back to a plain box.
export function buildItemShape(catalogId: string, size: ItemSize): THREE.Group {
  const g = new THREE.Group();
  const builder = (BUILDERS as Record<string, Builder | undefined>)[catalogId];
  if (builder) builder(g, size.width, size.depth, size.height);
  else part(g, -size.width / 2, size.width / 2, 0, size.height, -size.depth / 2, size.depth / 2);
  return g;
}
