# UI Mock 4 — User can rotate, resize and delete furniture

```text
+------------------------------------------------------------------------------------------------------------+
| AI RD MVP   Room 12 x 10 ft                                            [ Upload JSON ]   [ Download JSON ] |
+------------------------------------------------------------------------------------------------------------+
| A. SELECTED ITEM: ROTATION RING AND FLOATING TOOLBAR                                                       |
+--------------------------+------------------------------------------------------+--------------------------+
| CATALOG  (examples)      |      0     2     4     6     8    10    12 ft        | SELECTED: Sofa           |
| Search [ sofa_______ ]   |   0  +-----------------------------------+           | Size  W [ 6.0 ] ft       |
|                          |      |       .--'''''  o  '''''--.       |           |       D [ 3.0 ] ft       |
| Seating                  |   2  |   .'                         '.   |           | Rotation  [ 0 deg ]      |
|   Sofa (3 seat)          |      |  /      #===============#      \  |           | Step      10 deg         |
|   Diwan                  |   4  | |       #     SOFA      #       | |           |                          |
| Beds                     |      | |       #               #       | |           | o = rotate knob on       |
|   Single bed             |   6  |  \      #===============#      /  |           | the ring. Drag it,       |
| Storage                  |      |   '.                         .'   |           | or press Rotate 10.      |
|                          |   8  |      '--====[ 0 deg ]====--'      |           |                          |
|                          |      |    [Rotate 10][Resize][Delete]    |           | [ Delete ]               |
|                          |  10  +-----------------------------------+           |                          |
+--------------------------+------------------------------------------------------+--------------------------+
| B. DRAG THE KNOB (OR PRESS ROTATE 10)  ->  SNAPS TO 10 deg    C. RESIZE WITH A CORNER HANDLE               |
|   0  +-----------------------------------+    0  +-----------------------------------+                     |
|      |       .--'''''  o  '''''--.       |       |         was 6 ft wide:            |                     |
|   2  |   .'                         '.   |    2  |         . . . . . . . . .         |                     |
|      |  /       +-----.___            \  |       |         #====================#    |                     |
|   4  | |       /   SOFA   '''--+       | |    4  |         #     SOFA           #    |                     |
|      | |      /                /       | |       |         #                    #    |                     |
|   6  |  \     +--..___       /        /  |    6  |         #====================#[]  |                     |
|      |   '.           '''---+       .'   |       |         now 7.0 x 3.0 ft          |                     |
|   8  |     '--====[ 10 deg ]====--'      |    8  |         [] = corner handle        |                     |
|      |                                   |       |                                   |                     |
|  10  +-----------------------------------+   10  +-----------------------------------+                     |
|                                                                                                            |
| Each step: 0 -> 10 -> 20 -> ... -> 350 -> 0 deg. Panel and room JSON (rotation: 10) update at once.        |
+------------------------------------------------------------------------------------------------------------+
| D. DELETE                                       E. ROTATE OR RESIZE WOULD CROSS A WALL                     |
| +----------------------------------------------+  +------------------------------------------------------+ |
| | [ Delete ] on the toolbar or in the panel    |  | The change is not applied: the item keeps its last   | |
| | -> the sofa disappears from the plan         |  | rotation / size inside the room.                     | |
| | -> it is removed from the room JSON          |  | Example: sofa against the right wall, Rotate 10      | |
| | (confirm first? undo? : open questions)      |  | -> a corner would cross the wall -> stays at 0 deg.  | |
| +----------------------------------------------+  +------------------------------------------------------+ |
+------------------------------------------------------------------------------------------------------------+
```

### Main interactions
- Selecting an item shows a rotation ring around it with a knob (o), the current angle in a bubble on the ring, corner handles for resize and a floating toolbar above the item.
- Rotation moves in 10 deg steps: dragging the knob snaps to the nearest 10 deg, and Rotate 10 turns the item 10 deg clockwise. The angle shows in the bubble and in the right panel.
- Dragging a corner handle (or typing W and D in the panel) resizes the item in feet.
- Delete removes the item from the plan and the room JSON.
- Every change shows in the plan and in the room JSON straight away; a rotate or resize that would cross a wall is not applied.

### Screen notes
- Rotation step 10 deg (user decision, 2026-11-16).
- ASCII cannot draw a true 10 deg tilt; the tilted sofa in B is approximate.
- Open questions: free rotation (no snap) with a modifier key, typing an exact angle, keeping proportions on resize, minimum/maximum size, delete confirmation and undo, colour editing.
- Reference: docs/references/rotation.png (rotation ring with live angle) and designs_matress.png (floating toolbar over the selected item); ai-room-redesign UI Mock 16 and 18.
- Based on features.md #4 Edit the 2D plan (REQ-297, REQ-299).
