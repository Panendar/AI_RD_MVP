import { INVALID_FILE_MESSAGE, MAX_UPLOAD_BYTES, openRoomPlan } from '../../src/room/openRoomPlan';
import { prepareDownload } from '../../src/room/exportRoomPlan';
import type { RoomPlan } from '../../src/room/roomPlan';
import { useRoomStore } from '../../src/state/roomStore';

afterEach(() => useRoomStore.getState().reset());

// A sofa at the top and a table far below it (gap well over 1.5 ft).
function twoItemPlan(): RoomPlan {
  useRoomStore.getState().createRoom(12, 10);
  useRoomStore.getState().addItem('sofa', { x: 6, y: 2 });
  useRoomStore.getState().addItem('table', { x: 6, y: 8 });
  return useRoomStore.getState().plan!;
}

const withTableAt = (plan: RoomPlan, y: number): RoomPlan => ({
  ...plan,
  items: plan.items.map((it) => (it.catalogId === 'table' ? { ...it, position: { x: 6, y } } : it))
});

const file = (text: string, size = text.length) => ({ size, text: async () => text });
const fileOf = (plan: unknown) => file(JSON.stringify(plan));

describe('openRoomPlan (REQ-363)', () => {
  it('has the 1 MB limit and the general message', () => {
    expect(MAX_UPLOAD_BYTES).toBe(1024 * 1024);
    expect(INVALID_FILE_MESSAGE).toBe('This file is not a valid room design.');
  });

  it('opens a file made by Download JSON to the same plan', async () => {
    const plan = twoItemPlan();
    const downloaded = prepareDownload(plan);
    if (!downloaded.ok) throw new Error('download refused');
    const r = await openRoomPlan(file(downloaded.json));
    expect(r).toEqual({ ok: true, plan });
  });

  it('rejects a file over 1 MB without reading it', async () => {
    const text = jest.fn(async () => '{}');
    const r = await openRoomPlan({ size: MAX_UPLOAD_BYTES + 1, text });
    expect(r.ok).toBe(false);
    expect(text).not.toHaveBeenCalled();
  });

  it('accepts a file of exactly 1 MB that is otherwise valid', async () => {
    const plan = twoItemPlan();
    const r = await openRoomPlan(file(JSON.stringify(plan), MAX_UPLOAD_BYTES));
    expect(r.ok).toBe(true);
  });

  it('rejects text that is not JSON', async () => {
    expect((await openRoomPlan(file('not json'))).ok).toBe(false);
  });

  it('rejects a schema failure', async () => {
    const plan = twoItemPlan();
    expect((await openRoomPlan(fileOf({ ...plan, schemaVersion: '9.9' }))).ok).toBe(false);
    expect((await openRoomPlan(fileOf({ units: 'ft' }))).ok).toBe(false);
  });

  it('rejects walls that do not match the room', async () => {
    const plan = twoItemPlan();
    const bad = { ...plan, room: { ...plan.room, width: 14 } };
    expect((await openRoomPlan(fileOf(bad))).ok).toBe(false);
  });

  it('rejects duplicate item ids', async () => {
    const plan = twoItemPlan();
    const bad = { ...plan, items: plan.items.map((it) => ({ ...it, id: plan.items[0].id })) };
    expect((await openRoomPlan(fileOf(bad))).ok).toBe(false);
  });

  it('rejects an item outside the walls', async () => {
    const plan = twoItemPlan();
    const bad = withTableAt(plan, 99);
    expect((await openRoomPlan(fileOf(bad))).ok).toBe(false);
  });

  it('rejects a size that does not match the catalog', async () => {
    const plan = twoItemPlan();
    const bad = { ...plan, items: plan.items.map((it, i) => (i === 0 ? { ...it, size: { ...it.size, width: 1 } } : it)) };
    expect((await openRoomPlan(fileOf(bad))).ok).toBe(false);
  });

  it('rejects two overlapping items', async () => {
    const plan = twoItemPlan();
    const r = await openRoomPlan(fileOf(withTableAt(plan, 3)));   // table y 1.75..4.25 inside the sofa 0.5..3.5
    expect(r.ok).toBe(false);
  });

  it('accepts items that touch and items closer than 1.5 ft', async () => {
    const plan = twoItemPlan();
    expect((await openRoomPlan(fileOf(withTableAt(plan, 4.75)))).ok).toBe(true);   // sofa ends 3.5, table starts 3.5: touching
    expect((await openRoomPlan(fileOf(withTableAt(plan, 5)))).ok).toBe(true);      // gap 0.25 ft
  });
});
