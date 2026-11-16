# UI Mock 7 — User can view the design in 3D and orbit, zoom and pan

```text
+------------------------------------------------------------------------------------------------------------+
| AI RD MVP   Room 12 x 10 ft                                            [ Upload JSON ]   [ Download JSON ] |
+------------------------------------------------------------------------------------------------------------+
| +----------------------------------+  +----------------------------------------------------------------+   |
| | 2D PLAN                          |  | 3D VIEW                                         [ Reset view ] |   |
| | +----------------------------+   |  |     +--------------------------------------------------+       |   |
| | | #SOFA#             [BED]   |   |  |     |\                   back wall                    /|       |   |
| | | (selected)                 |   |  |     | \                                              / |       |   |
| | |                            |   |  |     |  +--------------------------------------------+  |       |   |
| | |        [TABLE]             |   |  |     |  |  [SOFA]                 [BED]              |  |       |   |
| | +----------------------------+   |  |     |  |                                            |  |       |   |
| +----------------------------------+  |     |  |             [TABLE]                        |  |       |   |
|                                       |     |  +--------------------------------------------+  |       |   |
| Both views read the same              |     | /                    floor                     \ |       |   |
| room JSON: same items,                |     |/                                                \|       |   |
| positions, rotations,                 |     +--------------------------------------------------+       |   |
| sizes and colours.                    |     drag = orbit    wheel = zoom    right-drag = pan           |   |
|                                       +----------------------------------------------------------------+   |
|                                                                                                            |
| 3D is a preview: simple shapes (boxes) with the item colour, room floor and four walls.                    |
+------------------------------------------------------------------------------------------------------------+
```

### Main interactions
- The 3D view is built from the room JSON: floor, four walls and every item at its position, rotation, size and colour.
- Drag to orbit, scroll to zoom, right-drag to pan; Reset view returns to the starting camera.

### Screen notes
- Not photorealistic (intent: Not goals).
- Side by side with the 2D plan is shown; a separate 3D tab is the alternative (open question).
- Mouse controls and Reset view follow the reference; confirm (open question). Wall height, item heights and shapes are open questions.
- Reference: ai-room-redesign UI Mock 36 and 37.
- Based on features.md #8 3D preview (REQ-317, REQ-318).
