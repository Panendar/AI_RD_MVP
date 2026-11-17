# UI Mock 7 - User can open a design from a JSON file and keep editing

```text
+------------------------------------------------------------------------------------------------------------+
| AI RD MVP   Room 12 x 10 ft (fixed)     [* 2D plan *]  [ 3D view ]     [ Upload JSON ]   [ Download JSON ] |
+------------------------------------------------------------------------------------------------------------+
|                                                                       ^ click, choose <design>.json        |
| CHECKING <design>.json -> size <= 1 MB -> schema v1.0 -> rules (walls, ids, inside walls, catalog, overlap)|
+------------------------------------------------------------------------------------------------------------+
| A. FILE IS VALID  ->  the design opens exactly as it was downloaded                                        |
+--------------------------+------------------------------------------------------+--------------------------+
| CATALOG   (all white)    |      0     2     4     6     8    10    12 ft        | OPENED                   |
| Search [ __________ ]    |   0  +-----------------------------------+           | <design>.json            |
| Item      W x D x H ft   |      | +------------------+              |           | Size check:   [OK]       |
| Bed       5.0x6.5x1.5    |   2  | |       SOFA       |              |           | Schema check: [OK]       |
| Sofa      6.5x3.0x2.75   |      | +------------------+              |           | Rules check:  [OK]       |
| Table     4.0x2.5x2.5    |   4  |                                   |           | 3 items                  |
| Chair     1.5x1.5x3.0    |      |                                   |           |                          |
| TV        4.0x1.0x3.0    |   6  |    +-----------+     +--------+   |           | Shown exactly as saved:  |
| Locker    3.0x1.75x6.5   |      |    |   TABLE   |     | LOCKER |   |           | no red lines, no popups. |
|                          |   8  |    +-----------+     |        |   |           |                          |
|                          |      |                      +--------+   |           | Keep editing: move,      |
|                          |  10  +-----------------------------------+           | rotate, delete, or       |
|                          |                                                      | drag from the catalog.   |
+--------------------------+------------------------------------------------------+--------------------------+
| A2. A DESIGN IS ALREADY OPEN (shown after the file passed all checks)                                      |
| +----------------------------------------------------------+                                               |
| | Replace the current design with <design>.json?           |   Cancel keeps the current design.            |
| | The current design will be lost.                         |                                               |
| |                                [ Cancel ]   [ Replace ]  |                                               |
| +----------------------------------------------------------+                                               |
+------------------------------------------------------------------------------------------------------------+
| B. FILE IS NOT VALID (schema, a rule, or larger than 1 MB)                                                 |
| +----------------------------------------------------------+                                               |
| | ! This file is not a valid room design.                  |   One general message; no field or rule is    |
| |                                                          |   named. The design on screen is NOT replaced.|
| |                                              [ OK ]      |                                               |
| +----------------------------------------------------------+                                               |
+------------------------------------------------------------------------------------------------------------+
```

### Main interactions
- Upload JSON opens a file picker; the file must be 1 MB or smaller and is checked against the schema and the business rules.
- If a design is already open and the file is valid, the user confirms Replace or Cancel first.
- A confirmed valid file replaces the current design and is drawn exactly as it was saved; the room size is fixed as in the file.
- An invalid or oversized file is rejected with one general message, and the current design stays on screen.
- Downloading the opened design again gives a file with the same design.

### Screen notes
- Sharing = the receiver uploads the file and keeps editing.
- Opens exactly as saved and shared, with no red lines (user decision, 2026-11-16).
- Reference: ai-room-redesign UI Mock 34.
- Based on features.md #7 Upload JSON and #1 Room plan JSON.
