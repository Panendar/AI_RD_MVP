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

describe('checkRoomPlan item rules (REQ-359)', () => {
  const sofa = (over: Record<string, unknown> = {}) => ({
    id: 'item-1', catalogId: 'sofa', name: 'Sofa (3 seat)', position: { x: 6, y: 5 },
    size: { width: 6.5, depth: 3.0, height: 2.75 }, rotation: 0, colour: '#FFFFFF', ...over
  });
  const withItems = (...items: unknown[]) => ({ ...clone(createRoomPlan(12, 10)), items });

  it('a plan with a valid item passes', () => {
    expect(checkRoomPlan(withItems(sofa()))).toEqual({ ok: true, errors: [] });
  });

  it('duplicated item ids fail rule 2', () => {
    const r = checkRoomPlan(withItems(sofa(), sofa({ position: { x: 6, y: 1.5 } })));
    expect(r.ok).toBe(false);
    expect(r.errors.join(' ')).toMatch(/used more than once/);
  });

  it('an item crossing a wall fails rule 3, also after rotation', () => {
    expect(checkRoomPlan(withItems(sofa({ position: { x: 2, y: 5 } }))).errors.join(' ')).toMatch(/crosses a wall/);
    expect(checkRoomPlan(withItems(sofa({ position: { x: 6, y: 2 }, rotation: 90 }))).errors.join(' ')).toMatch(/crosses a wall/);
    expect(checkRoomPlan(withItems(sofa({ position: { x: 3.25, y: 1.5 } }))).ok).toBe(true);
  });

  it('an item not at its catalog size fails rule 4', () => {
    const r = checkRoomPlan(withItems(sofa({ size: { width: 6, depth: 3.0, height: 2.75 } })));
    expect(r.errors.join(' ')).toMatch(/catalog size/);
  });

  it('the schema rejects a colour other than white', () => {
    expect(checkRoomPlan(withItems(sofa({ colour: '#FF0000' }))).ok).toBe(false);
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
    expect(actions).toEqual(['addItem', 'beginChange', 'cancelPending', 'confirmPending', 'createRoom', 'deleteItem', 'dismissNotice', 'moveItem', 'reset', 'rotateItem', 'rotateItemStep', 'settleChange']);
  });
});
