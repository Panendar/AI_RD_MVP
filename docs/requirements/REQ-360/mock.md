# UI Mock 3 — User can select and move furniture inside the walls

```text
+------------------------------------------------------------------------------------------------------------+
| AI RD MVP   Room 12 x 10 ft (fixed)     [* 2D plan *]  [ 3D view ]     [ Upload JSON ]   [ Download JSON ] |
+------------------------------------------------------------------------------------------------------------+
| A. CLICK AN ITEM TO SELECT IT                                                                              |
+--------------------------+------------------------------------------------------+--------------------------+
| CATALOG   (all white)    |      0     2     4     6     8    10    12 ft        | SELECTED: Sofa           |
| Search [ __________ ]    |   0  +-----------------------------------+           | W 6.5  D 3.0  H 2.75 ft  |
| Item      W x D x H ft   |      |                                   |           | Centre  X 5.25  Y 3.50   |
| Bed       5.0x6.5x1.5    |   2  |     #===================#         |           | Rotation  0 deg          |
| Sofa      6.5x3.0x2.75   |      |     #       SOFA        #         |           |                          |
| Table     4.0x2.5x2.5    |   4  |     #                   #         |           | Drag to move.            |
| Chair     1.5x1.5x3.0    |      |     #===================#         |           | Moves snap to 0.25 ft.   |
| TV        4.0x1.0x3.0    |   6  |     ^ highlighted = selected      |           |                          |
| Locker    3.0x1.75x6.5   |      |                       +-------+   |           |                          |
|                          |   8  |                       | CHAIR |   |           |                          |
|                          |      |                       +-------+   |           |                          |
|                          |  10  +-----------------------------------+           |                          |
+--------------------------+------------------------------------------------------+--------------------------+
| B. DRAG IT  (snaps in 0.25 ft steps)                C. DRAG PAST A WALL                                    |
|   0  +-----------------------------------+    0  +-----------------------------------+                     |
|      |                                   |       |                                   |                     |
|   2  |     . . . . . . . .               |    2  |                                   |                     |
|      |     .   (start)   . ----->        |       |                          stops    |                     |
|   4  |     . . . . . . . .               |    4  |                #==================#                     |
|      |           #===================#   |       |                #       SOFA       # <- wall             |
|   6  |           #       SOFA        #   |    6  |                #                  # drag -->            |
|      |           #                   #   |       |                #==================#                     |
|   8  |           #===================#   |    8  |                                   |                     |
|      |                                   |       |                                   |                     |
|  10  +-----------------------------------+   10  +-----------------------------------+                     |
|                                                                                                            |
| Position steps while dragging:  X 5.25 -> 5.50 -> 5.75 -> 6.00 ...  (centre, ft from the top-left corner)  |
| After the move:  X 7.25  Y 6.50  -> right panel and room JSON (items[0].position) update at once           |
+------------------------------------------------------------------------------------------------------------+
```

### Main interactions
- Click an item to select it: highlighted outline; the right panel shows size, centre position and rotation.
- Drag with the mouse to move; the item moves in 0.25 ft steps and its position in the panel and the room JSON updates straight away.
- The item cannot leave the room: dragging past a wall stops it at the wall.

### Screen notes
- 0.25 ft movement step (user decision, 2026-11-16).
- Position = centre of the item footprint, from the top-left corner (room-plan-schema.md).
- A drop closer than 1.5 ft to another item follows the clearance rule (REQ-366).
- Dragging past a wall stops the item at the wall (user decision, 2026-11-16).
- Out of scope for this requirement: arrow keys, multi-select, a specific way to deselect.
- Reference: ai-room-redesign UI Mock 16 and 18.
- Based on features.md #4 Edit the 2D plan.
