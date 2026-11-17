# Room plan JSON (schema v1.0)

One JSON file holds the whole design. The 2D plan, the 3D view, Download JSON and Upload JSON all read and write this format.
Status: draft, from the user's decisions on 2026-11-16. Used by REQ-358 (create), REQ-359 (add), REQ-360 (move), REQ-361 (rotate, delete), REQ-366 (clearance), REQ-362 (download), REQ-363 (upload), REQ-364 and REQ-365 (3D).

## Measuring rules
- **Units:** feet, for every length.
- **Origin:** the **top-left corner of the room floor** as seen in the 2D plan is (0, 0). Every position is measured from this one corner.
  - `x` runs to the right, along the room **width**.
  - `y` runs down the plan, along the room **length**.
  - `z` runs up from the floor (used by 3D). All items stand on the floor (z = 0).
- **Item position:** the **centre of the item's footprint**, measured from the origin. It is the point the item rotates around. Moves snap to **0.25 ft**, except against a wall: an item always stops touching the wall (user decision, 2026-11-17: no gap, like in real life), so next to a wall `x` or `y` is exact to **0.01 ft** (for example a locker 1.75 ft deep turned 90� against the left wall has `x` 0.875 -> 0.88). `x` and `y` are multiples of 0.01.
- **Item size:** `width` (side to side, seen from the front), `depth` (front to back) and `height` (floor to top). It comes from the catalog and cannot be edited.
- **Facing (`rotation`):** the direction the item's **front** points, in degrees clockwise in the 2D plan, in 10° steps (0, 10 ... 350).
  - `0` = the front faces the **bottom wall** (+y), the "south" of the plan.
  - `90` = it faces the **left wall** (-x), `180` = the **top wall** (-y), `270` = the **right wall** (+x).
  - Front per item: bed = foot end, sofa and chair = seat side, table = any long side, TV = screen, locker = door.
- **Colour:** always white (`#FFFFFF`), in 2D and 3D. It cannot be edited.
- **Room size:** set once, when the room is created. It cannot be edited afterwards.
  - Width and length are each **6 to 30 ft**, in 0.25 ft steps, which covers normal Indian rooms (user decision, 2026-11-16).
  - **Wall height is 10 ft** for every room, the usual ceiling height in Indian homes. It is fixed and not asked for.

## Catalog
| catalogId | Name | width ft | depth ft | height ft |
|---|---|---|---|---|
| `bed` | Bed (queen) | 5.0 | 6.5 | 1.5 |
| `sofa` | Sofa (3 seat) | 6.5 | 3.0 | 2.75 |
| `table` | Table (4 seat) | 4.0 | 2.5 | 2.5 |
| `chair` | Chair | 1.5 | 1.5 | 3.0 |
| `tv` | TV (on stand) | 4.0 | 1.0 | 3.0 |
| `locker` | Locker (steel almirah) | 3.0 | 1.75 | 6.5 |

The item list and the sizes are decided by the user (2026-11-16): standard sizes for normal Indian homes.

## Example
```json
{
  "schemaVersion": "1.0",
  "units": "ft",
  "origin": "top-left",
  "room": {
    "width": 12,
    "length": 10,
    "height": 10,
    "walls": [
      { "id": "top",    "from": { "x": 0,  "y": 0 },  "to": { "x": 12, "y": 0 } },
      { "id": "right",  "from": { "x": 12, "y": 0 },  "to": { "x": 12, "y": 10 } },
      { "id": "bottom", "from": { "x": 12, "y": 10 }, "to": { "x": 0,  "y": 10 } },
      { "id": "left",   "from": { "x": 0,  "y": 10 }, "to": { "x": 0,  "y": 0 } }
    ]
  },
  "items": [
    {
      "id": "item-1",
      "catalogId": "sofa",
      "name": "Sofa (3 seat)",
      "position": { "x": 4.25, "y": 1.5 },
      "size": { "width": 6.5, "depth": 3.0, "height": 2.75 },
      "rotation": 0,
      "colour": "#FFFFFF"
    },
    {
      "id": "item-2",
      "catalogId": "tv",
      "name": "TV (on stand)",
      "position": { "x": 4.25, "y": 9.5 },
      "size": { "width": 4.0, "depth": 1.0, "height": 3.0 },
      "rotation": 180,
      "colour": "#FFFFFF"
    }
  ]
}
```
The sofa's back is against the top wall and its seat faces down the room (0°). The TV is against the bottom wall with its screen facing up the room, toward the sofa (180°).

## JSON Schema
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "room-plan.schema.json",
  "title": "Room plan",
  "type": "object",
  "additionalProperties": false,
  "required": ["schemaVersion", "units", "origin", "room", "items"],
  "properties": {
    "schemaVersion": { "const": "1.0" },
    "units": { "const": "ft" },
    "origin": { "const": "top-left", "description": "(0,0) is the top-left floor corner; x right along width, y down along length, z up" },
    "room": {
      "type": "object",
      "additionalProperties": false,
      "required": ["width", "length", "height", "walls"],
      "properties": {
        "width":  { "type": "number", "minimum": 6, "maximum": 30, "multipleOf": 0.25 },
        "length": { "type": "number", "minimum": 6, "maximum": 30, "multipleOf": 0.25 },
        "height": { "const": 10, "description": "Wall height in ft; fixed for normal Indian homes" },
        "walls": {
          "type": "array", "minItems": 4, "maxItems": 4,
          "items": {
            "type": "object",
            "additionalProperties": false,
            "required": ["id", "from", "to"],
            "properties": {
              "id":   { "enum": ["top", "right", "bottom", "left"] },
              "from": { "$ref": "#/$defs/point" },
              "to":   { "$ref": "#/$defs/point" }
            }
          }
        }
      }
    },
    "items": { "type": "array", "items": { "$ref": "#/$defs/item" } }
  },
  "$defs": {
    "point": {
      "type": "object", "additionalProperties": false, "required": ["x", "y"],
      "properties": { "x": { "type": "number", "minimum": 0 }, "y": { "type": "number", "minimum": 0 } }
    },
    "item": {
      "type": "object",
      "additionalProperties": false,
      "required": ["id", "catalogId", "name", "position", "size", "rotation", "colour"],
      "properties": {
        "id":        { "type": "string", "minLength": 1 },
        "catalogId": { "enum": ["bed", "sofa", "table", "chair", "tv", "locker"] },
        "name":      { "type": "string", "minLength": 1 },
        "position": {
          "type": "object", "additionalProperties": false, "required": ["x", "y"],
          "description": "Centre of the footprint, ft from the origin, multiples of 0.01 (0.25 away from walls; exact where the item touches a wall)",
          "properties": {
            "x": { "type": "number", "minimum": 0, "multipleOf": 0.01 },
            "y": { "type": "number", "minimum": 0, "multipleOf": 0.01 }
          }
        },
        "size": {
          "type": "object", "additionalProperties": false, "required": ["width", "depth", "height"],
          "properties": {
            "width":  { "type": "number", "exclusiveMinimum": 0 },
            "depth":  { "type": "number", "exclusiveMinimum": 0 },
            "height": { "type": "number", "exclusiveMinimum": 0 }
          }
        },
        "rotation": { "type": "integer", "minimum": 0, "maximum": 350, "multipleOf": 10, "description": "Facing: degrees clockwise; 0 = front faces the bottom wall (+y)" },
        "colour":   { "const": "#FFFFFF" }
      }
    }
  }
}
```

## Rules checked after the schema (business rules)
A file can pass the schema and still be invalid. These are checked on create, on every edit and on upload:
1. The walls match `width` and `length` (a rectangle from (0,0) to (width, length)).
2. Item `id`s are unique.
3. Every item's footprint, after rotation, lies inside the walls.
4. Every item's `size` matches its catalog entry.
5. No two items overlap (measured between the rotated footprints). Items may touch, and a gap or overlap under **0.01 ft** counts as touching (user decision, 2026-11-17). Gaps under 1.5 ft, touching included, are allowed only after the user confirms them in the editor (REQ-366).

An uploaded file that passes these checks opens exactly as it was saved and shared, with no red lines and no popups. Close placements in it were already confirmed by whoever made it.
