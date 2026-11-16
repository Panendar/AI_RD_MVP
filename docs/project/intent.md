# Intent

## Purpose
Show that homeowners and interior designers can start from a basic room, furnish and edit it at real measurements in 2D, see the same design in 3D, and share it as a file that others can open and keep editing. Behind the scenes, one room JSON holds the design at every step.

## Goals
- G1: Every edit is reflected at once in the room JSON, the 2D plan and the 3D view.
- G2: Sharing is lossless: a downloaded design opens exactly as it was for whoever loads it, and they can carry on editing.
- G3: Layouts can be trusted: the room and furniture are shown at their real measurements in feet.
- G4: A user can start quickly from a basic room picked by type and shape with a few measurements, then add and arrange furniture.

## Not goals
- Accounts, login or cloud storage (designs are shared only as files).
- Buying, pricing or checkout.
- Photorealistic rendering (the 3D view is a preview).

## Success
- After any edit, the 2D plan and the 3D view show the same design with no manual steps.
- A design downloaded by one user and loaded by another looks the same and can be edited further.
- Measurements shown in the 2D plan match the real sizes entered for the room and the furniture.
- An invalid design file is rejected with a clear message.
