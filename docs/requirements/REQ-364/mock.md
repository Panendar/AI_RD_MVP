# UI Mock 8 — User can view the design in 3D and orbit, zoom and pan

```text
+------------------------------------------------------------------------------------------------------------+
| AI RD MVP   Room 12 x 10 ft (fixed)     [ 2D plan ]  [* 3D view *]     [ Upload JSON ]   [ Download JSON ] |
+------------------------------------------------------------------------------------------------------------+
| +------------------------------------------------------------------------+                                 |
| | 3D VIEW  (everything white)                             [ Reset view ] |   THE 3D TAB IS BUILT           |
| |         +--------------------------------------------------+           |   FROM THE ROOM JSON            |
| |         |\                   back wall                    /|           |                                 |
| |         | \                                              / |           |   Room 12 x 10 ft               |
| |         |  +--------------------------------------------+  |           |   3 items                       |
| |         |  |  [SOFA]                    [LOCKER]        |  |           |   All white                     |
| |         |  |                                            |  |           |                                 |
| |         |  |     [TABLE]                                |  |           |   Items stand on the            |
| |         |  +--------------------------------------------+  |           |   floor at their width,         |
| |         | /                    floor                     \ |           |   depth and height,             |
| |         |/                                                \|           |   facing their rotation.        |
| |         +--------------------------------------------------+           |                                 |
| |         drag = orbit    wheel = zoom    right-drag = pan               |   [ 2D plan ] tab to edit       |
| +------------------------------------------------------------------------+                                 |
|                                                                                                            |
| 3D is a preview: simple white shapes on the floor, with the four walls.                                    |
+------------------------------------------------------------------------------------------------------------+
```

### Main interactions
- Click the 3D view tab: the room is built from the room JSON (floor, four walls, every item at its position, facing, width, depth and height).
- Drag to orbit, scroll to zoom, right-drag to pan; Reset view returns to the starting camera.
- Click the 2D plan tab to go back and edit.

### Screen notes
- 3D in its own tab; everything white (user decisions, 2026-11-16). Not photorealistic (intent: Not goals).
- Open questions: wall height; box vs simple per-item shapes; the mouse controls and Reset view; how white items stand out from white walls.
- Reference: ai-room-redesign UI Mock 36 and 37.
- Based on features.md #8 3D preview.
