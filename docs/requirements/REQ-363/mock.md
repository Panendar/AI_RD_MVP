# UI Mock 7 — User can open a design from a JSON file and keep editing

```text
+------------------------------------------------------------------------------------------------------------+
| AI RD MVP   Room 12 x 10 ft (fixed)     [* 2D plan *]  [ 3D view ]     [ Upload JSON ]   [ Download JSON ] |
+------------------------------------------------------------------------------------------------------------+
|                                                                       ^ click, choose <design>.json        |
| CHECKING <design>.json  ->  schema v1.0  ->  rules (walls, ids, inside walls, catalog sizes, 0.5 ft gaps)  |
+------------------------------------------------------------------------------------------------------------+
| A. FILE IS VALID  ->  the design opens exactly as it was downloaded                                        |
+--------------------------+------------------------------------------------------+--------------------------+
| CATALOG   (all white)    |      0     2     4     6     8    10    12 ft        | OPENED                   |
| Search [ __________ ]    |   0  +-----------------------------------+           | <design>.json            |
| Item      W x D x H ft   |      | +------------------+              |           | Schema check: [OK]       |
| Bed       5.0x6.5x1.5    |   2  | |       SOFA       |              |           | Rules check:  [OK]       |
| Sofa      6.5x3.0x2.75   |      | +------------------+              |           | 3 items                  |
| Table     4.0x2.5x2.5    |   4  |                                   |           |                          |
| Chair     1.5x1.5x3.0    |      |                                   |           | Shown exactly as saved:  |
| TV        4.0x1.0x3.0    |   6  |    +-----------+     +--------+   |           | no red lines, no popups. |
| Locker    3.0x1.75x6.5   |      |    |   TABLE   |     | LOCKER |   |           |                          |
|                          |   8  |    +-----------+     |        |   |           | Keep editing: move,      |
|                          |      |                      +--------+   |           | rotate, delete, or       |
|                          |  10  +-----------------------------------+           | drag from the catalog.   |
+--------------------------+------------------------------------------------------+--------------------------+
| B. FILE IS NOT VALID                                                                                       |
| +----------------------------------------------------------+                                               |
| | ! This file is not a valid room design.                  |   The design on screen is NOT replaced.       |
| |   <reason, e.g. "item-2 (TV) is 0.25 ft from item-1;     |   Wording and detail: open question.          |
| |    items must be at least 0.5 ft apart">                 |                                               |
| |                                                          |                                               |
| |                                              [ OK ]      |                                               |
| +----------------------------------------------------------+                                               |
+------------------------------------------------------------------------------------------------------------+
```

### Main interactions
- Upload JSON opens a file picker; the file is checked against the schema and the business rules.
- A valid file replaces the current design and is drawn exactly as it was saved; the room size is fixed as in the file.
- An invalid file is rejected with a clear message, and the current design stays on screen.
- Downloading the opened design again gives a file with the same design.

### Screen notes
- Sharing = the receiver uploads the file and keeps editing.
- Opens exactly as saved and shared, with no red lines (user decision, 2026-11-16).
- Open questions: warning before replacing; error detail; size limit.
- Reference: ai-room-redesign UI Mock 34.
- Based on features.md #7 Upload JSON and #1 Room plan JSON.
