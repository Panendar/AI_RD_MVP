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
| TV        4.0x1.0x3.0    |   6  |                   |              ||           | Minimum      0.5 ft      |
| Locker    3.0x1.75x6.5   |      |                   +--------------+|           |                          |
|                          |   8  |                                   |           | Gap = edge to edge,      |
|                          |      |                                   |           | after rotation.          |
|                          |  10  +-----------------------------------+           |                          |
+--------------------------+------------------------------------------------------+--------------------------+
| B. ON DROP, GAP 0.5 ft TO 1.5 ft  ->  CONFIRM                C. ON DROP, GAP UNDER 0.5 ft  ->  NOT ALLOWED |
| +------------------------------------------------------+  +----------------------------------------------+ |
| | ! Too close                                          |  | ! Items must be at least 0.5 ft apart.       | |
| | This chair is 1.00 ft from the Bed.                  |  |                                              | |
| | We recommend at least 1.5 ft between items.          |  | Gap 0.25 ft (or overlapping):                | |
| | Would you like to place it here?                     |  | the chair goes back to where it was.         | |
| |                                                      |  | The room JSON does not change.               | |
| |               [ Place here ]     [ Cancel ]          |  |                                              | |
| |                                                      |  |                           [ OK ]             | |
| | Place here -> stays, saved to the room JSON          |  |                                              | |
| | Cancel     -> back to where it was                   |  |                                              | |
| |               (removed, if it was just added)        |  |                                              | |
| +------------------------------------------------------+  +----------------------------------------------+ |
|                                                                                                            |
| D. GAP 1.5 ft OR MORE  ->  placed normally: no red line, no popup.                                         |
| The same rule runs after ADD from the catalog, MOVE and ROTATE. Gaps to walls are not checked here.        |
+------------------------------------------------------------------------------------------------------------+
```

### Main interactions
- While dragging or rotating, a red line with the gap in feet appears between the item and every item less than 1.5 ft away.
- On drop with a gap from 0.5 ft up to 1.5 ft: a popup asks "Would you like to place it here?"; Place here keeps it, Cancel puts it back.
- On drop with a gap under 0.5 ft, or an overlap: not allowed; the item goes back and a message explains the 0.5 ft minimum.
- A gap of 1.5 ft or more: no line, no popup.

### Screen notes
- Recommended 1.5 ft, minimum 0.5 ft (user decision, 2026-11-16).
- The gap is the shortest edge-to-edge distance between the rotated footprints, shown with 2 decimals.
- Open questions: does the red line stay visible after a confirmed close placement; how uploaded files with close items open; any gap to walls.
- Reference: ai-room-redesign UI Mock 28 (red warnings for overlaps); docs/references/distance_measure.png.
- New requirement from the user answers, 2026-11-16.
