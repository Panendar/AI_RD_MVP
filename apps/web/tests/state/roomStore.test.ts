/** @jest-environment node */
import { beforeAddItem, beforeMoveItem, beforeRotateItem, useRoomStore } from '../../src/state/roomStore';
import { checkRoomPlan } from '../../src/room/checkRoomPlan';

afterEach(() => { useRoomStore.getState().reset(); beforeAddItem.length = 0; beforeMoveItem.length = 0; beforeRotateItem.length = 0; });

describe('roomStore.rotateItem and deleteItem (REQ-361)', () => {
  const setup = (at = { x: 6, y: 5 }) => {
    useRoomStore.getState().createRoom(12, 10);
    useRoomStore.getState().addItem('sofa', at);
    return () => useRoomStore.getState().plan!.items[0];
  };

  it('rotates in 10 degree steps and only changes rotation', () => {
    const item = setup();
    const before = item();
    expect(useRoomStore.getState().rotateItem('item-1', 14).ok).toBe(true);
    expect(item()).toEqual({ ...before, rotation: 10 });
  });

  it('rotateItemStep turns 10 clockwise and 350 goes to 0', () => {
    const item = setup();
    useRoomStore.getState().rotateItemStep('item-1');
    expect(item().rotation).toBe(10);
    useRoomStore.getState().rotateItem('item-1', 350);
    useRoomStore.getState().rotateItemStep('item-1');
    expect(item().rotation).toBe(0);
  });

  it('a rotation that would cross a wall is not applied', () => {
    const item = setup({ x: 8.75, y: 1.5 });   // sofa pressed into the top-right corner
    expect(useRoomStore.getState().rotateItem('item-1', 10).ok).toBe(false);
    expect(item().rotation).toBe(0);
  });

  it('no room or unknown id changes nothing', () => {
    expect(useRoomStore.getState().rotateItem('item-1', 10).ok).toBe(false);
    setup();
    expect(useRoomStore.getState().rotateItem('item-9', 10).ok).toBe(false);
    expect(useRoomStore.getState().deleteItem('item-9').ok).toBe(false);
    expect(useRoomStore.getState().plan!.items).toHaveLength(1);
  });

  it('a guard can stop a rotation', () => {
    const item = setup();
    beforeRotateItem.push(() => false);
    expect(useRoomStore.getState().rotateItem('item-1', 10).ok).toBe(false);
    expect(item().rotation).toBe(0);
  });

  it('a locker turned 90 deg moved into the top-left corner touches both walls and passes the schema check', () => {
    useRoomStore.getState().createRoom(12, 10);
    useRoomStore.getState().addItem('locker', { x: 6, y: 5 });
    useRoomStore.getState().rotateItem('item-1', 90);
    expect(useRoomStore.getState().moveItem('item-1', { x: 0, y: 0 }).ok).toBe(true);
    const plan = useRoomStore.getState().plan!;
    expect(plan.items[0].position).toEqual({ x: 0.88, y: 1.5 });   // left edge 0.005 ft from the wall at most, top edge on it
    expect(checkRoomPlan(plan).ok).toBe(true);
  });

  it('deleteItem removes only that item', () => {
    setup();
    useRoomStore.getState().addItem('tv', { x: 2, y: 2 });
    expect(useRoomStore.getState().deleteItem('item-1').ok).toBe(true);
    expect(useRoomStore.getState().plan!.items.map((i) => i.id)).toEqual(['item-2']);
  });
});

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

describe('roomStore.moveItem (REQ-360)', () => {
  const setup = () => { useRoomStore.getState().createRoom(12, 10); useRoomStore.getState().addItem('sofa', { x: 6, y: 5 }); };
  const item = () => useRoomStore.getState().plan!.items[0];

  it('moves only the position, snapped to 0.25 ft', () => {
    setup();
    const before = item();
    expect(useRoomStore.getState().moveItem('item-1', { x: 7.3, y: 6.6 })).toEqual({ ok: true, errors: [] });
    expect(item()).toEqual({ ...before, position: { x: 7.25, y: 6.5 } });
    expect(checkRoomPlan(useRoomStore.getState().plan!).ok).toBe(true);
  });
  it('stops at the wall', () => {
    setup();
    useRoomStore.getState().moveItem('item-1', { x: 50, y: 50 });
    expect(item().position).toEqual({ x: 8.75, y: 8.5 });
  });
  it('ignores unknown items and no room', () => {
    expect(useRoomStore.getState().moveItem('item-1', { x: 1, y: 1 }).ok).toBe(false);
    setup();
    expect(useRoomStore.getState().moveItem('nope', { x: 1, y: 1 }).ok).toBe(false);
  });
  it('a guard can stop the move', () => {
    setup();
    beforeMoveItem.push(() => false);
    expect(useRoomStore.getState().moveItem('item-1', { x: 7, y: 7 }).ok).toBe(false);
    expect(item().position).toEqual({ x: 6, y: 5 });
  });
});
