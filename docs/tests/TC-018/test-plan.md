# TC-018 Furniture catalog with search and drag-and-drop add to the 2D plan

Requirement: REQ-359 · Work item: WI-034 · Application: web (apps/web)

## Scope
Covers the acceptance criteria of REQ-359: the six-item catalog, search and "no match", drag-and-drop placement at real size (snap 0.25 ft, stop at walls), drop outside the room, no Add button, and the room JSON passing the schema check. Not covered: clearance rule (REQ-366), selecting/moving/rotating/deleting items (REQ-360/361), touch devices.

## Preconditions
- Web app running (desktop browser). A room of 12 x 10 ft has been created (REQ-358) and the 2D plan is shown.
- The room JSON can be viewed (Download JSON, or the JSON view) to inspect `items`.

## Scenarios

### S1 Catalog lists exactly six items with sizes (AC1)
1. Open the editor with an empty search box.
2. Read the catalog list.

Expected: heading "CATALOG (all white)"; exactly six rows, in this order, each showing name and W x D x H ft:
| Item | W x D x H ft |
|---|---|
| Bed (queen) | 5.0 x 6.5 x 1.5 |
| Sofa (3 seat) | 6.5 x 3.0 x 2.75 |
| Table (4 seat) | 4.0 x 2.5 x 2.5 |
| Chair | 1.5 x 1.5 x 3.0 |
| TV (on stand) | 4.0 x 1.0 x 3.0 |
| Locker (steel almirah) | 3.0 x 1.75 x 6.5 |

The hint "Drag an item onto the room. No Add button." is visible. No "n of 6 items match" text while the box is empty.

### S2 Search narrows the list (AC2)
1. Type `so` in the search box. Expected: only Sofa (3 seat) listed; "1 of 6 items match".
2. Replace with `LOCK`. Expected: only Locker listed (case-insensitive).
3. Type `  chair  ` (spaces around). Expected: only Chair listed.
4. Clear the box. Expected: all six items again.

### S3 No match leaves the plan unchanged (AC2)
1. Note the current `items` in the room JSON.
2. Type `xyz`.

Expected: the list is replaced by "no match"; no items are added; the room JSON `items` is identical to step 1; the plan is unchanged.

### S4 Drag a sofa and drop inside the room (AC3)
1. Drag "Sofa (3 seat)" over the plan. Expected: a white dashed outline at real size follows the mouse, snapped to 0.25 ft.
2. Drop at about x 6.1 ft, y 4.6 ft.

Expected:
- A white rectangle with the name "Sofa (3 seat)" appears centred at (6.0, 4.5).
- Its footprint measures 6.5 ft wide x 3.0 ft deep against the ruler.
- The outline disappears after the drop.
- Room JSON `items` has one entry: `id` "item-1", `catalogId` "sofa", `name` "Sofa (3 seat)", `position` {x: 6.0, y: 4.5}, `size` {width 6.5, depth 3.0, height 2.75}, `rotation` 0, `colour` "#FFFFFF". The JSON passes the schema check (Download JSON succeeds / no validation error).

### S5 Each catalog item is placed at its own size (AC3)
For each of Bed, Table, Chair, TV, Locker: drag to an open area of the 12 x 10 room and drop.

Expected: a white rectangle with its name, footprint equal to its catalog width x depth on the ruler; JSON entry has the matching `catalogId`, `name`, `size`, `rotation` 0, `colour` "#FFFFFF"; ids are unique and increasing (`item-2`, `item-3`, ...). Names stay readable inside small items (Chair 1.5 x 1.5 ft, Locker 3.0 x 1.75 ft). The JSON still passes the schema check.

### S6 Drop across a wall stops at the wall (AC4)
Start from the 12 x 10 room.
1. Drop Sofa at about (0.5, 0.2). Expected: item centre (3.25, 1.5); its edges touch the left and top walls; the outline during drag showed the same clamped position.
2. Drop Sofa at about (11.9, 9.9). Expected: centre (8.75, 8.5); edges touch the right and bottom walls.
3. Drop Locker near the top wall (e.g. y 0.3). Expected: `position.y` 1.0 (a multiple of 0.25, inside the wall; small gap to the wall is accepted); item fully inside the room.

In all cases the JSON passes the schema check and no item crosses a wall.

### S7 Drop outside the room adds nothing (AC5)
1. Drag Sofa and drop outside the room rectangle (left of x 0, below y 10, and on the catalog panel).
2. Drop onto the plan margin outside the walls.

Expected: no item is added; JSON `items` unchanged; no outline remains; no error message.

### S8 Item that cannot fit adds nothing
1. Create a room 12 x 6 ft (length under 6.5 ft). Drag Bed onto the room.

Expected: no item is added and no drag outline is shown. Sofa still can be added to the same room.

### S9 No Add button (AC5)
Inspect the whole editor (catalog rows, plan, right panel).

Expected: no "Add" button anywhere; the only way to add is drag and drop.

### S10 Everything white, no editing
After placing items, check the right "Selected item" panel and the 2D plan.

Expected: items are white (#FFFFFF) with a thin dark outline; no colour picker and no size/resize controls.

### S11 Room JSON checks (AC6)
1. Place two items, then use Download JSON and re-upload the file.

Expected: the file contains `items` with the fields above and passes the schema check on upload; ids are unique; each item lies inside the walls; each `size` equals the catalog size of its `catalogId`.
2. Edit the downloaded JSON so a sofa has `size.width` 6 (or two items share an id, or an item sits outside the walls) and upload it.

Expected: upload is refused with an error (size must match catalog, ids unique, items inside walls).

## Pass criteria
All scenarios S1 to S11 give the expected result. Automated tests (`catalog`, `placement`, `checkRoomPlan`, `roomStore`, `catalogPanel`, `planView`) pass in apps/web.
