import { checkRoomPlan } from '../../src/room/checkRoomPlan';
import { DOWNLOAD_FILE_NAME, EMPTY_ROOM_MESSAGE, prepareDownload } from '../../src/room/exportRoomPlan';
import { useRoomStore } from '../../src/state/roomStore';

afterEach(() => useRoomStore.getState().reset());

function planWithItems() {
  useRoomStore.getState().createRoom(12, 10);
  useRoomStore.getState().addItem('sofa', { x: 6, y: 5 });
  return useRoomStore.getState().plan!;
}

describe('prepareDownload (REQ-362)', () => {
  it('uses the fixed file name', () => expect(DOWNLOAD_FILE_NAME).toBe('room_type.json'));

  it('refuses an empty room with the message', () => {
    useRoomStore.getState().createRoom(12, 10);
    const r = prepareDownload(useRoomStore.getState().plan!);
    expect(r).toEqual({ ok: false, reason: 'empty', errors: [EMPTY_ROOM_MESSAGE] });
  });

  it('returns the full design as JSON that parses back and passes the checks', () => {
    const plan = planWithItems();
    const r = prepareDownload(plan);
    expect(r.ok).toBe(true);
    if (r.ok) {
      const parsed = JSON.parse(r.json);
      expect(parsed).toEqual(plan);
      expect(parsed.schemaVersion).toBe('1.0');
      expect(Object.keys(parsed.items[0])).toEqual(expect.arrayContaining(['id', 'catalogId', 'name', 'position', 'size', 'rotation', 'colour']));
      expect(checkRoomPlan(parsed).ok).toBe(true);
    }
  });

  it('refuses a plan that fails the checks', () => {
    const plan = planWithItems();
    const bad = { ...plan, items: [{ ...plan.items[0], position: { x: 99, y: 5 } }] };
    const r = prepareDownload(bad);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.reason).toBe('invalid');
  });
});
