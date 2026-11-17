// The room plan of the current design, in memory only (no persistence in REQ-358; reload returns to the New room screen).
// There is deliberately no action that changes the room size once the room is created.
import { createAppStore } from './createStore';
import { createRoomPlan, type RoomPlan } from '../room/roomPlan';
import { checkRoomPlan } from '../room/checkRoomPlan';

export interface RoomState {
  plan: RoomPlan | null;
  // Builds the plan for width x length, checks it and keeps it only if it passes. Returns the check errors (empty on success).
  createRoom(width: number, length: number): string[];
}

export const useRoomStore = createAppStore<RoomState>({
  plan: null,
  createRoom(width, length) {
    const plan = createRoomPlan(width, length);
    const result = checkRoomPlan(plan);
    if (result.ok) useRoomStore.setState({ plan });
    return result.errors;
  }
});
