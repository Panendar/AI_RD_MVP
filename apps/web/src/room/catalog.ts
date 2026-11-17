// The furniture catalog (room-plan-schema.md, user decision 2026-11-16): six standard sizes for normal Indian homes.
// Sizes are in feet and cannot be edited. Pure TypeScript: no React, no store.
import type { CatalogId } from './roomPlan';

export interface CatalogEntry {
  catalogId: CatalogId;
  name: string;
  width: number;   // side to side, seen from the front
  depth: number;   // front to back
  height: number;  // floor to top
}

export const CATALOG: readonly CatalogEntry[] = [
  { catalogId: 'bed', name: 'Bed (queen)', width: 5.0, depth: 6.5, height: 1.5 },
  { catalogId: 'sofa', name: 'Sofa (3 seat)', width: 6.5, depth: 3.0, height: 2.75 },
  { catalogId: 'table', name: 'Table (4 seat)', width: 4.0, depth: 2.5, height: 2.5 },
  { catalogId: 'chair', name: 'Chair', width: 1.5, depth: 1.5, height: 3.0 },
  { catalogId: 'tv', name: 'TV (on stand)', width: 4.0, depth: 1.0, height: 3.0 },
  { catalogId: 'locker', name: 'Locker (steel almirah)', width: 3.0, depth: 1.75, height: 6.5 }
];

export function getCatalogEntry(catalogId: string): CatalogEntry | undefined {
  return CATALOG.find((e) => e.catalogId === catalogId);
}

// Case-insensitive match on the name; an empty or blank query returns the whole catalog.
export function searchCatalog(query: string): CatalogEntry[] {
  const q = query.trim().toLowerCase();
  return q === '' ? [...CATALOG] : CATALOG.filter((e) => e.name.toLowerCase().includes(q));
}

// "6.5 x 3.0 x 2.75 ft": width x depth x height, always at least one decimal.
export function formatSize(e: Pick<CatalogEntry, 'width' | 'depth' | 'height'>): string {
  const f = (n: number) => (Number.isInteger(n) ? n.toFixed(1) : String(n));
  return `${f(e.width)} x ${f(e.depth)} x ${f(e.height)} ft`;
}
