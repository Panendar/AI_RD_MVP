# REQ-362 mock: Download JSON

```
+-------------------------------------------------------+
|  [ Download JSON ]   [ Upload JSON ]                  |
+-------------------------------------------------------+
|  2D plan ...                                          |

Flow: [ Download JSON ] -> current room JSON (schema check passes)
      -> browser saves <design>.json

<design>.json
{
  room: { width, length, walls },
  furniture: [ { type, position, rotation, size, colour }, ... ]
}
(Field names are illustrative; the schema is an open question in REQ-358.)
```
