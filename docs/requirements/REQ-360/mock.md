# UI Mock 3 — User can select and move furniture inside the walls

```text
+--------------------------------------------------------------------------------------------------+
| AI RD MVP                                                    [ Upload JSON ]   [ Download JSON ] |
+--------------------------------------------------------------------------------------------------+
| A. CLICK AN ITEM TO SELECT IT                   B. DRAG IT                                       |
| +------------------------------------------+    +----------------------------------------------+ |
| |                                          |    |                                              | |
| |   #==========#   <- selected outline     |    |   . . . . . .      #==========#              | |
| |   #  SOFA    #                           |    |   .  (from)  . --> #  SOFA    #              | |
| |   #==========#                           |    |   . . . . . .      #==========#              | |
| |                                          |    |                                              | |
| |               +------+                   |    |               +------+                       | |
| |               | BED  |                   |    |               | BED  |                       | |
| |               +------+                   |    |               +------+                       | |
| +------------------------------------------+    +----------------------------------------------+ |
|                                                                                                  |
| C. DRAGGING PAST A WALL                                                                          |
| +------------------------------------------+                                                     |
| |                                          |    After every move, the room JSON                  |
| |                             #==========# |    is updated at once:                              |
| |                  drag -->   #  SOFA    # |      furniture[sofa].position = x, y                |
| |                             #==========# |                                                     |
| |          item stops at the right wall ^  |    Deselect: click on empty floor                   |
| +------------------------------------------+    (open question).                                 |
+--------------------------------------------------------------------------------------------------+
```

### Main interactions
- Clicking an item selects it and shows a clear outline.
- Dragging moves the selected item; its position in the room JSON changes straight away.
- The item cannot leave the room: it is kept inside the walls.

### Screen notes
- Whether the item stops at the wall or snaps back, grid snapping, overlap with other furniture, multi-select and keyboard moves are open questions.
- Based on features.md #4 Edit the 2D plan (REQ-297, REQ-299).
