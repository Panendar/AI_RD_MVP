/** @jest-environment jsdom */
import { fireEvent, screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { renderApp } from '../../src/testing/render';
import { NewRoomPage } from '../../src/features/new-room/NewRoomPage';
import { useRoomStore } from '../../src/state/roomStore';

const page = () => renderApp(
  <Routes>
    <Route path="/" element={<NewRoomPage />} />
    <Route path="/editor" element={<h1>Editor opened</h1>} />
  </Routes>
);
const type = (label: 'Width' | 'Length', value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } });
const create = () => fireEvent.click(screen.getByRole('button', { name: 'Create room' }));

afterEach(() => useRoomStore.getState().reset());

describe('New room screen', () => {
  it('shows the fixed shape, wall height and the size note', () => {
    page();
    expect(screen.getByText(/Rectangle/)).toBeTruthy();
    expect(screen.getByText(/10 ft high \(standard, fixed\)/)).toBeTruthy();
    expect(screen.getByText('The room size cannot be changed later.')).toBeTruthy();
    expect(screen.getAllByText(/6 to 30 ft/).length).toBe(2);
  });

  it('12 x 10 creates the room and opens the editor', () => {
    page();
    type('Width', '12');
    type('Length', '10');
    create();
    expect(screen.getByRole('heading', { name: 'Editor opened' })).toBeTruthy();
    expect(useRoomStore.getState().plan?.room).toMatchObject({ width: 12, length: 10, height: 10 });
  });

  it.each([
    ['5.75', 'Width must be between 6 and 30 ft.'],
    ['30.25', 'Width must be between 6 and 30 ft.'],
    ['', 'Width is required.'],
    ['abc', 'Width must be a number in feet.'],
    ['12.1', /Width must be in steps of 0.25 ft/]
  ])('width %p shows a message and Create room does nothing', (value, message) => {
    page();
    type('Width', value);
    expect(screen.getByText(message)).toBeTruthy();
    create();
    expect(useRoomStore.getState().plan).toBeNull();
    expect(screen.queryByText('Editor opened')).toBeNull();
  });

  it('an invalid length also blocks Create room', () => {
    page();
    type('Length', '31');
    create();
    expect(screen.getByText('Length must be between 6 and 30 ft.')).toBeTruthy();
    expect(useRoomStore.getState().plan).toBeNull();
  });

  it('the preview follows valid values and hides on invalid ones', () => {
    page();
    type('Width', '14.5');
    type('Length', '8');
    expect(screen.getByTestId('room-preview').getAttribute('viewBox')).toBe('-2 -2 18.5 12');
    expect(screen.getByText('14.5 x 8 ft')).toBeTruthy();
    type('Length', 'x');
    expect(screen.queryByTestId('room-preview')).toBeNull();
    expect(screen.getByTestId('room-preview-empty')).toBeTruthy();
  });
});
