# UI Mock 6 — User can download the design as a JSON file

```text
+------------------------------------------------------------------------------------------------------------+
| AI RD MVP   Room 12 x 10 ft (fixed)     [* 2D plan *]  [ 3D view ]     [ Upload JSON ]   [ Download JSON ] |
+------------------------------------------------------------------------------------------------------------+
|                                                                                         ^ click            |
+--------------------------+------------------------------------------------------+--------------------------+
| ROOM                     |      0     2     4     6     8    10    12 ft        | AFTER DOWNLOAD JSON      |
| 12 x 10 ft (fixed)       |   0  +-----------------------------------+           | Browser saves:           |
| 3 items, all white       |      | +------------------+              |           |   <design>.json          |
|                          |   2  | |       SOFA       |              |           |                          |
| Sharing = sending the    |      | +------------------+              |           | Schema check: [OK]       |
| file. No account,        |   4  |                                   |           | Rules check:  [OK]       |
| no cloud storage.        |      |                                   |           |                          |
|                          |   6  |    +-----------+     +--------+   |           | Send this file to        |
|                          |      |    |   TABLE   |     | LOCKER |   |           | anyone; they open it     |
|                          |   8  |    +-----------+     |        |   |           | with Upload JSON.        |
|                          |      |                      +--------+   |           |                          |
|                          |  10  +-----------------------------------+           |                          |
+--------------------------+------------------------------------------------------+--------------------------+
| FILE CONTENT (the whole design, schema v1.0)                                                               |
| { "schemaVersion": "1.0", "units": "ft", "origin": "top-left",                                             |
|   "room":  { "width": 12, "length": 10, "height": 10, "walls": [ top, right, bottom, left ] },             |
|   "items": [ { "id": "item-1", "catalogId": "sofa", "name": "Sofa (3 seat)",                               |
|              "position": { "x": 3.75, "y": 2.0 }, "size": { "width": 6.5, "depth": 3.0, "height": 2.75 },  |
|                "rotation": 0, "colour": "#FFFFFF" },  ... 3 items ] }                                      |
+------------------------------------------------------------------------------------------------------------+
```

### Main interactions
- Download JSON (top right) saves the current design as a .json file through the browser.
- The file holds the whole design: room size and walls, and every item with catalog id, name, centre position, width/depth/height, rotation (facing) and colour.
- The file passes the schema check and the business rules used when a file is opened.

### Screen notes
- Format: docs/project/room-plan-schema.md (schema v1.0).
- Open questions: default file name, naming the design, downloading an empty room.
- Reference: ai-room-redesign UI Mock 34.
- Based on features.md #6 Download JSON.
