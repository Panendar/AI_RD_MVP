// The room plan of the current design, in memory only (no persistence yet; reload returns to the New room screen).
// There is deliberately no action that changes the room size once the room is created.
// Every change builds a new plan, checks it, and keeps it only if it passes (the room JSON is the single source of truth).
import { createAppStore } from './createStore';
import { createRoomPlan, type Item, type Point, type RoomPlan } from '../room/roomPlan';
import { checkRoomPlan } from '../room/checkRoomPlan';
import { getCatalogEntry } from '../room/catalog';
import { nextItemId, placeInRoom } from '../room/placement';

export interface ChangeResult { ok: boolean; errors: string[] }

// Hook point for REQ-366 (clearance): each guard sees the plan and the item about to be added and returns false to stop it.
export type AddItemGuard = (plan: RoomPlan, item: Item) => boolean;
export const beforeAddItem: AddItemGuard[] = [];

export interface RoomState {
  plan: RoomPlan | null;
  // Builds the plan for width x length, checks it and keeps it only if it passes. Returns the check errors (empty on success).
  createRoom(width: number, length: number): string[];
  // Adds a catalog item dropped at `drop` (ft): snapped to 0.25 ft, stopped at the walls, facing 0 deg, white.
  // A drop outside the room, or an item that cannot fit, adds nothing.
  addItem(catalogId: string, drop: Point): ChangeResult;
}

export const useRoomStore = createAppStore<RoomState>({
  plan: null,
  createRoom(width, length) {
    const plan = createRoomPlan(width, length);
    const result = checkRoomPlan(plan);
    if (result.ok) useRoomStore.setState({ plan });
    return result.errors;
  },
  addItem(catalogId, drop) {
    const plan = useRoomStore.getState().plan;
    if (!plan) return { ok: false, errors: ['There is no room yet.'] };
    const entry = getCatalogEntry(catalogId);
    if (!entry) return { ok: false, errors: [`Unknown catalog item "${catalogId}".`] };
    const position = placeInRoom(plan.room, entry, drop);
    if (!position) return { ok: false, errors: [] };   // outside the room or does not fit: nothing added
    const item: Item = {
      id: nextItemId(plan.items),
      catalogId: entry.catalogId,
      name: entry.name,
      position,
      size: { width: entry.width, depth: entry.depth, height: entry.height },
      rotation: 0,
      colour: '#FFFFFF'
    };
    if (!beforeAddItem.every((guard) => guard(plan, item))) return { ok: false, errors: [] };
    const next: RoomPlan = { ...plan, items: [...plan.items, item] };
    const result = checkRoomPlan(next);
    if (result.ok) useRoomStore.setState({ plan: next });
    return result;
  }
});
