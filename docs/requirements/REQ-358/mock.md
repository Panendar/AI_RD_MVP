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
| |   (under the field; limits: open question)     |  |                                                  |   |
| |                                                |  |                                                  |   |
| |                           [ Create room ]      |  |                                                  |   |
| +------------------------------------------------+  +--------------------------------------------------+   |
+------------------------------------------------------------------------------------------------------------+
| AFTER CREATE ROOM  ->  the 2D editor opens with the empty room, drawn from the room JSON                   |
+--------------------------+------------------------------------------------------+--------------------------+
| ROOM                     |      0     2     4     6     8    10    12 ft        | SELECTED ITEM            |
| Rectangle                |   0  +-----------------------------------+           | (nothing selected)       |
| Width   12.0 ft          |      |                                   |           |                          |
| Length  10.0 ft          |   2  |     .     .     .     .     .     |           | Add furniture from the   |
|                          |      |                                   |           | catalog on the left.     |
| VIEW                     |   4  |     .     .     .     .     .     |           |                          |
| Units: feet              |      |      empty room  12 x 10 ft       |           |                          |
| Grid: 1 dot = 2 ft       |   6  |     .     .     .     .     .     |           |                          |
|                          |      |                                   |           |                          |
| CATALOG  (examples)      |   8  |     .     .     .     .     .     |           |                          |
| Search [ sofa_______ ]   |      |                                   |           |                          |
|                          |  10  +-----------------------------------+           |                          |
+--------------------------+------------------------------------------------------+--------------------------+
| Room JSON:  { room: { width: 12, length: 10, walls: [4 walls] }, furniture: [ ] }   schema check: passed   |
+------------------------------------------------------------------------------------------------------------+
```

### Main interactions
- Type a width and a length in feet; the preview follows as you type.
- An invalid value (empty, zero, negative, not a number) shows a message under the field and Create room does nothing.
- Create room builds the room JSON, checks it against the schema and opens the 2D editor: an empty room at true scale with a ruler in feet along the top and left and a grid.

### Screen notes
- Rectangle only (decided 2026-11-16); room type and shape are not offered.
- Width 12 and length 10 are example values. The allowed range, inches and the exact message wording are open questions.
- The room JSON line is shown only to explain the data; it is not a screen element.
- Layout follows the reference editor: left panel, canvas with ruler, right panel (ai-room-redesign UI Mock 10 and 15).
- Based on features.md #1 Room plan JSON, #2 Create a room, #3 2D plan renders from JSON.
