// Scaffold-owned glue file (STORY-105). Modules register at the markers below; do not edit the marked lines by hand.
// knm:imports
import { NewRoomPage } from '../features/new-room/NewRoomPage';
import { EditorPage } from '../features/editor/EditorPage';

export const router = [
  // knm:entries
  { id: 'new-room', path: '/', element: <NewRoomPage /> },
  { id: 'editor', path: '/editor', element: <EditorPage /> },
  // knm:entries-end
];
