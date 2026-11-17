// REQ-364: the one fixed start view: from above the bottom-left corner of the plan, looking toward the top-right corner,
// about 45 deg down, far enough that the whole room is in view. Used on every open and by Reset view.
import * as THREE from 'three';
import { WALL_HEIGHT_FT } from '../room/roomPlan';

export const FOV_DEG = 45;
export const PITCH_DEG = 45;

export function computeStartView(width: number, length: number, aspect = 1.5): { position: THREE.Vector3; target: THREE.Vector3 } {
  const target = new THREE.Vector3(width / 2, WALL_HEIGHT_FT / 2, length / 2);
  const radius = 0.5 * Math.sqrt(width * width + length * length + WALL_HEIGHT_FT * WALL_HEIGHT_FT);
  const vHalf = (FOV_DEG * Math.PI) / 360;
  const hHalf = Math.atan(Math.tan(vHalf) * aspect);
  const distance = (radius / Math.sin(Math.min(vHalf, hHalf))) * 1.05;
  // Horizontal direction from the bottom-left corner (0, length) toward the top-right corner (width, 0).
  const dir = new THREE.Vector3(width, 0, -length).normalize();
  const pitch = (PITCH_DEG * Math.PI) / 180;
  const position = target.clone()
    .addScaledVector(dir, -distance * Math.cos(pitch))
    .add(new THREE.Vector3(0, distance * Math.sin(pitch), 0));
  return { position, target };
}
