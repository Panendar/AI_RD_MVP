# UI Mock 2 — User can add Indian furniture from a searchable catalog

```text
+------------------------------------------------------------------------------------------------------------+
| AI RD MVP   Room 12 x 10 ft                                            [ Upload JSON ]   [ Download JSON ] |
+------------------------------------------------------------------------------------------------------------+
+--------------------------+------------------------------------------------------+--------------------------+
| CATALOG  (examples)      |      0     2     4     6     8    10    12 ft        | ITEM PREVIEW             |
| Search [ sofa_______ ]   |   0  +-----------------------------------+           | [ sofa symbol ]          |
|                          |      |                                   |           | Sofa (3 seat)            |
| Seating                  |   2  |                                   |           | Size  6.0 x 3.0 ft       |
| > Sofa (3 seat)   [+]    |      |        #=================#        |           | Colour  (default)        |
|   Diwan            [+]   |   4  |        #      NEW SOFA   #        |           |                          |
|                          |      |        #                 #        |           | [ Add to room ]          |
| 1 of 5 items match       |   6  |        #=================#        |           |                          |
|                          |      |       <- added at real size       |           | The new item is          |
| Click [+] to add, or     |   8  |                                   |           | selected right away.     |
| drag onto the room.      |      |                                   |           |                          |
|                          |  10  +-----------------------------------+           |                          |
+--------------------------+------------------------------------------------------+--------------------------+
| NO MATCH:   Search [ xyz ]   ->   "No furniture matches 'xyz'."   The plan does not change.                |
| ROOM JSON:  furniture: [ { type: "sofa-3-seat", position: { x: 3, y: 3 }, rotation: 0,                     |
|                            size: { w: 6, d: 3 }, colour: "<default>" } ]                                   |
+------------------------------------------------------------------------------------------------------------+
```

### Main interactions
- Search by name narrows the list; categories group the items.
- Click [+] (or Add to room) to place the item in the room at its real size in feet; it is added to the room JSON and selected straight away.
- The item drawn in the plan measures its catalog size on the ruler (6 x 3 ft sofa = 6 x 3 ft on the ruler).

### Screen notes
- Item names, categories and the 6 x 3 ft size are examples only; the real catalog list, sizes and colours are an open question.
- Drag-to-place and where a clicked item lands (centre of the room?) are open questions.
- Reference: ai-room-redesign UI Mock 17 and docs/references/block_identification.png (left catalog panel with furniture symbols).
- Based on features.md #5 Add from catalog (REQ-285, REQ-298).
