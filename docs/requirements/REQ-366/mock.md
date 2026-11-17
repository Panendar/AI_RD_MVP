# UI Mock 5 — User is warned when furniture is closer than 1.5 ft

```text
+------------------------------------------------------------------------------------------------------------+
| AI RD MVP   Room 12 x 10 ft (fixed)     [* 2D plan *]  [ 3D view ]     [ Upload JSON ]   [ Download JSON ] |
+------------------------------------------------------------------------------------------------------------+
| A. DRAGGING A CHAIR 1.00 ft FROM THE BED  ->  RED LINE WITH THE GAP          (~~~ = red line)              |
+--------------------------+------------------------------------------------------+--------------------------+
| CATALOG   (all white)    |      0     2     4     6     8    10    12 ft        | SELECTED: Chair          |
| Search [ __________ ]    |   0  +-----------------------------------+           | Centre  X 4.75  Y 4.00   |
| Item      W x D x H ft   |      |                   +--------------+|           |                          |
| Bed       5.0x6.5x1.5    |   2  |          1.00 ft  |              ||           | GAP TO BED               |
| Sofa      6.5x3.0x2.75   |      |           #====#  |              ||           |   1.00 ft  (red)         |
| Table     4.0x2.5x2.5    |   4  |           #CHR #~~|     BED      ||           |                          |
| Chair     1.5x1.5x3.0    |      |           #====#  |              ||           | Recommended  1.5 ft      |
| TV        4.0x1.0x3.0    |   6  |                   |              ||           | Minimum      none        |
| Locker    3.0x1.75x6.5   |      |                   +--------------+|           | (touching is allowed,    |
|                          |   8  |                                   |           |  overlap is not)         |
|                          |      |                                   |           | Gap = edge to edge,      |
|                          |  10  +-----------------------------------+           | after rotation.          |
+--------------------------+------------------------------------------------------+--------------------------+
| B. ON DROP, GAP 0 TO 1.5 ft (TOUCHING INCLUDED)  ->  CONFIRM    C. ON DROP, OVERLAPPING  ->  NOT ALLOWED   |
| +------------------------------------------------------+  +----------------------------------------------+ |
| | ! Too close                                          |  | ! Items cannot overlap.                      | |
| | This chair is 1.00 ft from the Bed.                  |  |                                              | |
| | (touching: "This chair is touching the Table.        |  | The overlap is marked in red.                | |
| |  0.00 ft")                                           |  | The chair goes back to where it was.         | |
| | We recommend at least 1.5 ft between items.          |  | The room JSON does not change.               | |
| | Would you like to place it here?                     |  |                                              | |
| |               [ Place here ]     [ Cancel ]          |  |                           [ OK ]             | |
| |                                                      |  |                                              | |
| | Place here -> stays, saved; the red line goes away   |  |                                              | |
| | Cancel     -> back to where it was                   |  |                                              | |
| |               (removed, if it was just added)        |  |                                              | |
| +------------------------------------------------------+  +----------------------------------------------+ |
|                                                                                                            |
| D. GAP 1.5 ft OR MORE  ->  placed normally: no red line, no popup.                                         |
| E. AFTER PLACE HERE  ->  no red line for that pair, until an item is dragged or rotated close again.       |
| F. DESIGN OPENED FROM A FILE  ->  shown exactly as saved: no red lines, no popups.                         |
| G. A gap or overlap under 0.01 ft counts as touching.                                                      |
| The same rule runs after ADD from the catalog, MOVE and ROTATE. Gaps to walls are not checked here.        |
+------------------------------------------------------------------------------------------------------------+
```

### Main interactions
- While dragging or rotating, a red line with the gap in feet appears between the item and every item less than 1.5 ft away (0.00 ft when touching).
- On drop with a gap from 0 (touching) up to 1.5 ft: a popup asks "Would you like to place it here?"; Place here keeps it, Cancel puts it back.
- On drop overlapping another item: not allowed; the overlap is shown in red, the item goes back and a message says items cannot overlap.
- A gap of 1.5 ft or more: no line, no popup.

### Screen notes
- Recommended 1.5 ft; no minimum, items may touch; only overlap is refused (user decision, 2026-11-17).
- The gap is the shortest edge-to-edge distance between the rotated footprints, shown with 2 decimals. Under 0.01 ft counts as touching.
- After Place here the red line disappears; opened files show no red lines (user decisions, 2026-11-16). Items may stand against walls.
- Reference: ai-room-redesign UI Mock 28 (red warnings for overlaps); docs/references/distance_measure.png.
