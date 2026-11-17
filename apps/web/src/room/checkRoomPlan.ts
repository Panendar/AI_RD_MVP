// Full check of a room plan: the JSON Schema (v1.0) first, then the business rules of room-plan-schema.md.
// Rule 1 (walls match the room) is here; rules 2 to 5 concern items and are appended to `rules` by later stories.
import Ajv2020, { type ValidateFunction } from 'ajv/dist/2020';
import schema from './room-plan.schema.json';
import { rectangleWalls, type RoomPlan } from './roomPlan';

export interface CheckResult { ok: boolean; errors: string[] }
export type Rule = (plan: RoomPlan) => string[];

const ajv = new Ajv2020({ allErrors: true });
const validateSchema = ajv.compile(schema) as ValidateFunction<RoomPlan>;

// Rule 1: the walls form the rectangle (0,0)-(width,length), clockwise top, right, bottom, left.
export const wallsMatchRoom: Rule = (plan) => {
  const expected = rectangleWalls(plan.room.width, plan.room.length);
  const byId = new Map(plan.room.walls.map((w) => [w.id, w]));
  const errors: string[] = [];
  if (byId.size !== expected.length) errors.push('The room must have one each of the top, right, bottom and left walls.');
  for (const e of expected) {
    const w = byId.get(e.id);
    if (!w) continue;
    const same = w.from.x === e.from.x && w.from.y === e.from.y && w.to.x === e.to.x && w.to.y === e.to.y;
    if (!same) errors.push(`The ${e.id} wall does not match the room size ${plan.room.width} x ${plan.room.length} ft.`);
  }
  return errors;
};

export const rules: Rule[] = [wallsMatchRoom];

export function checkRoomPlan(plan: unknown): CheckResult {
  if (!validateSchema(plan)) {
    const errors = (validateSchema.errors ?? []).map((e) => `${e.instancePath || '(root)'} ${e.message ?? 'is invalid'}`);
    return { ok: false, errors };
  }
  const errors = rules.flatMap((rule) => rule(plan));
  return { ok: errors.length === 0, errors };
}
