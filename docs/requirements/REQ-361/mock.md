# UI Mock 4 — User can rotate and delete furniture

```text
+------------------------------------------------------------------------------------------------------------+
| AI RD MVP   Room 12 x 10 ft (fixed)     [* 2D plan *]  [ 3D view ]     [ Upload JSON ]   [ Download JSON ] |
+------------------------------------------------------------------------------------------------------------+
| A. SELECTED ITEM: ROTATION RING (drag the knob o with the mouse) AND FLOATING TOOLBAR                      |
+--------------------------+------------------------------------------------------+--------------------------+
| CATALOG   (all white)    |      0     2     4     6     8    10    12 ft        | SELECTED: Sofa           |
| Search [ __________ ]    |   0  +-----------------------------------+           | W 6.5  D 3.0  H 2.75 ft  |
| Item      W x D x H ft   |      |       .--'''''  o  '''''--.       |           | (size is fixed)          |
| Bed       5.0x6.5x1.5    |   2  |   .'                         '.   |           | Rotation  0 deg          |
| Sofa      6.5x3.0x2.75   |      |  /    #==================#     \  |           | Facing: bottom wall      |
| Table     4.0x2.5x2.5    |   4  | |     #       SOFA       #      | |           | Step: 10 deg             |
| Chair     1.5x1.5x3.0    |      | |     #                  #      | |           |                          |
| TV        4.0x1.0x3.0    |   6  |  \    #==================#     /  |           | Drag the knob o around   |
| Locker    3.0x1.75x6.5   |      |   '.                         .'   |           | the ring, or press       |
|                          |   8  |      '--====[ 0 deg ]====--'      |           | Rotate 10.               |
|                          |      |     [ Rotate 10 ]  [ Delete ]     |           |                          |
|                          |  10  +-----------------------------------+           | [ Delete ]               |
+--------------------------+------------------------------------------------------+--------------------------+
| B. AFTER ONE STEP: 10 deg  (knob dragged, or Rotate 10 pressed)                                            |
|   0  +-----------------------------------+                                                                 |
|      |       .--'''''  o  '''''--.       |   Steps: 0 -> 10 -> 20 -> ... -> 350 -> 0 deg                   |
|   2  |   .'                         '.   |                                                                 |
|      |  /     #======.___             \  |   Dragging the knob snaps to the nearest                        |
|   4  | |     #   SOFA    '''==#        | |   10 deg; the bubble on the ring shows                          |
|      | |    #                 #        | |   the angle while you drag.                                     |
|   6  |  \   #==..___         #        /  |                                                                 |
|      |   '.         '''=====#       .'   |   Panel:  Rotation 10 deg                                       |
|   8  |     '--====[ 10 deg ]====--'      |   JSON:   items[0].rotation = 10                                |
|      |                                   |                                                                 |
|  10  +-----------------------------------+   Facing = direction of the item front,                         |
|                                              clockwise; 0 = front faces bottom wall.                       |
+------------------------------------------------------------------------------------------------------------+
| C. DELETE                                       D. ROTATION WOULD CROSS A WALL                             |
| +----------------------------------------------+  +------------------------------------------------------+ |
| | [ Delete ]  ->  confirmation popup:          |  | The rotation is not applied: the item keeps its      | |
| | +-------------------------------------+      |  | last angle.                                          | |
| | | Delete Sofa?  [ Delete ] [ Cancel ] |      |  | Example: sofa against the right wall, Rotate 10      | |
| | +-------------------------------------+      |  | -> a corner would cross the wall -> stays at 0 deg.  | |
| | Delete -> removed from plan and items[ ]     |  +------------------------------------------------------+ |
| | Cancel -> nothing changes                    |                                                           |
| +----------------------------------------------+                                                           |
|                                                                                                            |
| NO RESIZING: item sizes come from the catalog and cannot be changed.                                       |
+------------------------------------------------------------------------------------------------------------+
```

### Main interactions
- Selecting an item shows a rotation ring around it, with a knob (o), the angle in a bubble on the ring, and a floating toolbar.
- Rotate with the mouse by dragging the knob; the item turns around its centre in 10 deg steps. Rotate 10 turns it 10 deg clockwise.
- The angle (facing) shows on the ring and in the panel, and is saved as rotation in the room JSON straight away.
- Delete asks for confirmation first; Delete removes the item from the plan and the room JSON, Cancel changes nothing.
- A rotation that would cross a wall is not applied; one closer than 1.5 ft to another item follows the clearance rule (REQ-366).

### Screen notes
- 10 deg rotation step with the mouse; no resizing (user decisions, 2026-11-16).
- ASCII cannot draw a true 10 deg tilt; the tilted sofa in B is approximate.
- Delete asks for confirmation (user decision, 2026-11-16). Out of scope: undo; typing an exact angle.
- Reference: docs/references/rotation.png (rotation ring with live angle) and designs_matress.png (floating toolbar); ai-room-redesign UI Mock 16 and 18.
- Based on features.md #4 Edit the 2D plan.
