# UI Mock 5 — User can download the design as a JSON file

```text
+------------------------------------------------------------------------------------------------------------+
| AI RD MVP   Room 12 x 10 ft                                            [ Upload JSON ]   [ Download JSON ] |
+------------------------------------------------------------------------------------------------------------+
|                                                                                         ^ click            |
+--------------------------+------------------------------------------------------+--------------------------+
| ROOM                     |      0     2     4     6     8    10    12 ft        | AFTER DOWNLOAD JSON      |
| Width   12.0 ft          |   0  +-----------------------------------+           | Browser saves:           |
| Length  10.0 ft          |      |                                   |           |   <design>.json          |
| 3 items                  |   2  |  +--------------+     +---------+ |           |                          |
|                          |      |  |     SOFA     |     |   BED   | |           | Schema check: [OK]       |
| Sharing = sending the    |   4  |  +--------------+     |         | |           |                          |
| file. No account,        |      |                       +---------+ |           | Send this file to        |
| no cloud storage.        |   6  |                                   |           | anyone; they open it     |
|                          |      |           +---------+             |           | with Upload JSON.        |
|                          |   8  |           |  TABLE  |             |           |                          |
|                          |      |           +---------+             |           |                          |
|                          |  10  +-----------------------------------+           |                          |
+--------------------------+------------------------------------------------------+--------------------------+
| FILE CONTENT (the whole design)                                                                            |
| {                                                                                                          |
|   "room":      { "width": 12, "length": 10, "walls": [ ... 4 walls ... ] },                                |
|   "furniture": [ { "type": "sofa-3-seat", "position": { "x": 1, "y": 2 }, "rotation": 0,                   |
|                    "size": { "w": 5, "d": 2 }, "colour": "#B6A18A" },  ... 3 items ]                       |
| }                                                                                                          |
+------------------------------------------------------------------------------------------------------------+
```

### Main interactions
- Download JSON (top right) saves the current design as a .json file through the browser.
- The file holds the whole design: room size, walls and every item with type, position, rotation, size and colour.
- The file passes the same schema check used when a file is opened.

### Screen notes
- Field names and values are examples; the exact schema is an open question (REQ-358).
- Default file name, naming the design, and whether an empty room can be downloaded are open questions.
- Reference: ai-room-redesign UI Mock 34.
- Based on features.md #6 Download JSON (REQ-315).
