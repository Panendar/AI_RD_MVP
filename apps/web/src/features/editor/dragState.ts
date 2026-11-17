// Editor UI state for a catalog drag: which item is being dragged. HTML5 dataTransfer cannot be read during dragover,
// so the plan reads the dragged item from here to draw the real-size outline.
import { createAppStore } from '../../state/createStore';

export const CATALOG_DRAG_TYPE = 'application/x-knm-catalog';

export interface DragState {
  draggingCatalogId: string | null;
  setDragging(catalogId: string | null): void;
  // The item selected in the plan (REQ-360). Editor UI state only, not part of the room JSON.
  selectedItemId: string | null;
  selectItem(itemId: string | null): void;
}

export const useDragState = createAppStore<DragState>({
  draggingCatalogId: null,
  setDragging(catalogId) { useDragState.setState({ draggingCatalogId: catalogId }); },
  selectedItemId: null,
  selectItem(itemId) { useDragState.setState({ selectedItemId: itemId }); }
});
