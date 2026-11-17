# TC-022 Download JSON saves room_type.json, blocked for an empty room

Requirement: REQ-362 - Work item: WI-040 - Application: web (apps/web)

## Scope
Covers the acceptance criteria of REQ-362: Download JSON saves a .json file named `room_type.json`; the file holds the full design (`schemaVersion`, `units`, `origin`, room width/length/height/walls, and every item with `id`, `catalogId`, `name`, `position`, `size`, `rotation`, `colour`); the file passes the schema check and business rules; with no items nothing is saved and the pop-up "Add objects and plan your room before downloading." is shown; the user cannot name the design or the file. Not covered: Upload JSON (REQ-363), the 3D view, accounts or cloud storage (none exist), browser-specific download folders.

## Preconditions
- Web app running (desktop browser). A room of 12 x 10 ft has been created (REQ-358) and the 2D plan is shown.
- Items are added from the catalog (REQ-359). Sizes (W x D ft): Bed 5.0 x 6.5, Sofa 6.5 x 3.0, Table 4.0 x 2.5, Chair 1.5 x 1.5, Locker, TV.
- A text editor or JSON viewer is available to open the downloaded file. The browser downloads folder is empty of earlier `room_type*.json` files.

## Scenarios

### S1 Download a design with items (AC1)
1. Add a Sofa, a Table and a Locker to the room. Move the Sofa and rotate the Table by 90 degrees.
2. Click **Download JSON** (top right).

Expected: the browser saves one file named `room_type.json`. No pop-up appears and the design on screen is unchanged. The file opens as valid JSON.

### S2 The file holds the full design (AC2)
1. Open the file from S1.

Expected:
- Top level has `schemaVersion` "1.0", `units` "ft", `origin` "top-left".
- `room` has `width` 12, `length` 10, `height` 10 and four `walls` (top, right, bottom, left).
- `items` has exactly 3 entries. Each has `id`, `catalogId`, `name`, `position` (`x`, `y`), `size` (`width`, `depth`, `height`), `rotation` and `colour`.
- The Sofa and Table `position` and `rotation` equal the values shown in the right panel (the Table has rotation 90); sizes equal the catalog sizes; colour is `#FFFFFF`.

### S3 The file passes the schema check and rules (AC3)
1. Compare the file against docs/project/room-plan-schema.md (v1.0): required fields present, no extra fields, numbers in feet.
2. Check the business rules: every item lies fully inside the walls, ids are unique, each size matches its catalog entry.
3. When Upload JSON (REQ-363) is available, open `room_type.json` with it.

Expected: no schema or rule violation. Once Upload JSON exists, the file opens and shows the same design.

### S4 Empty room is blocked with a pop-up (AC4)
1. Create a new 12 x 10 ft room and add no items.
2. Click **Download JSON**.
3. Press **OK** on the pop-up (repeat with Escape).

Expected: no file is saved (nothing new in the downloads folder). A pop-up shows "Add objects and plan your room before downloading." with an **OK** button. OK or Escape closes it and the user stays on the empty design.

### S5 Deleting the last item blocks the download again (AC4)
1. Add one Chair and click **Download JSON**; a file is saved.
2. Delete the Chair and click **Download JSON** again.

Expected: the first click saves a file with 1 item. After deleting, the second click saves nothing and shows the pop-up from S4.

### S6 The user cannot name the design (AC5)
1. Look at the editor header, the panels and the download action.

Expected: there is no field or option to name the design or choose a file name; every download is `room_type.json` (a browser may add a counter such as `room_type (1).json` on repeated downloads, which is browser behaviour).

### S7 Close gaps do not block the download (AC1)
1. Add two Chairs, place one 1.0 ft from the other and answer **Place here**.
2. Click **Download JSON**.

Expected: the file is saved (2 items). A gap under 1.5 ft is only a recommendation and does not prevent download.

## Pass criteria
All scenarios S1 to S7 behave as expected. Any file saved for an empty room, a wrong file name, a missing field or a file that fails the schema or rules is a failure.
