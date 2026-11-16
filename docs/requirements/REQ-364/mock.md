# UI Mock 7 — User can view the design in 3D and orbit, zoom and pan

```text
+--------------------------------------------------------------------------------------------------+
| AI RD MVP                                                    [ Upload JSON ]   [ Download JSON ] |
+--------------------------------------------------------------------------------------------------+
| +--------------------------------------+  +--------------------------------------------------+   |
| | 2D PLAN                              |  | 3D PREVIEW                        [ Reset view ] |   |
| |                                      |  |           ___________________________            |   |
| | +--------------------------------+   |  |          /|                         /|           |   |
| | | [SOFA]               [BED]     |   |  |         / |  [SOFA]         [BED]  / |           |   |
| | |                                |   |  |        /  |                       /  |           |   |
| | |                                |   |  |       /___|______________________/   |           |   |
| | |          [TABLE]               |   |  |       |   |     [TABLE]          |   |           |   |
| | |                                |   |  |       |   /______________________|___/           |   |
| | +--------------------------------+   |  |       |  /                       |  /            |   |
| |                                      |  |       |_/________________________|_/             |   |
| |                                      |  |                                                  |   |
| |                                      |  | drag = orbit   wheel = zoom   right-drag = pan   |   |
| +--------------------------------------+  +--------------------------------------------------+   |
|                                                                                                  |
| Both views are drawn from the same room JSON: same items, positions, rotations and sizes.        |
+--------------------------------------------------------------------------------------------------+
```

### Main interactions
- The 3D preview shows the room and every item from the room JSON.
- The user can orbit, zoom and pan around the room.

### Screen notes
- It is a preview, not a photorealistic render (intent: Not goals).
- Side by side with 2D, or in its own tab, is an open question; side by side is only shown here.
- The mouse controls and the Reset view button are illustrative (open question).
- Wall height, floor look, item heights and 3D shapes (boxes or models) are open questions.
- Based on features.md #8 3D preview (REQ-317, REQ-318).
