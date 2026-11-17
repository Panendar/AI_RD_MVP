/** @jest-environment jsdom */
import { fireEvent, screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { renderApp } from '../../src/testing/render';
import { EditorPage } from '../../src/features/editor/EditorPage';
import { useDragState } from '../../src/features/editor/dragState';
import { saveTextFile } from '../../src/room/downloadFile';
import { useRoomStore } from '../../src/state/roomStore';

jest.mock('../../src/room/downloadFile', () => ({ saveTextFile: jest.fn() }));
const save = saveTextFile as jest.MockedFunction<typeof saveTextFile>;

afterEach(() => { useRoomStore.getState().reset(); useDragState.getState().reset(); save.mockClear(); });

function editor(withItem: boolean) {
  useRoomStore.getState().createRoom(12, 10);
  if (withItem) useRoomStore.getState().addItem('sofa', { x: 6, y: 5 });
  renderApp(<Routes><Route path="/editor" element={<EditorPage />} /></Routes>, { route: '/editor' });
}

describe('Download JSON (REQ-362)', () => {
  it('is enabled and saves room_type.json with the whole design', () => {
    editor(true);
    const button = screen.getByRole('button', { name: 'Download JSON' });
    expect((button as HTMLButtonElement).disabled).toBe(false);
    fireEvent.click(button);
    expect(save).toHaveBeenCalledTimes(1);
    expect(save.mock.calls[0][0]).toBe('room_type.json');
    expect(JSON.parse(save.mock.calls[0][1]).items).toHaveLength(1);
  });

  it('on an empty room saves nothing and shows the message; OK closes it', async () => {
    editor(false);
    fireEvent.click(screen.getByRole('button', { name: 'Download JSON' }));
    expect(save).not.toHaveBeenCalled();
    expect(await screen.findByText('Add objects and plan your room before downloading.')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'OK' }));
    expect(useRoomStore.getState().plan).not.toBeNull();
  });
});
