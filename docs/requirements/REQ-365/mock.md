# REQ-365 mock: 2D edit flows to 3D

```
  2D plan edit                room JSON               3D view
 (add / move / rotate  --->  updated at once  --->  redrawn at once
  resize / delete /                                 (no refresh)
  open file)

+---------------------------+   +---------------------------+
| 2D: [sofa] -- move -->    |   | 3D: sofa moves to the     |
|            [sofa]         |   |     same place            |
+---------------------------+   +---------------------------+
```
