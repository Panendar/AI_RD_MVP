// 2D editor screen (REQ-358: the room; REQ-359: add furniture from the catalog by drag and drop). The room size is shown
// but never editable here.
// The 3D tab and Upload/Download JSON are placeholders; their behaviour belongs to REQ-364, REQ-363 and REQ-362.
import { Navigate } from 'react-router-dom';
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import { useRoomStore } from '../../state/roomStore';
import { GRID_FT, PlanView } from './PlanView';
import { CatalogPanel } from './CatalogPanel';
import { useDragState } from './dragState';

export function EditorPage() {
  const plan = useRoomStore((s) => s.plan);
  const addItem = useRoomStore((s) => s.addItem);
  const moveItem = useRoomStore((s) => s.moveItem);
  const selectedId = useDragState((s) => s.selectedItemId);
  if (!plan) return <Navigate to="/" replace />;
  const { width, length } = plan.room;
  const selected = plan.items.find((it) => it.id === selectedId);

  return (
    <Flex direction="column" h="100vh">
      <Flex as="header" align="center" gap={4} px={4} py={2} borderBottomWidth="1px" wrap="wrap">
        <Heading as="h1" size="md">Room {width} x {length} ft (fixed)</Heading>
        <Flex role="tablist" aria-label="Views" gap={2}>
          <Button role="tab" aria-selected="true" size="sm" colorScheme="blue">2D plan</Button>
          <Button role="tab" aria-selected="false" size="sm" variant="outline" isDisabled title="Coming soon">3D view</Button>
        </Flex>
        <Flex gap={2} ml="auto">
          <Button size="sm" variant="outline" isDisabled title="Coming soon">Upload JSON</Button>
          <Button size="sm" variant="outline" isDisabled title="Coming soon">Download JSON</Button>
        </Flex>
      </Flex>

      <Flex flex="1" minH={0}>
        <Box as="aside" aria-label="Catalog, room and view" w="240px" p={4} borderRightWidth="1px" overflowY="auto">
          <Box mb={6}><CatalogPanel /></Box>
          <Heading as="h2" size="xs" mb={1}>ROOM</Heading>
          <Text>Rectangle {width} x {length} ft</Text>
          <Text mb={4} color="gray.600">(size is fixed)</Text>
          <Heading as="h2" size="xs" mb={1}>VIEW</Heading>
          <Text>Units: feet</Text>
          <Text>Grid: 1 dot = {GRID_FT} ft</Text>
          <Text>Moves snap: 0.25 ft</Text>
        </Box>

        <Box as="main" flex="1" minW={0} p={4}>
          <PlanView room={plan.room} items={plan.items} onDropItem={addItem} onMoveItem={moveItem} />
        </Box>

        <Box as="aside" aria-label="Selected item" w="220px" p={4} borderLeftWidth="1px">
          <Heading as="h2" size="xs" mb={1}>SELECTED ITEM</Heading>
          {selected ? (
            <Box data-testid="selected-item">
              <Text fontWeight="bold">{selected.name}</Text>
              <Text>W {selected.size.width}  D {selected.size.depth}  H {selected.size.height} ft</Text>
              <Text>Centre  X {selected.position.x.toFixed(2)}  Y {selected.position.y.toFixed(2)}</Text>
              <Text>Rotation  {selected.rotation} deg</Text>
              <Text mt={2} color="gray.600">Drag to move. Moves snap to 0.25 ft.</Text>
            </Box>
          ) : (
            <>
              <Text color="gray.600">(nothing selected)</Text>
              <Text mt={2}>Add furniture from the catalog on the left.</Text>
            </>
          )}
        </Box>
      </Flex>
    </Flex>
  );
}
