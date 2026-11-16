# UI Mock 2 — User can add Indian furniture from a searchable catalog

```text
+------------------------------------------------------------------------------------------------------------+
| AI RD MVP   Room 12 x 10 ft (fixed)     [* 2D plan *]  [ 3D view ]     [ Upload JSON ]   [ Download JSON ] |
+------------------------------------------------------------------------------------------------------------+
| CATALOG   (all white)    |      0     2     4     6     8    10    12 ft        | ITEM PREVIEW             |
| Search [ so_______ ]     |   0  +-----------------------------------+           | [ sofa symbol ]          |
| Item      W x D x H ft   |      |                                   |           | Sofa (3 seat)            |
| > Sofa    6.5x3.0x2.75   |   2  |                                   |           | W 6.5  D 3.0  H 2.75 ft  |
|   [ + Add to room ]      |      |        #===================#      |           | Colour: white (fixed)    |
|                          |   4  |        #     NEW SOFA      #      |           | Size: fixed              |
| 1 of 6 items match       |      |        #                   #      |           | Facing: 0 deg            |
|                          |   6  |        #===================#      |           | (front -> bottom wall)   |
| Full list: Bed, Sofa,    |      |       ^ added at real size        |           |                          |
| Table, Chair, TV,        |   8  |        6.5 x 3.0 ft, white        |           | The new item is          |
| Locker                   |      |                                   |           | selected right away.     |
|                          |  10  +-----------------------------------+           |                          |
+--------------------------+------------------------------------------------------+--------------------------+
| NO MATCH:   Search [ xyz ]   ->   "No furniture matches 'xyz'."   The plan does not change.                |
| JSON:  items: [ { id: "item-1", catalogId: "sofa", name: "Sofa (3 seat)", position: { x: 6.25, y: 4.5 },   |
|                  size: { width: 6.5, depth: 3.0, height: 2.75 }, rotation: 0, colour: "#FFFFFF" } ]        |
+------------------------------------------------------------------------------------------------------------+
```

### Main interactions
- The catalog lists six items with their width x depth x height in feet; search by name narrows the list.
- Add to room places the item at its real size, facing 0 deg (front toward the bottom wall), white; it is added to the room JSON and selected straight away.
- The item footprint measures its catalog width and depth on the ruler.

### Screen notes
- Catalog items: bed, sofa, table, chair, TV, locker (user decision, 2026-11-16). Sizes are proposed and must be confirmed (room-plan-schema.md).
- Everything is white; there is no colour or size editing.
- Where a new item is placed and drag-from-catalog are open questions; a close placement follows the clearance rule (REQ-366).
- Reference: ai-room-redesign UI Mock 17; docs/references/block_identification.png.
- Based on features.md #5 Add from catalog.
