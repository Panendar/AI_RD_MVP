# UI Mock 4 — User can rotate, resize and delete furniture

```text
+--------------------------------------------------------------------------------------------------+
| AI RD MVP                                                    [ Upload JSON ]   [ Download JSON ] |
+--------------------------------------------------------------------------------------------------+
| SELECTED ITEM TOOLBAR:   Selected: SOFA  6 x 3 ft     [ Rotate ]   [ Resize ]   [ Delete ]       |
|                                                                                                  |
| +----------------------------+   +----------------------------+   +----------------------------+ |
| | A. ROTATE                  |   | B. RESIZE                  |   | C. DELETE                  | |
| |                            |   |                            |   |                            | |
| |       o  <- rotate handle  |   |    #========#              |   |    #========#              | |
| |    #==|=====#              |   |    #  SOFA  #[]            |   |    #  SOFA  #              | |
| |    #  SOFA  #              |   |    #========#  <- handle   |   |    #========#              | |
| |    #========#              |   |         |                  |   |         |                  | |
| |         |                  |   |         v                  |   |         v  [ Delete ]      | |
| |         v   turned 90      |   |    #============#          |   |                            | |
| |       #====#               |   |    #  SOFA      #          |   |    (item removed)          | |
| |       # S  #               |   |    #============#          |   |                            | |
| |       # O  #               |   |    size 8 x 3 ft           |   |                            | |
| |       #====#               |   |                            |   |                            | |
| +----------------------------+   +----------------------------+   +----------------------------+ |
|                                                                                                  |
| IF A ROTATE OR RESIZE WOULD CROSS A WALL:  it is not applied; the item stays as it was.          |
| Room JSON after each edit:  rotation / size updated, or the item removed from furniture[ ].      |
+--------------------------------------------------------------------------------------------------+
```

### Main interactions
- With an item selected, the user can rotate it, resize it or delete it.
- Each change shows in the plan and in the room JSON straight away.
- A rotate or resize that would take the item outside the walls is not applied.

### Screen notes
- Handles and toolbar buttons are both shown; which ones to build is an open question.
- Rotation steps (free, 15, 90), typed sizes, keeping proportions, delete confirmation, undo and colour editing are open questions.
- Based on features.md #4 Edit the 2D plan (REQ-297, REQ-299).
