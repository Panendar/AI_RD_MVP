// The furniture catalog (REQ-359): search by name, then drag an item onto the room. There is no Add button.
import { useState, type DragEvent } from 'react';
import { Box, Flex, Heading, Input, List, ListItem, Text } from '@chakra-ui/react';
import { CATALOG, formatSize, searchCatalog } from '../../room/catalog';
import { CATALOG_DRAG_TYPE, useDragState } from './dragState';

export function CatalogPanel() {
  const [query, setQuery] = useState('');
  const setDragging = useDragState((s) => s.setDragging);
  const matches = searchCatalog(query);
  const searching = query.trim() !== '';

  const onDragStart = (catalogId: string) => (e: DragEvent<HTMLLIElement>) => {
    e.dataTransfer.setData(CATALOG_DRAG_TYPE, catalogId);
    e.dataTransfer.setData('text/plain', catalogId);
    e.dataTransfer.effectAllowed = 'copy';
    setDragging(catalogId);
  };

  return (
    <Box data-testid="catalog">
      <Heading as="h2" size="xs" mb={2}>CATALOG <Text as="span" fontWeight="normal" color="gray.600">(all white)</Text></Heading>
      <Input
        size="sm"
        mb={2}
        placeholder="Search"
        aria-label="Search catalog"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {matches.length === 0 ? (
        <Text data-testid="catalog-no-match" color="gray.600">no match</Text>
      ) : (
        <List spacing={1} aria-label="Catalog items">
          {matches.map((e) => (
            <ListItem
              key={e.catalogId}
              data-testid="catalog-item"
              data-catalog-id={e.catalogId}
              draggable
              onDragStart={onDragStart(e.catalogId)}
              onDragEnd={() => setDragging(null)}
              cursor="grab"
              px={2}
              py={1}
              borderWidth="1px"
              borderRadius="md"
              _hover={{ bg: 'gray.50' }}
              title={`Drag ${e.name} onto the room`}
            >
              <Flex direction="column">
                <Text fontSize="sm" fontWeight="medium">{e.name}</Text>
                <Text fontSize="xs" color="gray.600" data-testid="catalog-item-size">{formatSize(e)}</Text>
              </Flex>
            </ListItem>
          ))}
        </List>
      )}
      {searching && matches.length > 0 && (
        <Text fontSize="xs" mt={1} color="gray.600">{matches.length} of {CATALOG.length} items match</Text>
      )}
      <Text fontSize="xs" mt={3} color="gray.600">Drag an item onto the room. No Add button.</Text>
      <Text fontSize="xs" color="gray.600">Dropped outside the room: nothing added.</Text>
    </Box>
  );
}
