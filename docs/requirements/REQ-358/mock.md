# UI Mock 1 — User can start a new room by entering width and length

```text
+--------------------------------------------------------------------------------------------------+
| AI RD MVP                                                    [ Upload JSON ]   [ Download JSON ] |
+--------------------------------------------------------------------------------------------------+
| START A NEW ROOM                                                                                 |
| +------------------------------------------+    +----------------------------------------------+ |
| | Room width   (ft)   [ 12        ]        |    | IF A VALUE IS NOT VALID                      | |
| | Room length  (ft)   [ 10        ]        |    | (empty, zero, negative or not a number)      | |
| |                                          |    | "Enter the room width in feet."              | |
| | Shape: rectangle                         |    | [ Create room ] does nothing until fixed.    | |
| |                                          |    | (limits and wording: open question)          | |
| |                 [ Create room ]          |    +----------------------------------------------+ |
| +------------------------------------------+                                                     |
|                                                                                                  |
| AFTER CLICKING CREATE ROOM  —  2D plan, drawn from the room JSON                                 |
|        0    2    4    6    8   10   12 ft                                                        |
|      0 +----+----+----+----+----+----+                                                           |
|        |    :    :    :    :    :    |                                                           |
|      2 +....+....+....+....+....+....+                                                           |
|        |    :    :    :    :    :    |                                                           |
|      4 +....+....+....+....+....+....+                                                           |
|        |    :    :    :    :    :    |   <- empty room, 12 x 10 ft                               |
|      6 +....+....+....+....+....+....+      walls drawn from the room JSON                       |
|        |    :    :    :    :    :    |      1 grid cell = 2 ft                                   |
|      8 +....+....+....+....+....+....+                                                           |
|        |    :    :    :    :    :    |                                                           |
|     10 +----+----+----+----+----+----+                                                           |
|                                                                                                  |
| Room JSON:  room { width: 12, length: 10, walls: 4 }   furniture: [ ]   ->  schema check passed  |
+--------------------------------------------------------------------------------------------------+
```

### Main interactions
- The user types a width and a length in feet and clicks Create room.
- A new room JSON is created and checked against the schema; the 2D plan is drawn from it straight away.
- The plan is to scale: the ruler and the 1-cell = 2 ft grid show the entered size.

### Screen notes
- Rectangle only (decided 2026-11-16); room type and shape are not offered.
- The JSON line under the plan is shown here only to explain the data; showing it on screen is not a requirement.
- Value limits, inches, the error wording and the grid spacing are open questions in req.md.
- Based on features.md #1 Room plan JSON, #2 Create a room, #3 2D plan renders from JSON.
