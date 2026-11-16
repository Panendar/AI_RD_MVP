# UI Mock 2 — User can add Indian furniture from a searchable catalog

```text
+--------------------------------------------------------------------------------------------------+
| AI RD MVP                                                    [ Upload JSON ]   [ Download JSON ] |
+--------------------------------------------------------------------------------------------------+
| +----------------------------------+   2D PLAN  (room 12 x 10 ft)                                |
| | CATALOG                          |        0    2    4    6    8   10   12 ft                   |
| | Search [ sofa               ]    |      0 +----+----+----+----+----+----+                      |
| |                                  |        |    :    :    :    :    :    |                      |
| | <item name>    W x D ft  [ Add ] |      2 +....+....+....+....+....+....+                      |
| | <item name>    W x D ft  [ Add ] |        |    :    :    :    :    :    |                      |
| | <item name>    W x D ft  [ Add ] |      4 +....#==============#....+....+                      |
| |                                  |        |    #     SOFA     #    :    |   <- just added      |
| | No match:                        |      6 +....#   6 x 3 ft   #....+....+      at real size    |
| | "No furniture matches 'sofa'."   |        |    #==============#    :    |                      |
| | (items and sizes: open question) |      8 +....+....+....+....+....+....+                      |
| +----------------------------------+        |    :    :    :    :    :    |                      |
|                                          10 +----+----+----+----+----+----+                      |
|                                                                                                  |
| AFTER CLICKING ADD                                                                               |
|   The item is drawn in the plan at its catalog size and added to the room JSON:                  |
|   furniture: [ { type: "<item>", position, rotation: 0, size: { w, d }, colour } ]               |
+--------------------------------------------------------------------------------------------------+
```

### Main interactions
- Typing in Search narrows the catalog list to matching items.
- Add places the item inside the room at its real size in feet and adds it to the room JSON.
- The sofa and its 6 x 3 ft size are only an illustration of how an item is drawn.

### Screen notes
- The catalog items, sizes, colours and categories are not given in the sources (open question).
- Where a new item is placed and what happens when it does not fit are open questions.
- Based on features.md #5 Add from catalog (REQ-285, REQ-298).
