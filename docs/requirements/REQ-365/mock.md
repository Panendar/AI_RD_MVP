# UI Mock 9 — User sees 2D edits appear in the 3D view at once

```text
+------------------------------------------------------------------------------------------------------------+
| AI RD MVP   Room 12 x 10 ft (fixed)     [* 2D plan *]  [ 3D view ]     [ Upload JSON ]   [ Download JSON ] |
+------------------------------------------------------------------------------------------------------------+
| 1. IN THE 2D PLAN TAB, DRAG THE SOFA TO THE RIGHT                                                          |
| +--------------------------------------+               +--------------------------------------+            |
| | 2D PLAN TAB                          |               | 2D PLAN TAB                          |            |
| | +--------------------------------+   |               | +--------------------------------+   |            |
| | | #SOFA#              [LOCKER]   |   |   -- drag --> | |            #SOFA#   [LOCKER]   |   |            |
| | | (selected)                     |   |               | |            (moved)             |   |            |
| | |                                |   |               | |                                |   |            |
| | |  [TABLE]                       |   |               | |  [TABLE]                       |   |            |
| | +--------------------------------+   |               | +--------------------------------+   |            |
| +--------------------------------------+               +--------------------------------------+            |
|    room JSON updated at once:  items[0].position.x  3.75 -> 6.75                                           |
|                                                                                                            |
| 2. CLICK THE [ 3D view ] TAB  ->  sofa already in its new place; camera at the start view (no refresh)     |
| +------------------------------------------------------------------------+                                 |
| | 3D VIEW  (everything white)                             [ Reset view ] |                                 |
| |         +--------------------------------------------------+           |                                 |
| |         |\                   back wall                    /|           |                                 |
| |         | \                                              / |           |                                 |
| |         |  +--------------------------------------------+  |           |                                 |
| |         |  |               [SOFA]       [LOCKER]        |  |           |                                 |
| |         |  |                                            |  |           |                                 |
| |         |  |     [TABLE]                                |  |           |                                 |
| |         |  +--------------------------------------------+  |           |                                 |
| |         | /                    floor                     \ |           |                                 |
| |         |/                                                \|           |                                 |
| |         +--------------------------------------------------+           |                                 |
| |         drag = orbit    wheel = zoom    right-drag = pan               |                                 |
| +------------------------------------------------------------------------+                                 |
|                                                                                                            |
| The same for add, move, rotate (10 deg steps), delete and opening a file:  2D edit -> room JSON -> 3D tab. |
+------------------------------------------------------------------------------------------------------------+
```

### Main interactions
- Every change made in the 2D tab (add, move, rotate, delete, open a file) is in the 3D tab the next time it is opened.
- Switching tabs never needs a refresh or an extra button; both tabs always show the same design.

### Screen notes
- 3D in its own tab (user decision, 2026-11-16).
- The camera returns to the start view on every visit (user decision, 2026-11-16). Open question: is the 3D tab view-only.
- Based on features.md #8 3D preview.
