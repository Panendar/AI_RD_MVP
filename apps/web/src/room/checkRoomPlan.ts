// Full check of a room plan: the JSON Schema (v1.0) first, then the business rules of room-plan-schema.md.
// Rules 1 to 4 are here; rule 5 (clearance between items) is appended to `rules` by REQ-366.
import Ajv2020, { type ValidateFunction } from 'ajv/dist/2020';
import schema from './room-plan.schema.json';
import { rectangleWalls, type RoomPlan } from './roomPlan';
import { getCatalogEntry } from './catalog';
import { footprintBounds } from './placement';

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

// Rule 2: item ids are unique.
export const uniqueItemIds: Rule = (plan) => {
  const seen = new Set<string>();
  const errors: string[] = [];
  for (const it of plan.items) {
    if (seen.has(it.id)) errors.push(`Item id "${it.id}" is used more than once.`);
    seen.add(it.id);
  }
  return errors;
};

// Rule 3: every item's footprint, after rotation, lies inside the walls.
export const itemsInsideWalls: Rule = (plan) => {
  const tol = 1e-6;
  return plan.items
    .filter((it) => {
      const b = footprintBounds(it);
      return b.minX < -tol || b.minY < -tol || b.maxX > plan.room.width + tol || b.maxY > plan.room.length + tol;
    })
    .map((it) => `${it.name} (${it.id}) crosses a wall.`);
};

// Rule 4: every item's size matches its catalog entry.
export const sizeMatchesCatalog: Rule = (plan) => plan.items
  .filter((it) => {
    const e = getCatalogEntry(it.catalogId);
    return !e || e.width !== it.size.width || e.depth !== it.size.depth || e.height !== it.size.height;
  })
  .map((it) => `${it.name} (${it.id}) does not have its catalog size.`);

// Rule 5 (clearance between items) is added by REQ-366.
export const rules: Rule[] = [wallsMatchRoom, uniqueItemIds, itemsInsideWalls, sizeMatchesCatalog];

export function checkRoomPlan(plan: unknown): CheckResult {
  if (!validateSchema(plan)) {
    const errors = (validateSchema.errors ?? []).map((e) => `${e.instancePath || '(root)'} ${e.message ?? 'is invalid'}`);
    return { ok: false, errors };
  }
  const errors = rules.flatMap((rule) => rule(plan));
  return { ok: errors.length === 0, errors };
}
