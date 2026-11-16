# MVP Features

The core loop: **room JSON → editable 2D plan → 3D preview → download or share as JSON.**

| # | Feature | What it means | Done when | Source REQ |
|---|---|---|---|---|
| 1 | Room plan JSON | One JSON format describes the whole design: room size, walls, furniture (type, position, rotation, size, colour). Both 2D and 3D read from it. | The JSON is checked against a schema. An invalid file is rejected with a clear message. | REQ-290 |
| 2 | Create a room | The user enters room width and length (in feet) to start a new, empty rectangular room. | A new room appears in the 2D plan at the entered size. | REQ-291 |
| 3 | 2D plan renders from JSON | The 2D plan is drawn automatically from the room JSON, to scale, with a grid and ruler. | Any valid JSON shows as a 2D plan with no manual steps. | REQ-296 |
| 4 | Edit the 2D plan | The user can select, move, rotate, resize and delete furniture. Furniture stays inside the room walls. Every edit updates the JSON. | Each edit appears in the plan and in the JSON straight away. | REQ-297, REQ-299 |
| 5 | Add from catalog | The user picks Indian furniture from a searchable catalog and adds it to the plan at its real size. | The added item appears in the plan and in the JSON. | REQ-285, REQ-298 |
| 6 | Download JSON | The user downloads the current design as a `.json` file. | The downloaded file holds the full design and passes the schema check. | REQ-315 |
| 7 | Upload JSON (share) | The user uploads a `.json` file to open a design. Sharing works by sending the file: whoever receives it uploads it, sees the design, and can keep editing or add from the catalog. | An uploaded file shows the same design that was downloaded. | REQ-315 |
| 8 | 3D preview | The same JSON is shown as a 3D room the user can orbit, zoom and pan. | The 3D view matches the 2D plan, and any 2D edit shows up in 3D. | REQ-317, REQ-318 |
