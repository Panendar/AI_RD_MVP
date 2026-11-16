# UI Mock 8 — User sees 2D edits appear in the 3D view at once

```text
+--------------------------------------------------------------------------------------------------+
| AI RD MVP                                                    [ Upload JSON ]   [ Download JSON ] |
+--------------------------------------------------------------------------------------------------+
| BEFORE                                                                                           |
| +--------------------------------------+  +--------------------------------------------------+   |
| | 2D PLAN                              |  | 3D PREVIEW                                       |   |
| | +--------------------------------+   |  |       ___________________________                |   |
| | | #SOFA#               [BED]     |   |  |      /  [SOFA]          [BED]   /|               |   |
| | |   (selected)                   |   |  |     /         [TABLE]          / |               |   |
| | |          [TABLE]               |   |  |    /__________________________/  /               |   |
| | +--------------------------------+   |  |    |__________________________|_/                |   |
| +--------------------------------------+  +--------------------------------------------------+   |
|                                                                                                  |
| AFTER DRAGGING THE SOFA TO THE RIGHT  (no refresh, no extra click)                               |
| +--------------------------------------+  +--------------------------------------------------+   |
| | 2D PLAN                              |  | 3D PREVIEW                                       |   |
| | +--------------------------------+   |  |       ___________________________                |   |
| | |               #SOFA#  [BED]    |   |  |      /          [SOFA]  [BED]   /|               |   |
| | |                  (moved)       |   |  |     /         [TABLE]          / |               |   |
| | |          [TABLE]               |   |  |    /__________________________/  /               |   |
| | +--------------------------------+   |  |    |__________________________|_/                |   |
| +--------------------------------------+  +--------------------------------------------------+   |
|                                                                                                  |
| Same for add, rotate, resize, delete and opening a file:  2D edit -> room JSON -> 3D, at once.   |
+--------------------------------------------------------------------------------------------------+
```

### Main interactions
- Every change to the design (add, move, rotate, resize, delete, open a file) shows in 3D straight away.
- The user never has to refresh or press anything to update the 3D view.

### Screen notes
- Whether 3D follows during a drag or only on drop, whether the camera stays put, and whether 3D allows edits are open questions.
- Based on features.md #8 3D preview (REQ-317, REQ-318).
