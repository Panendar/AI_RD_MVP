# UI Mock 5 — User can download the design as a JSON file

```text
+--------------------------------------------------------------------------------------------------+
| AI RD MVP                                                    [ Upload JSON ]   [ Download JSON ] |
+--------------------------------------------------------------------------------------------------+
|                                                                                 ^                |
|                                                                   click Download JSON            |
|                                                                                                  |
| +------------------------------------------+    +----------------------------------------------+ |
| | 2D PLAN (current design)                 |    | AFTER CLICKING DOWNLOAD JSON                 | |
| |                                          |    | The browser saves  <design>.json             | |
| |   +-----------------------------+        |    |                                              | |
| |   |  [SOFA]          [BED]      |        |    | {                                            | |
| |   |                             |        |    |   "room": { "width": 12, "length": 10,       | |
| |   |        [TABLE]              |        |    |             "walls": [ ... ] },              | |
| |   +-----------------------------+        |    |   "furniture": [                             | |
| |   room 12 x 10 ft, 3 items               |    |     { "type", "position", "rotation",        | |
| +------------------------------------------+    |       "size", "colour" }, ... 3 items        | |
|                                                 |   ]                                          | |
|                                                 | }                                            | |
|                                                 | schema check: passed                         | |
|                                                 +----------------------------------------------+ |
|                                                                                                  |
| Sharing = sending this file. No account, no cloud storage.                                       |
+--------------------------------------------------------------------------------------------------+
```

### Main interactions
- Download JSON saves the current design as a .json file through the browser.
- The file holds the whole design: room size, walls and every item with type, position, rotation, size and colour.
- The file passes the same schema check that is used when a file is opened.

### Screen notes
- Field names in the JSON are illustrative; the exact schema is an open question (REQ-358).
- The default file name, naming the design and downloading an empty room are open questions.
- Based on features.md #6 Download JSON (REQ-315).
