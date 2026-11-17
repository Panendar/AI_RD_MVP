# UI Mock 8 - User can view the design in 3D and orbit, zoom and pan

```text
+------------------------------------------------------------------------------------------------------------+
| AI RD MVP   Room 12 x 10 ft (fixed)     [ 2D plan ]  [* 3D view *]     [ Upload JSON ]   [ Download JSON ] |
+------------------------------------------------------------------------------------------------------------+
| +------------------------------------------------------------------------+                                 |
| | 3D VIEW  (everything white, shaded + outlined)          [ Reset view ] |   THE 3D TAB IS BUILT           |
| |         +--------------------------------------------------+           |   FROM THE ROOM JSON            |
| |         |\                   back wall                    /|           |                                 |
| |         | \                                              / |           |   Room 12 x 10 ft               |
| |         |  +--------------------------------------------+  |           |   Walls 10 ft high              |
| |         |  |  (sofa shape)              (locker shape)  |  |           |   3 items, all white            |
| |         |  |                                            |  |           |                                 |
| |         |  |     (table shape)                          |  |           |   Each item is a simple         |
| |         |  +--------------------------------------------+  |           |   shape you can recognise       |
| |         | /                    floor                     \ |           |   (bed, sofa, chair...),        |
| |         |/                                                \|           |   no name labels, at its        |
| |         +--------------------------------------------------+           |   width, depth, height and      |
| |         drag = orbit    scroll = zoom    right-drag = pan              |   facing.                       |
| +------------------------------------------------------------------------+                                 |
|                                                                                                            |
| Start view: above the bottom-left corner, looking toward the top-right, about 45 deg down, whole room seen.|
| Shown every time the 3D tab opens. 3D is a preview, not photorealistic.                                    |
+------------------------------------------------------------------------------------------------------------+
```

### Main interactions
- Click the 3D view tab: the room is built from the room JSON (floor, four walls, every item as a recognisable white shape at its position, facing, width, depth and height).
- Drag to orbit, scroll to zoom, right-drag to pan; Reset view returns to the start view.
- Each time the 3D tab is opened, the camera starts from the start view.
- Click the 2D plan tab to go back and edit; the plan is unchanged.

### Screen notes
- 3D in its own tab; everything white; walls 10 ft; camera back to the start view on every visit (user decisions, 2026-11-16).
- Recognisable shapes, shading and outlines (user decisions, 2026-11-17). Not photorealistic (intent: Not goals).
- Reference: ai-room-redesign UI Mock 36 and 37.
- Based on features.md #8 3D preview.
