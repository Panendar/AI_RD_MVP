# REQ-359 User can add Indian furniture from a searchable catalog

Feature: FEAT-1140 · Decision: DEC-394 · Group: 2. Furnish and edit
Order: 2 of 8
Depends on: User can start a new room by entering width and length
Goals: G4, G3

## Purpose
As a homeowner or interior designer, I can search a catalog of Indian furniture and add an item to the plan at its real size.

## Behaviour
- The catalog lists Indian furniture items and has a search box.
- Typing in the search box narrows the list.
- Picking an item adds it to the 2D plan at its real size, and adds it to the room JSON with type, position, rotation, size and colour.

## Acceptance criteria
- Typing in the catalog search narrows the list to matching items.
- Adding an item shows it in the 2D plan, inside the room.
- The added item appears in the room JSON with its type, position, rotation, size and colour.
- The item's size in the plan matches its catalog size in feet.

## Source documents
- docs/project/source/features.md: #5 Add from catalog (REQ-285, REQ-298)
- docs/project/intent.md: G3, G4

## Open questions
- Which items are in the catalog, and what are their real sizes and default colours?
- Is the catalog grouped into categories? If so, which ones?
- What does search match against (name only, or also category or tags)?
- Where is a new item placed in the room (centre, a corner, or where the user drops it)?
- What happens if the item is bigger than the room or there is no free space?
- How is an item drawn in 2D (a labelled rectangle, or an icon)?
