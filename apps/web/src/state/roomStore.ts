// The room plan of the current design, in memory only (no persistence yet; reload returns to the New room screen).
// There is deliberately no action that changes the room size once the room is created.
// Every change builds a new plan, checks it, and keeps it only if it passes (the room JSON is the single source of truth).
import { createAppStore } from './createStore';
import { createRoomPlan, type Item, type Point, type RoomPlan } from '../room/roomPlan';
import { checkRoomPlan } from '../room/checkRoomPlan';
import { getCatalogEntry } from '../room/catalog';
import { clampCentre, nextItemId, placeInRoom } from '../room/placement';
import { snapAngle } from '../room/rotation';
import { findClearanceIssues } from '../room/clearance';

export interface ChangeResult { ok: boolean; errors: string[] }

// Hook point for REQ-366 (clearance): each guard sees the plan and the item about to be added and returns false to stop it.
export type AddItemGuard = (plan: RoomPlan, item: Item) => boolean;
export const beforeAddItem: AddItemGuard[] = [];

// Hook point for REQ-366 (clearance): sees the plan, the item and its new centre; returns false to stop the move.
export type MoveItemGuard = (plan: RoomPlan, item: Item, to: Point) => boolean;
export const beforeMoveItem: MoveItemGuard[] = [];

// Hook point for REQ-366 (clearance): sees the plan, the item and its new angle; returns false to stop the rotation.
export type RotateItemGuard = (plan: RoomPlan, item: Item, rotation: number) => boolean;
export const beforeRotateItem: RotateItemGuard[] = [];

export const OVERLAP_MESSAGE = 'Items cannot overlap.';

// A change waiting for the user's answer (REQ-366): the item is already in the plan at its new place; Cancel puts it back to
// `origin` (or removes it, when `origin` is null because it was just added).
export interface PendingClearance { itemId: string; origin: Item | null; otherName: string; gap: number }

export interface RoomState {
  plan: RoomPlan | null;
  // Clearance (REQ-366), editor state only, never part of the room JSON.
  gesture: { itemId: string; origin: Item | null } | null;   // a drag / rotate in progress: where the item started
  pending: PendingClearance | null;
  notice: string | null;                                       // a refusal message ("Items cannot overlap.")
  // Marks the start of a drag or a rotate so the result can be checked (and undone) when it ends.
  beginChange(itemId: string): void;
  // Ends a drag or rotate: overlap puts the item back and sets the notice; a gap under 1.5 ft (touching included) sets `pending`.
  settleChange(itemId: string): void;
  confirmPending(): void;   // Place here
  cancelPending(): void;    // Cancel
  dismissNotice(): void;
  // Builds the plan for width x length, checks it and keeps it only if it passes. Returns the check errors (empty on success).
  createRoom(width: number, length: number): string[];
  // Opens a design that already passed the upload checks (REQ-363): replaces the plan as it is and clears the editor state.
  // It does not run the add/move guards, so no clearance popup appears for items that are close or touching.
  loadPlan(plan: RoomPlan): void;
  // Adds a catalog item dropped at `drop` (ft): snapped to 0.25 ft, stopped at the walls, facing 0 deg, white.
  // A drop outside the room, or an item that cannot fit, adds nothing.
  addItem(catalogId: string, drop: Point): ChangeResult;
  // Moves an item to `to` (ft): snapped to 0.25 ft and stopped at the walls. Only `position` changes.
  moveItem(itemId: string, to: Point): ChangeResult;
  // Turns an item to `degrees` (snapped to 10 degrees, clockwise, 0..350) around its centre. A rotation that would take any
  // part of the item outside the walls is not applied: the item keeps its last angle. Only `rotation` changes.
  rotateItem(itemId: string, degrees: number): ChangeResult;
  // Turns an item 10 degrees clockwise (350 becomes 0).
  rotateItemStep(itemId: string): ChangeResult;
  // Removes an item from the plan. An unknown id changes nothing.
  deleteItem(itemId: string): ChangeResult;
}

// Puts an item back to `origin`, or removes it when there is none.
function restore(itemId: string, origin: Item | null): void {
  const plan = useRoomStore.getState().plan;
  if (!plan) return;
  const items = origin
    ? plan.items.map((it) => (it.id === itemId ? origin : it))
    : plan.items.filter((it) => it.id !== itemId);
  useRoomStore.setState({ plan: { ...plan, items } });
}

// Checks the item against the others once its drag, rotate or add is finished (REQ-366).
function settle(itemId: string, origin: Item | null): void {
  const plan = useRoomStore.getState().plan;
  const item = plan?.items.find((it) => it.id === itemId);
  useRoomStore.setState({ gesture: null });
  if (!plan || !item) return;
  if (origin && origin.position.x === item.position.x && origin.position.y === item.position.y && origin.rotation === item.rotation) return;
  const issues = findClearanceIssues(plan.items, item);
  if (issues.some((i) => i.kind === 'overlap')) {
    restore(itemId, origin);
    useRoomStore.setState({ notice: OVERLAP_MESSAGE });
  } else if (issues.length > 0) {
    useRoomStore.setState({ pending: { itemId, origin, otherName: issues[0].other.name, gap: issues[0].gap } });
  }
}

export const useRoomStore = createAppStore<RoomState>({
  plan: null,
  gesture: null,
  pending: null,
  notice: null,
  beginChange(itemId) {
    const { plan, pending } = useRoomStore.getState();
    const item = plan?.items.find((it) => it.id === itemId);
    if (!item || pending) return;
    useRoomStore.setState({ gesture: { itemId, origin: item } });
  },
  settleChange(itemId) {
    const g = useRoomStore.getState().gesture;
    if (g && g.itemId === itemId) settle(itemId, g.origin);
  },
  confirmPending() { useRoomStore.setState({ pending: null }); },
  cancelPending() {
    const p = useRoomStore.getState().pending;
    if (p) restore(p.itemId, p.origin);
    useRoomStore.setState({ pending: null });
  },
  dismissNotice() { useRoomStore.setState({ notice: null }); },
  createRoom(width, length) {
    const plan = createRoomPlan(width, length);
    const result = checkRoomPlan(plan);
    if (result.ok) useRoomStore.setState({ plan });
    return result.errors;
  },
  loadPlan(plan) { useRoomStore.setState({ plan, gesture: null, pending: null, notice: null }); },
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
    if (result.ok) {
      useRoomStore.setState({ plan: next });
      settle(item.id, null);   // clearance: an overlap removes it again, a close one asks first
    }
    return result;
  },
  moveItem(itemId, to) {
    const plan = useRoomStore.getState().plan;
    if (!plan) return { ok: false, errors: ['There is no room yet.'] };
    const item = plan.items.find((it) => it.id === itemId);
    if (!item) return { ok: false, errors: [`Unknown item "${itemId}".`] };
    const position = clampCentre(plan.room, item, to);
    if (!position) return { ok: false, errors: [] };
    if (position.x === item.position.x && position.y === item.position.y) return { ok: true, errors: [] };
    if (!beforeMoveItem.every((guard) => guard(plan, item, position))) return { ok: false, errors: [] };
    const next: RoomPlan = { ...plan, items: plan.items.map((it) => (it.id === itemId ? { ...it, position } : it)) };
    const result = checkRoomPlan(next);
    if (result.ok) useRoomStore.setState({ plan: next });
    return result;
  },
  rotateItem(itemId, degrees) {
    const plan = useRoomStore.getState().plan;
    if (!plan) return { ok: false, errors: ['There is no room yet.'] };
    const item = plan.items.find((it) => it.id === itemId);
    if (!item) return { ok: false, errors: [`Unknown item "${itemId}".`] };
    const rotation = snapAngle(degrees);
    if (rotation === item.rotation) return { ok: true, errors: [] };
    if (!beforeRotateItem.every((guard) => guard(plan, item, rotation))) return { ok: false, errors: [] };
    const next: RoomPlan = { ...plan, items: plan.items.map((it) => (it.id === itemId ? { ...it, rotation } : it)) };
    const result = checkRoomPlan(next);
    if (result.ok) useRoomStore.setState({ plan: next });
    return result;
  },
  rotateItemStep(itemId): ChangeResult {
    const item = useRoomStore.getState().plan?.items.find((it: Item) => it.id === itemId);
    return useRoomStore.getState().rotateItem(itemId, (item?.rotation ?? 0) + 10);
  },
  deleteItem(itemId) {
    const plan = useRoomStore.getState().plan;
    if (!plan) return { ok: false, errors: ['There is no room yet.'] };
    if (!plan.items.some((it) => it.id === itemId)) return { ok: false, errors: [`Unknown item "${itemId}".`] };
    const next: RoomPlan = { ...plan, items: plan.items.filter((it) => it.id !== itemId) };
    const result = checkRoomPlan(next);
    if (result.ok) useRoomStore.setState({ plan: next });
    return result;
  }
});
