/** @jest-environment node */
import { createRoomPlan, parseRoomSize, validateRoomSize } from '../../src/room/roomPlan';

describe('createRoomPlan', () => {
  it('12 x 10 equals the schema example room, with no items', () => {
    expect(createRoomPlan(12, 10)).toEqual({
      schemaVersion: '1.0',
      units: 'ft',
      origin: 'top-left',
      room: {
        width: 12,
        length: 10,
        height: 10,
        walls: [
          { id: 'top', from: { x: 0, y: 0 }, to: { x: 12, y: 0 } },
          { id: 'right', from: { x: 12, y: 0 }, to: { x: 12, y: 10 } },
          { id: 'bottom', from: { x: 12, y: 10 }, to: { x: 0, y: 10 } },
          { id: 'left', from: { x: 0, y: 10 }, to: { x: 0, y: 0 } }
        ]
      },
      items: []
    });
  });

  it('walls follow width and length', () => {
    const { room } = createRoomPlan(30, 6.25);
    const xs = room.walls.flatMap((w) => [w.from.x, w.to.x]);
    const ys = room.walls.flatMap((w) => [w.from.y, w.to.y]);
    expect(Math.max(...xs)).toBe(30);
    expect(Math.max(...ys)).toBe(6.25);
  });
});

describe('validateRoomSize', () => {
  it.each(['6', '30', '12', '12.25', '12.5', '12.75', ' 10 ', '6.0'])('accepts %p', (v) => {
    expect(validateRoomSize(v)).toBeNull();
    expect(parseRoomSize(v)).toBe(Number(v.trim()));
  });

  it.each([
    ['5.75', /between 6 and 30 ft/],
    ['30.25', /between 6 and 30 ft/],
    ['', /required/],
    ['   ', /required/],
    ['abc', /must be a number/],
    ['1e1', /must be a number/],
    ['12.', /must be a number/],
    ['-8', /must be a number/],
    ['12.1', /steps of 0.25 ft/]
  ])('rejects %p with a message', (v, message) => {
    expect(validateRoomSize(v)).toMatch(message);
    expect(parseRoomSize(v)).toBeNull();
  });

  it('names the field in the message', () => {
    expect(validateRoomSize('40', 'Length')).toBe('Length must be between 6 and 30 ft.');
    expect(validateRoomSize(40)).toBe('Width must be between 6 and 30 ft.');
  });
});
