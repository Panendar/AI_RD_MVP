/** @jest-environment node */
import { CATALOG, formatSize, getCatalogEntry, searchCatalog } from '../../src/room/catalog';

describe('catalog', () => {
  it('has exactly the six items with their sizes in ft', () => {
    expect(CATALOG.map((e) => [e.catalogId, e.name, e.width, e.depth, e.height])).toEqual([
      ['bed', 'Bed (queen)', 5.0, 6.5, 1.5],
      ['sofa', 'Sofa (3 seat)', 6.5, 3.0, 2.75],
      ['table', 'Table (4 seat)', 4.0, 2.5, 2.5],
      ['chair', 'Chair', 1.5, 1.5, 3.0],
      ['tv', 'TV (on stand)', 4.0, 1.0, 3.0],
      ['locker', 'Locker (steel almirah)', 3.0, 1.75, 6.5]
    ]);
  });

  it('formats width x depth x height', () => {
    expect(formatSize(getCatalogEntry('sofa')!)).toBe('6.5 x 3.0 x 2.75 ft');
    expect(formatSize(getCatalogEntry('bed')!)).toBe('5.0 x 6.5 x 1.5 ft');
  });

  it.each([
    ['', 6],
    ['   ', 6],
    ['so', 1],
    ['LOCK', 1],
    ['tab', 1],
    ['ta', 2],      // Table and TV (on sTAnd)
    ['xyz', 0]
  ])('search %p finds %p items', (q, n) => {
    expect(searchCatalog(q)).toHaveLength(n);
  });

  it('search matches the name case-insensitively', () => {
    expect(searchCatalog('so')[0].catalogId).toBe('sofa');
    expect(searchCatalog('LOCK')[0].catalogId).toBe('locker');
  });

  it('unknown ids are not in the catalog', () => {
    expect(getCatalogEntry('lamp')).toBeUndefined();
  });
});
