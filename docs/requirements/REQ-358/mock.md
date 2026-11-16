# UI Mock 1 — User can start a new room by entering width and length

```text
+------------------------------------------------------------------------------------------------------------+
| AI RD MVP   New room                                                                                       |
+------------------------------------------------------------------------------------------------------------+
| START A NEW ROOM                                                                                           |
| +------------------------------------------------+  +--------------------------------------------------+   |
| | Start from scratch                             |  | PREVIEW (top view)                               |   |
| |                                                |  |     0     4     8    12 ft                       |   |
| | Shape      Rectangle                           |  |     +-----------------+                          |   |
| | Width      [ 12.0 ] ft                         |  |     |                 |                          |   |
| | Length     [ 10.0 ] ft                         |  |     |   12 x 10 ft    |                          |   |
| |                                                |  |     |                 |                          |   |
| | ! Width must be a number greater than 0.       |  |     +-----------------+                          |   |
| |   (under the field; limits: open question)     |  |     (0,0) = top-left corner                      |   |
| |                                                |  |                                                  |   |
| | The room size cannot be changed later.         |  |                                                  |   |
| |                           [ Create room ]      |  |                                                  |   |
| +------------------------------------------------+  +--------------------------------------------------+   |
+------------------------------------------------------------------------------------------------------------+
| AFTER CREATE ROOM  ->  the 2D editor opens with the empty room, drawn from the room JSON                   |
+------------------------------------------------------------------------------------------------------------+
| AI RD MVP   Room 12 x 10 ft (fixed)     [* 2D plan *]  [ 3D view ]     [ Upload JSON ]   [ Download JSON ] |
+------------------------------------------------------------------------------------------------------------+
| ROOM                     |      0     2     4     6     8    10    12 ft        | SELECTED ITEM            |
| Rectangle 12 x 10 ft     |   0  +-----------------------------------+           | (nothing selected)       |
| (size is fixed)          |      |(0,0)                              |           |                          |
|                          |   2  |     .     .     .     .     .     |           | Add furniture from the   |
| VIEW                     |      |                                   |           | catalog on the left.     |
| Units: feet              |   4  |     .     .     .     .     .     |           |                          |
| Grid: 1 dot = 2 ft       |      |      empty room  12 x 10 ft       |           |                          |
| Moves snap: 0.25 ft      |   6  |     .     .     .     .     .     |           |                          |
|                          |      |                                   |           |                          |
| CATALOG   (all white)    |   8  |     .     .     .     .     .     |           |                          |
| Search [ __________ ]    |      |                                   |           |                          |
| Item      W x D x H ft   |  10  +-----------------------------------+           |                          |
+--------------------------+------------------------------------------------------+--------------------------+
| Room JSON:  { schemaVersion: "1.0", units: "ft", origin: "top-left",                                       |
|               room: { width: 12, length: 10, walls: [top, right, bottom, left] }, items: [ ] }  -> [OK]    |
+------------------------------------------------------------------------------------------------------------+
```

### Main interactions
- Type a width and a length in feet; the preview follows as you type.
- An invalid value (empty, zero, negative, not a number) shows a message under the field and Create room does nothing.
- Create room builds the room JSON (schema v1.0, see docs/project/room-plan-schema.md), checks it and opens the 2D editor: the empty room at true scale with a ruler in feet and a grid.
- The room size is fixed after this step; the editor has no control to change it.

### Screen notes
- Rectangle only, and room size not editable (user decisions, 2026-11-16).
- All positions are measured from the top-left floor corner (0,0): x to the right, y down the plan.
- The header shows the two tabs: [* 2D plan *] is active, [ 3D view ] opens the 3D tab (REQ-364).
- Width 12 and length 10 are example values. The allowed range and the exact message wording are open questions.
- The room JSON lines are shown only to explain the data; they are not on screen.
- Layout follows the reference editor (ai-room-redesign UI Mock 10 and 15).
- Based on features.md #1, #2, #3.
