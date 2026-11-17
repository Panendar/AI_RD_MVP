// Upload JSON (REQ-363): reads a chosen file and says whether it is a valid room design. Pure TypeScript: no React, no store.
// The UI only learns pass or fail: the failing field or rule is never shown (one general message).
import { checkRoomPlan } from './checkRoomPlan';
import { measurePair } from './clearance';
import type { RoomPlan } from './roomPlan';

export const MAX_UPLOAD_BYTES = 1_048_576;   // 1 MB
export const INVALID_FILE_MESSAGE = 'This file is not a valid room design.';

export interface UploadFile { size: number; text(): Promise<string> }

export type OpenResult =
  | { ok: true; plan: RoomPlan }
  | { ok: false; errors: string[] };   // errors are for tests and logs, not for the user

// Rule 5 of the business rules: no two items overlap. Touching (under 0.01 ft) and items closer than 1.5 ft are valid.
function overlaps(plan: RoomPlan): string[] {
  const errors: string[] = [];
  for (let i = 0; i < plan.items.length; i++) {
    for (let j = i + 1; j < plan.items.length; j++) {
      if (measurePair(plan.items[i], plan.items[j]).kind === 'overlap') {
        errors.push(`${plan.items[i].name} (${plan.items[i].id}) overlaps ${plan.items[j].name} (${plan.items[j].id}).`);
      }
    }
  }
  return errors;
}

export async function openRoomPlan(file: UploadFile): Promise<OpenResult> {
  if (file.size > MAX_UPLOAD_BYTES) return { ok: false, errors: ['The file is larger than 1 MB.'] };
  let parsed: unknown;
  try {
    parsed = JSON.parse(await file.text());
  } catch {
    return { ok: false, errors: ['The file is not valid JSON.'] };
  }
  const check = checkRoomPlan(parsed);
  if (!check.ok) return { ok: false, errors: check.errors };
  const plan = parsed as RoomPlan;
  const overlap = overlaps(plan);
  if (overlap.length > 0) return { ok: false, errors: overlap };
  return { ok: true, plan };
}
