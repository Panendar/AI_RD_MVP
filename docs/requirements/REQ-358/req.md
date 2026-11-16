# REQ-358 User can start a new room by entering width and length

Feature: FEAT-1139 · Decision: DEC-393 · Group: 1. Start a room
Order: 1 of 8
Depends on: none
Goals: G4, G3

## Purpose
As a homeowner or interior designer, I can enter a room width and length in feet to start a new, empty rectangular room shown as a 2D plan to scale. This story also sets up the room JSON that holds the design at every later step.

## Behaviour
- The user enters a width and a length in feet and confirms.
- A room JSON is created. It describes the whole design: room size, walls and a furniture list (each item: type, position, rotation, size, colour). The list is empty at this point.
- The room JSON is checked against a schema.
- The 2D plan is drawn from the room JSON automatically, to scale, with a grid and a ruler.
- The room is a rectangle. Picking a room type or shape is not in scope (the user decided this on 2026-11-16).

## Acceptance criteria
- Entering a width and length in feet and confirming shows a new, empty rectangular room in the 2D plan.
- The room drawn in the plan measures the entered width and length on the ruler and grid.
- The room JSON holds the entered room size, the walls and an empty furniture list, and it passes the schema check.
- The 2D plan is drawn from the room JSON with no manual steps.

## Source documents
- docs/project/source/features.md: #1 Room plan JSON (REQ-290), #2 Create a room (REQ-291), #3 2D plan renders from JSON (REQ-296)
- docs/project/intent.md: G3, G4

## Open questions
- What are the allowed ranges for width and length (minimum and maximum), and can they include fractions of a foot or inches?
- What message is shown for an empty, zero, negative or non-numeric value?
- Can the room size be changed after the room is created?
- What do the schema fields look like exactly (field names, units, how walls are represented, schema version)?
- What grid spacing and ruler marks should the plan use?
- intent.md G4 mentions picking a room by type and shape. When, if ever, should this come in?
