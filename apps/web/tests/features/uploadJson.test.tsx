/** @jest-environment jsdom */
import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { renderApp } from '../../src/testing/render';
import { EditorPage } from '../../src/features/editor/EditorPage';
import { useDragState } from '../../src/features/editor/dragState';
import { saveTextFile } from '../../src/room/downloadFile';
import { MAX_UPLOAD_BYTES } from '../../src/room/openRoomPlan';
import type { RoomPlan } from '../../src/room/roomPlan';
import { useRoomStore } from '../../src/state/roomStore';

jest.mock('../../src/room/downloadFile', () => ({ saveTextFile: jest.fn() }));
const save = saveTextFile as jest.MockedFunction<typeof saveTextFile>;

afterEach(() => { useRoomStore.getState().reset(); useDragState.getState().reset(); save.mockClear(); });

// The design that will be uploaded: a sofa and a table 0.25 ft apart (valid, but closer than 1.5 ft).
function designToUpload(): RoomPlan {
  const s = useRoomStore.getState();
  s.createRoom(14, 10);
  s.addItem('sofa', { x: 7, y: 2 });
  s.addItem('table', { x: 7, y: 8 });
  const plan = useRoomStore.getState().plan!;
  const close = { ...plan, items: plan.items.map((it) => (it.catalogId === 'table' ? { ...it, position: { x: 7, y: 5 } } : it)) };
  s.reset();
  return close;
}

function editor(openWith: 'none' | 'empty' | 'item') {
  if (openWith !== 'none') {
    useRoomStore.getState().createRoom(12, 10);
    if (openWith === 'item') useRoomStore.getState().addItem('bed', { x: 3, y: 3 });
  }
  renderApp(<Routes><Route path="/editor" element={<EditorPage />} /></Routes>, { route: '/editor' });
}

// jsdom's File has no text(); give it one.
const jsonFile = (text: string, name = 'design.json') => {
  const f = new File([text], name, { type: 'application/json' });
  Object.defineProperty(f, 'text', { value: async () => text });
  return f;
};
const choose = (f: File) => fireEvent.change(screen.getByTestId('upload-input'), { target: { files: [f] } });

describe('Upload JSON (REQ-363)', () => {
  it('is enabled', () => {
    editor('empty');
    expect((screen.getByRole('button', { name: 'Upload JSON' }) as HTMLButtonElement).disabled).toBe(false);
  });

  it('opens a valid file into an empty room exactly as saved, with no clearance popup', async () => {
    const design = designToUpload();
    editor('empty');
    choose(jsonFile(JSON.stringify(design)));
    await waitFor(() => expect(useRoomStore.getState().plan).toEqual(design));
    expect(screen.queryByText('Too close')).toBeNull();
    expect(screen.queryByText('Replace the current design?')).toBeNull();
    expect(useRoomStore.getState().pending).toBeNull();
    expect(screen.getByText('Room 14 x 10 ft (fixed)')).toBeTruthy();
  });

  it('rejects an invalid file with the general message and keeps the current design', async () => {
    editor('item');
    const before = useRoomStore.getState().plan;
    choose(jsonFile('{"nope":true}'));
    expect(await screen.findByText('This file is not a valid room design.')).toBeTruthy();
    expect(useRoomStore.getState().plan).toBe(before);
    fireEvent.click(screen.getByRole('button', { name: 'OK' }));
    expect(useRoomStore.getState().plan).toBe(before);
  });

  it('rejects a file over 1 MB with the same message', async () => {
    editor('item');
    const before = useRoomStore.getState().plan;
    const big = jsonFile('{}');
    Object.defineProperty(big, 'size', { value: MAX_UPLOAD_BYTES + 1 });
    choose(big);
    expect(await screen.findByText('This file is not a valid room design.')).toBeTruthy();
    expect(useRoomStore.getState().plan).toBe(before);
  });

  it('asks before replacing an open design: Cancel keeps it', async () => {
    const design = designToUpload();
    editor('item');
    const before = useRoomStore.getState().plan;
    choose(jsonFile(JSON.stringify(design), 'shared.json'));
    expect(await screen.findByText('Replace the current design with shared.json? The current design will be lost.')).toBeTruthy();
    expect(useRoomStore.getState().plan).toBe(before);
    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(screen.queryByText('Replace the current design?')).toBeNull());
    expect(useRoomStore.getState().plan).toBe(before);
  });

  it('asks before replacing an open design: Replace opens the file', async () => {
    const design = designToUpload();
    editor('item');
    choose(jsonFile(JSON.stringify(design)));
    const dialog = await screen.findByRole('alertdialog');
    fireEvent.click(within(dialog).getByRole('button', { name: 'Replace' }));
    await waitFor(() => expect(useRoomStore.getState().plan).toEqual(design));
    expect(screen.queryByText('Too close')).toBeNull();
  });

  it('keeps editing after opening: move, rotate, delete and add work', async () => {
    const design = designToUpload();
    editor('empty');
    choose(jsonFile(JSON.stringify(design)));
    await waitFor(() => expect(useRoomStore.getState().plan).toEqual(design));
    const s = useRoomStore.getState();
    const [sofa, table] = design.items;
    expect(s.moveItem(sofa.id, { x: 4, y: 2 }).ok).toBe(true);
    expect(s.rotateItem(table.id, 90).ok).toBe(true);
    expect(s.deleteItem(table.id).ok).toBe(true);
    expect(s.addItem('chair', { x: 11, y: 8 }).ok).toBe(true);
    const plan = useRoomStore.getState().plan!;
    expect(plan.items.map((it) => it.catalogId)).toEqual(['sofa', 'chair']);
    expect(plan.items[0].position.x).toBe(4);
  });

  it('downloading right after opening gives the same design', async () => {
    const design = designToUpload();
    editor('empty');
    choose(jsonFile(JSON.stringify(design)));
    await waitFor(() => expect(useRoomStore.getState().plan).toEqual(design));
    fireEvent.click(screen.getByRole('button', { name: 'Download JSON' }));
    expect(save).toHaveBeenCalledTimes(1);
    expect(JSON.parse(save.mock.calls[0][1])).toEqual(design);
  });
});
