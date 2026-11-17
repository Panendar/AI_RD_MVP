# REQ-366 User is warned when furniture is closer than 1.5 ft

Feature: FEAT-1147 · Decision: DEC-401 · Group: 2. Furnish and edit
Order: 5 of 9
Depends on: User can rotate and delete furniture (the rule applies to add, move and rotate)
Goals: G3

## Purpose
As a homeowner or interior designer, I see a red line and a confirmation when I place furniture less than 1.5 ft from another item, including touching it, and I cannot place it overlapping another item. This keeps room to walk between items, so layouts can be trusted at real measurements, while real-life pairs that touch (a chair against a table, a table beside a bed) can still be laid out.

## Behaviour
- **Gap:** the shortest edge-to-edge distance between the outlines (footprints) of two items, after rotation, in feet. A gap of 0 means the items touch.
- **Recommended gap: 1.5 ft.** There is **no minimum gap**: items may touch. The only hard block is **overlap** (user decision, 2026-11-17; replaces the 0.5 ft minimum of 2026-11-16).
- **Touching tolerance:** a gap or overlap smaller than 0.01 ft is treated as touching (gap 0), so rounding never turns a flush placement into an overlap.
- While an item is being dragged or rotated, a **red line** is drawn between it and every item less than 1.5 ft away, labelled with the gap in feet (for example "1.00 ft", or "0.00 ft" when touching).
- When the item is dropped (after an add, a move or a rotate):
  - **gap ≥ 1.5 ft** from every item: it is placed, with no line and no popup.
  - **0 ≤ gap < 1.5 ft** (including touching): the red line stays, and a popup asks: "This is 1.00 ft from the Bed. We recommend at least 1.5 ft. Place it here?" with **Place here** and **Cancel**. When touching the popup says "This is touching the Table. ..." and shows 0.00 ft.
    - Place here keeps the item there and saves it to the room JSON. The red line then **disappears and is not shown again** for that placement (user decision, 2026-11-16). It only comes back if an item is dragged or rotated into a gap under 1.5 ft again.
    - Cancel returns the item to where it was (or removes it, if it was just added).
  - **Overlapping** another item (by more than the 0.01 ft tolerance): not allowed. The overlap is marked in red, the item returns to where it was, and a message says "Items cannot overlap." The room JSON does not change.
- The gap to a **wall** is not part of this rule.
- A design opened from a file shows no red lines and no popups: it appears exactly as it was saved and shared (user decision, 2026-11-16). A file with overlapping items is rejected on upload (REQ-363).

## Acceptance criteria
- Dropping an item 1.5 ft or more from every other item places it with no red line and no popup.
- Dropping an item less than 1.5 ft from another item, including touching it (gap 0), shows a red line with the gap in feet and a confirmation popup. Place here keeps it and removes the red line; Cancel puts it back where it was.
- After Place here, no red line is shown for that pair until an item is dragged or rotated again.
- Dropping an item so that it overlaps another item is refused: the overlap is shown in red, the message "Items cannot overlap." appears, and the item goes back to where it was.
- A gap or overlap smaller than 0.01 ft counts as touching, not as an overlap.
- The same rule applies when an item is added from the catalog, moved, or rotated.
- The gap is measured edge to edge between the rotated outlines, and the number shown matches it to 2 decimals.

## Source documents
- User answers, 2026-11-16 (recommended 1.5 ft, red line, confirmation; no red line after confirmation; shared files open exactly as saved)
- User decision, 2026-11-17 (items may touch; only overlap is refused; popup kept for touching; the 0.5 ft minimum is removed)
- docs/project/room-plan-schema.md: business rule 5 (needs the same change, see follow-ups)
- docs/project/intent.md: G3

## Follow-ups outside this requirement
- REQ-363 (upload): it rejects a file with any gap under 0.5 ft; it should reject only overlapping items.
- docs/project/room-plan-schema.md business rule 5: replace the 0.5 ft minimum with "items must not overlap".

## Open questions
- None. (Items may stand against a wall; this rule is only between items.)
