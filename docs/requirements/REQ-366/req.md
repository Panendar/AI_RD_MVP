# REQ-366 User is warned when furniture is closer than 1.5 ft

Feature: FEAT-1147 · Decision: DEC-401 · Group: 2. Furnish and edit
Order: 5 of 9
Depends on: User can rotate and delete furniture (the rule applies to add, move and rotate)
Goals: G3

## Purpose
As a homeowner or interior designer, I see a red line and a confirmation when I place furniture less than 1.5 ft from another item, and I cannot place it closer than 0.5 ft. This keeps room to walk between items, so layouts can be trusted at real measurements.

## Behaviour
- **Gap:** the shortest edge-to-edge distance between the outlines (footprints) of two items, after rotation, in feet.
- **Recommended gap: 1.5 ft. Minimum gap: 0.5 ft** (user decision, 2026-11-16).
- While an item is being dragged or rotated, a **red line** is drawn between it and every item less than 1.5 ft away, labelled with the gap in feet (for example "1.00 ft").
- When the item is dropped (after an add, a move or a rotate):
  - **gap ≥ 1.5 ft** from every item: it is placed, with no line and no popup.
  - **0.5 ft ≤ gap < 1.5 ft:** the red line stays, and a popup asks: "This is 1.00 ft from the Bed. We recommend at least 1.5 ft. Place it here?" with **Place here** and **Cancel**.
    - Place here keeps the item there and saves it to the room JSON.
    - Cancel returns the item to where it was (or removes it, if it was just added).
  - **gap < 0.5 ft, or overlapping:** not allowed. The item returns to where it was, and a message says "Items must be at least 0.5 ft apart." The room JSON does not change.
- The gap to a **wall** is not part of this rule.

## Acceptance criteria
- Dropping an item 1.5 ft or more from every other item places it with no red line and no popup.
- Dropping an item 0.5 ft or more but less than 1.5 ft from another item shows a red line with the gap in feet and a confirmation popup. Place here keeps it; Cancel puts it back where it was.
- Dropping an item less than 0.5 ft from another item, or overlapping it, is refused with the message, and the item goes back to where it was.
- The same rule applies when an item is added from the catalog, moved, or rotated.
- The gap is measured edge to edge between the rotated outlines, and the number shown matches it to 2 decimals.

## Source documents
- User answers, 2026-11-16 (new requirement: recommended 1.5 ft, minimum 0.5 ft, red line, confirmation)
- docs/project/room-plan-schema.md: business rule 5
- docs/project/intent.md: G3

## Open questions
- Once the user confirms a close placement, does the red line stay visible on the plan afterwards, or only while editing?
- When a file is uploaded with items 0.5 to 1.5 ft apart, should it open with the red lines shown, or ask first? (A file with items under 0.5 ft apart is rejected.)
- Should items also keep a minimum gap from the walls?
