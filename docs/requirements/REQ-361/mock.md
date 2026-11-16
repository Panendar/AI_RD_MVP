# REQ-361 mock: Rotate, resize, delete

```
  +-------------------------------------+
  |        (rotate)                     |
  |           o                         |
  |   #=======|=======#                 |
  |   #    item       #  []  <- resize  |
  |   #===============#      handle     |
  |                                     |
  |  Selected: item   [ Rotate ] [ Delete ]
  +-------------------------------------+

Flow: select item -> rotate / resize (kept inside walls) / delete
      -> room JSON rotation / size updated, or item removed, at once
(Rotation steps, resize method and delete confirmation are open questions.)
```
