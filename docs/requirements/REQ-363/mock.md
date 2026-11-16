# UI Mock 6 — User can open a design from a JSON file and keep editing

```text
+--------------------------------------------------------------------------------------------------+
| AI RD MVP                                                    [ Upload JSON ]   [ Download JSON ] |
+--------------------------------------------------------------------------------------------------+
|                      ^                                                                           |
|             click Upload JSON  ->  choose <design>.json  ->  schema check                        |
|                                                                                                  |
| +--------------------------------------------+    +--------------------------------------------+ |
| | A. FILE IS VALID                           |    | B. FILE IS NOT VALID                       | |
| |                                            |    |                                            | |
| |   +-----------------------------+          |    |   ! "This file is not a valid room design. | |
| |   |  [SOFA]          [BED]      |          |    |      <reason, e.g. furniture[2] has no     | |
| |   |                             |          |    |      size>"                                | |
| |   |        [TABLE]              |          |    |                                   [ OK ]   | |
| |   +-----------------------------+          |    |                                            | |
| |   Same design as when it was downloaded.   |    |   The design on screen is not replaced.    | |
| |   Move, rotate, resize, delete and         |    |   (message wording: open question)         | |
| |   [ Catalog ] add work as usual.           |    |                                            | |
| +--------------------------------------------+    +--------------------------------------------+ |
|                                                                                                  |
| Download JSON again  ->  a file with the same design.                                            |
+--------------------------------------------------------------------------------------------------+
```

### Main interactions
- Upload JSON opens a file picker; the chosen file is checked against the schema.
- A valid file replaces the current design and is drawn in the 2D plan exactly as it was saved.
- An invalid file is rejected with a clear message and the current design stays as it was.

### Screen notes
- This is how a design is shared: the receiver uploads the file and keeps editing or adds from the catalog.
- A warning before replacing unsaved work, the detail of the error message, valid files with items outside the walls or unknown types, and a size limit are open questions.
- Based on features.md #7 Upload JSON (REQ-315) and #1 Room plan JSON (REQ-290).
