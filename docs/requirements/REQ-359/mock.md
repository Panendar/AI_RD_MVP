# REQ-359 mock: Add from catalog

```
+--------------------------+-------------------------------------+
| Catalog                  |  2D plan                            |
| Search [ sofa        ]   |  +-------------------------------+  |
|                          |  |                               |  |
|  > (matching item)  [+]  |  |      +-----------+            |  |
|  > (matching item)  [+]  |  |      |  item     |  <- added  |  |
|  > (matching item)  [+]  |  |      | (real size)|           |  |
|                          |  |      +-----------+            |  |
|                          |  |                               |  |
|                          |  +-------------------------------+  |
+--------------------------+-------------------------------------+

Flow: search -> pick item [+] -> item added to room JSON -> drawn in plan at real size
(Catalog items, categories and placement are open questions.)
```
