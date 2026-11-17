/** @jest-environment node */
import { checkRoomPlan } from '../../src/room/checkRoomPlan';
import { createRoomPlan } from '../../src/room/roomPlan';
import { useRoomStore } from '../../src/state/roomStore';

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

describe('checkRoomPlan', () => {
  it('a created 12 x 10 plan passes', () => {
    expect(checkRoomPlan(createRoomPlan(12, 10))).toEqual({ ok: true, errors: [] });
  });

  it('a wall that does not match the room fails rule 1', () => {
    const plan = clone(createRoomPlan(12, 10));
    plan.room.walls[1].to.y = 9;
    const result = checkRoomPlan(plan);
    expect(result.ok).toBe(false);
    expect(result.errors.join(' ')).toMatch(/right wall does not match/);
  });

  it('duplicated wall ids fail rule 1', () => {
    const plan = clone(createRoomPlan(12, 10));
    plan.room.walls[3] = clone(plan.room.walls[0]);
    expect(checkRoomPlan(plan).ok).toBe(false);
  });

  it.each([
    ['a size out of range', (p: any) => { p.room.width = 31; }],
    ['a size off the 0.25 step', (p: any) => { p.room.length = 10.1; }],
    ['another wall height', (p: any) => { p.room.height = 9; }],
    ['another schema version', (p: any) => { p.schemaVersion = '2.0'; }],
    ['an unknown field', (p: any) => { p.extra = true; }],
    ['three walls', (p: any) => { p.room.walls.pop(); }]
  ])('the schema rejects %s', (_name, mutate) => {
    const plan = clone(createRoomPlan(12, 10));
    mutate(plan);
    const result = checkRoomPlan(plan);
    expect(result.ok).toBe(false);
    expect(result.errors.length).toBeGreaterThan(0);
  });

  it('rejects something that is not a plan at all', () => {
    expect(checkRoomPlan(null).ok).toBe(false);
  });
});

describe('room store', () => {
  afterEach(() => useRoomStore.getState().reset());

  it('starts empty and createRoom keeps a checked plan', () => {
    expect(useRoomStore.getState().plan).toBeNull();
    expect(useRoomStore.getState().createRoom(12, 10)).toEqual([]);
    expect(useRoomStore.getState().plan).toEqual(createRoomPlan(12, 10));
  });

  it('an invalid size is not stored', () => {
    expect(useRoomStore.getState().createRoom(5, 10).length).toBeGreaterThan(0);
    expect(useRoomStore.getState().plan).toBeNull();
  });

  it('offers no action that changes the room size', () => {
    const actions = Object.entries(useRoomStore.getState()).filter(([, v]) => typeof v === 'function').map(([k]) => k).sort();
    expect(actions).toEqual(['createRoom', 'reset']);
  });
});
