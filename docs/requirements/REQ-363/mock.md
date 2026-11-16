# UI Mock 6 — User can open a design from a JSON file and keep editing

```text
+------------------------------------------------------------------------------------------------------------+
| AI RD MVP   Room 12 x 10 ft                                            [ Upload JSON ]   [ Download JSON ] |
+------------------------------------------------------------------------------------------------------------+
|                                                                       ^ click, choose <design>.json        |
| CHECKING <design>.json against the schema ...                                                              |
+------------------------------------------------------------------------------------------------------------+
| A. FILE IS VALID  ->  the design opens exactly as it was downloaded                                        |
+--------------------------+------------------------------------------------------+--------------------------+
| CATALOG  (examples)      |      0     2     4     6     8    10    12 ft        | OPENED                   |
| Search [ sofa_______ ]   |   0  +-----------------------------------+           | <design>.json            |
|                          |      |                                   |           | Schema check: [OK]       |
| Seating                  |   2  |  +--------------+     +---------+ |           | 3 items                  |
|   Sofa (3 seat)          |      |  |     SOFA     |     |   BED   | |           |                          |
|   Diwan                  |   4  |  +--------------+     |         | |           | Keep editing: move,      |
| Beds                     |      |                       +---------+ |           | rotate, resize,          |
|   Single bed             |   6  |                                   |           | delete, or add from      |
| Storage                  |      |           +---------+             |           | the catalog.             |
|                          |   8  |           |  TABLE  |             |           |                          |
|                          |      |           +---------+             |           |                          |
|                          |  10  +-----------------------------------+           |                          |
+--------------------------+------------------------------------------------------+--------------------------+
| B. FILE IS NOT VALID                                                                                       |
| +----------------------------------------------------------+                                               |
| | ! This file is not a valid room design.                  |   The design on screen is NOT replaced.       |
| |   <reason, e.g. "furniture item 2 has no size">          |   Wording and detail: open question.          |
| |                                                          |                                               |
| |                                               [ OK ]     |                                               |
| +----------------------------------------------------------+                                               |
+------------------------------------------------------------------------------------------------------------+
```

### Main interactions
- Upload JSON opens a file picker; the chosen file is checked against the schema.
- A valid file replaces the current design and is drawn exactly as it was saved; editing and the catalog work as usual.
- An invalid file is rejected with a clear message, and the current design stays on screen.
- Downloading the opened design again gives a file with the same design.

### Screen notes
- This is how a design is shared: the receiver uploads the file and keeps editing.
- Open questions: a warning before replacing the current design, how detailed the error is, valid files with items outside the walls or unknown types, a file size limit.
- Reference: ai-room-redesign UI Mock 34.
- Based on features.md #7 Upload JSON (REQ-315) and #1 Room plan JSON (REQ-290).
