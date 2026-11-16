# UI Mock 3 — User can select and move furniture inside the walls

```text
+------------------------------------------------------------------------------------------------------------+
| AI RD MVP   Room 12 x 10 ft                                            [ Upload JSON ]   [ Download JSON ] |
+------------------------------------------------------------------------------------------------------------+
| A. CLICK AN ITEM TO SELECT IT                                                                              |
+--------------------------+------------------------------------------------------+--------------------------+
| CATALOG  (examples)      |      0     2     4     6     8    10    12 ft        | SELECTED: Sofa           |
| Search [ sofa_______ ]   |   0  +-----------------------------------+           | Size  6.0 x 3.0 ft       |
|                          |      |                                   |           | X  2.0 ft   Y  2.0 ft    |
| Seating                  |   2  |     #=================#           |           | Rotation  0 deg          |
|   Sofa (3 seat)          |      |     #      SOFA       #           |           |                          |
|   Diwan                  |   4  |     #                 #           |           | Drag the item to         |
| Beds                     |      |     #=================#           |           | move it.                 |
|   Single bed             |   6  |     ^ highlighted = selected      |           |                          |
| Storage                  |      |                    +--------+     |           |                          |
|                          |   8  |                    |  BED   |     |           |                          |
|                          |      |                    +--------+     |           |                          |
|                          |  10  +-----------------------------------+           |                          |
+--------------------------+------------------------------------------------------+--------------------------+
| B. DRAG IT                                            C. DRAG PAST A WALL                                  |
|   0  +-----------------------------------+    0  +-----------------------------------+                     |
|      |                                   |       |                                   |                     |
|   2  |     . . . . . . .                 |    2  |                                   |                     |
|      |     .  (start)  . ----->          |       |                          stops    |                     |
|   4  |     . . . . . . .                 |    4  |                 #=================#                     |
|      |           #=================#     |       |                 #      SOFA       # <- wall             |
|   6  |           #      SOFA       #     |    6  |                 #                 # drag -->            |
|      |           #                 #     |       |                 #=================#                     |
|   8  |           #=================#     |    8  |                                   |                     |
|      |                                   |       |                                   |                     |
|  10  +-----------------------------------+   10  +-----------------------------------+                     |
|                                                                                                            |
| After the move:  X 4.0 ft  Y 5.0 ft  (right panel and room JSON update at once)                            |
+------------------------------------------------------------------------------------------------------------+
```

### Main interactions
- Click an item to select it: it gets a highlighted outline and the right panel shows its size, position and rotation.
- Drag to move: the position updates in the panel and in the room JSON straight away.
- The item cannot leave the room: dragging past a wall stops it at the wall.

### Screen notes
- Positions are measured in feet from the top-left corner of the room (0, 0).
- Stop-at-wall is shown; snap-back is the alternative (open question). Grid snapping, overlap with other furniture, multi-select, keyboard nudge and how to deselect are open questions.
- Reference: ai-room-redesign UI Mock 16 and 18.
- Based on features.md #4 Edit the 2D plan (REQ-297, REQ-299).
