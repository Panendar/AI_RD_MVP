// Download JSON (REQ-362): turns the current room plan into the file text, or says why it cannot be downloaded.
import { checkRoomPlan } from './checkRoomPlan';
import type { RoomPlan } from './roomPlan';

export const DOWNLOAD_FILE_NAME = 'room_type.json';
export const EMPTY_ROOM_MESSAGE = 'Add objects and plan your room before downloading.';

export type PrepareResult =
  | { ok: true; json: string }
  | { ok: false; reason: 'empty' | 'invalid'; errors: string[] };

export function prepareDownload(plan: RoomPlan): PrepareResult {
  if (plan.items.length === 0) return { ok: false, reason: 'empty', errors: [EMPTY_ROOM_MESSAGE] };
  const check = checkRoomPlan(plan);
  if (!check.ok) return { ok: false, reason: 'invalid', errors: check.errors };
  return { ok: true, json: JSON.stringify(plan, null, 2) };
}
