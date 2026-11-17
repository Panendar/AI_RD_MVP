/** @jest-environment node */
import { beforeAddItem, useRoomStore } from '../../src/state/roomStore';
import { checkRoomPlan } from '../../src/room/checkRoomPlan';

afterEach(() => { useRoomStore.getState().reset(); beforeAddItem.length = 0; });

describe('roomStore.addItem', () => {
  it('without a room adds nothing', () => {
    expect(useRoomStore.getState().addItem('sofa', { x: 5, y: 5 }).ok).toBe(false);
  });

  it('adds a white item at its catalog size, facing 0, where it was dropped', () => {
    useRoomStore.getState().createRoom(12, 10);
    const result = useRoomStore.getState().addItem('sofa', { x: 6.1, y: 4.6 });
    expect(result).toEqual({ ok: true, errors: [] });
    const plan = useRoomStore.getState().plan!;
    expect(plan.items).toEqual([{
      id: 'item-1',
      catalogId: 'sofa',
      name: 'Sofa (3 seat)',
      position: { x: 6, y: 4.5 },
      size: { width: 6.5, depth: 3.0, height: 2.75 },
      rotation: 0,
      colour: '#FFFFFF'
    }]);
    expect(checkRoomPlan(plan).ok).toBe(true);
  });

  it('numbers further items and keeps earlier ones', () => {
    useRoomStore.getState().createRoom(12, 10);
    useRoomStore.getState().addItem('chair', { x: 2, y: 2 });
    useRoomStore.getState().addItem('tv', { x: 8, y: 8 });
    expect(useRoomStore.getState().plan!.items.map((i) => i.id)).toEqual(['item-1', 'item-2']);
  });

  it('a drop outside the room, an unknown item or a bed that does not fit changes nothing', () => {
    useRoomStore.getState().createRoom(12, 6);
    const before = useRoomStore.getState().plan;
    expect(useRoomStore.getState().addItem('sofa', { x: -1, y: 3 }).ok).toBe(false);
    expect(useRoomStore.getState().addItem('lamp', { x: 3, y: 3 }).ok).toBe(false);
    expect(useRoomStore.getState().addItem('bed', { x: 6, y: 3 }).ok).toBe(false);
    expect(useRoomStore.getState().plan).toBe(before);
  });

  it('a guard (REQ-366 hook) can stop the add', () => {
    useRoomStore.getState().createRoom(12, 10);
    beforeAddItem.push(() => false);
    expect(useRoomStore.getState().addItem('sofa', { x: 6, y: 5 }).ok).toBe(false);
    expect(useRoomStore.getState().plan!.items).toEqual([]);
  });
});
