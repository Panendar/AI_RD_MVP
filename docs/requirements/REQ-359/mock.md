# UI Mock 2 — User can add Indian furniture from a searchable catalog

```text
+------------------------------------------------------------------------------------------------------------+
| AI RD MVP   Room 12 x 10 ft (fixed)     [* 2D plan *]  [ 3D view ]     [ Upload JSON ]   [ Download JSON ] |
+------------------------------------------------------------------------------------------------------------+
| CATALOG   (all white)    |      0     2     4     6     8    10    12 ft        | ITEM PREVIEW             |
| Search [ so_______ ]     |   0  +-----------------------------------+           | [ sofa symbol ]          |
| Item      W x D x H ft   |      |                                   |           | Sofa (3 seat)            |
| > Sofa    6.5x3.0x2.75   |   2  |                                   |           | W 6.5  D 3.0  H 2.75 ft  |
|   ==== drag ====>        | ==>  |        #===================#      |           | Colour: white (fixed)    |
|                          |   4  |        #     NEW SOFA      #      |           | Size: fixed              |
| 1 of 6 items match       |      |        #                   #      |           | Facing: 0 deg            |
|                          |   6  |        #===================#      |           | (front -> bottom wall)   |
| Drag an item onto the    |      |     ^ dropped here, real size     |           |                          |
| room. No Add button.     |   8  |        6.5 x 3.0 ft, white        |           | While dragging, a        |
|                          |      |                                   |           | white outline at real    |
| Dropped outside the      |  10  +-----------------------------------+           | size follows the mouse   |
| room: nothing added.     |                                                      | (snaps to 0.25 ft).      |
+--------------------------+------------------------------------------------------+--------------------------+
| NO MATCH:   Search [ xyz ]   ->   "No furniture matches 'xyz'."   The plan does not change.                |
| JSON:  items: [ { id: "item-1", catalogId: "sofa", name: "Sofa (3 seat)", position: { x: 6.25, y: 4.5 },   |
|                  size: { width: 6.5, depth: 3.0, height: 2.75 }, rotation: 0, colour: "#FFFFFF" } ]        |
+------------------------------------------------------------------------------------------------------------+
```

### Main interactions
- The catalog lists six items with their width x depth x height in feet; search by name narrows the list.
- Drag an item from the catalog and drop it on the plan (no Add button): it lands where it is dropped, at real size, facing 0 deg (front toward the bottom wall), white, and is added to the room JSON.
- Dropped across a wall it stops at the wall; dropped outside the room nothing is added.
- The item footprint measures its catalog width and depth on the ruler.

### Screen notes
- Catalog items and sizes for normal Indian homes: bed, sofa, table, chair, TV, locker (user decision, 2026-11-16; room-plan-schema.md).
- Everything is white; there is no colour or size editing.
- Add by drag and drop only (user decision, 2026-11-16). A drop closer than 1.5 ft to another item follows the clearance rule (REQ-366).
- Reference: ai-room-redesign UI Mock 17; docs/references/block_identification.png.
- Based on features.md #5 Add from catalog.
