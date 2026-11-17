// REQ-364: builds the 3D room from the room JSON. Pure: no renderer, no store.
// Plan to scene: scene X = plan x, scene Z = plan y, scene Y = up. The plan origin (top-left) is the scene origin.
// An item faces +z (the bottom wall) at rotation 0; rotation is clockwise in the plan, so the scene Y rotation is -rotation.
import * as THREE from 'three';
import type { RoomPlan } from '../room/roomPlan';
import { OUTLINE_COLOUR, SHADING_MATERIAL, buildItemShape } from './shapes';

function box(sx: number, sy: number, sz: number, x: number, y: number, z: number): THREE.Mesh {
  const geo = new THREE.BoxGeometry(sx, sy, sz);
  const mesh = new THREE.Mesh(geo, SHADING_MATERIAL);
  mesh.position.set(x, y, z);
  mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: OUTLINE_COLOUR })));
  return mesh;
}

export function buildRoomScene(plan: RoomPlan): THREE.Group {
  const { width, length, height } = plan.room;
  const root = new THREE.Group();

  const floor = box(width, 0.05, length, width / 2, -0.025, length / 2);
  floor.name = 'floor';
  root.add(floor);

  // Walls are one-sided panels on the room edge, facing into the room: seen from outside they are see-through, so the near
  // walls never hide the items (the start view looks in from above the bottom-left corner); seen from inside they are solid.
  const wallMaterial = new THREE.MeshStandardMaterial({ color: '#FFFFFF', roughness: 0.9, metalness: 0, side: THREE.FrontSide });
  // [name, panel length, x, z, rotation about the vertical axis so the front face looks into the room]
  const walls: Array<[string, number, number, number, number]> = [
    ['top', width, width / 2, 0, 0],
    ['bottom', width, width / 2, length, Math.PI],
    ['left', length, 0, length / 2, Math.PI / 2],
    ['right', length, width, length / 2, -Math.PI / 2]
  ];
  for (const [name, span, x, z, rotY] of walls) {
    const geo = new THREE.PlaneGeometry(span, height);
    const wall = new THREE.Mesh(geo, wallMaterial);
    wall.position.set(x, height / 2, z);
    wall.rotation.y = rotY;
    wall.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: OUTLINE_COLOUR })));
    wall.name = `wall-${name}`;
    root.add(wall);
  }

  for (const item of plan.items) {
    const shape = buildItemShape(item.catalogId, item.size);
    shape.name = `item-${item.id}`;
    shape.position.set(item.position.x, 0, item.position.y);
    shape.rotation.y = -(item.rotation * Math.PI) / 180;
    root.add(shape);
  }
  return root;
}
