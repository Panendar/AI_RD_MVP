// New room screen (REQ-358): width and length in feet, fixed 10 ft walls, a live preview, and Create room.
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Flex, FormControl, FormErrorMessage, FormHelperText, FormLabel, Heading, Input, InputGroup,
  InputRightAddon, Text
} from '@chakra-ui/react';
import { ROOM_MAX_FT, ROOM_MIN_FT, ROOM_STEP_FT, WALL_HEIGHT_FT, parseRoomSize, validateRoomSize } from '../../room/roomPlan';
import { useRoomStore } from '../../state/roomStore';
import { RoomPreview } from './RoomPreview';

export function NewRoomPage() {
  const navigate = useNavigate();
  const createRoom = useRoomStore((s) => s.createRoom);
  const [width, setWidth] = useState('12');
  const [length, setLength] = useState('10');
  const [touched, setTouched] = useState({ width: false, length: false });
  const [createError, setCreateError] = useState<string | null>(null);

  const widthError = validateRoomSize(width, 'Width');
  const lengthError = validateRoomSize(length, 'Length');
  const w = parseRoomSize(width);
  const l = parseRoomSize(length);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    setTouched({ width: true, length: true });
    if (w === null || l === null) return;                              // invalid field: Create room does nothing
    const errors = createRoom(w, l);
    if (errors.length > 0) { setCreateError('The room could not be created. Check the width and length.'); return; }
    navigate('/editor');
  };

  const sizeField = (id: 'width' | 'length', label: string, value: string, set: (v: string) => void, error: string | null) => (
    <FormControl isInvalid={touched[id] && error !== null} mb={4}>
      <FormLabel htmlFor={`room-${id}`}>{label}</FormLabel>
      <InputGroup maxW="220px">
        <Input
          id={`room-${id}`}
          name={id}
          type="text"
          inputMode="decimal"
          value={value}
          onChange={(e) => { set(e.target.value); setTouched((t) => ({ ...t, [id]: true })); setCreateError(null); }}
          onBlur={() => setTouched((t) => ({ ...t, [id]: true }))}
          aria-describedby={`room-${id}-hint`}
        />
        <InputRightAddon>ft</InputRightAddon>
      </InputGroup>
      {touched[id] && error !== null
        ? <FormErrorMessage>{error}</FormErrorMessage>
        : <FormHelperText id={`room-${id}-hint`}>{ROOM_MIN_FT} to {ROOM_MAX_FT} ft, in {ROOM_STEP_FT} ft steps</FormHelperText>}
    </FormControl>
  );

  return (
    <Box p={6}>
      <Heading as="h1" size="lg" mb={4}>Start a new room</Heading>
      <Flex gap={6} wrap="wrap">
        <Box as="form" onSubmit={onSubmit} noValidate flex="1 1 320px" borderWidth="1px" borderRadius="md" p={4}>
          <Heading as="h2" size="md" mb={4}>Start from scratch</Heading>
          <Text mb={4}><b>Shape</b>&nbsp; Rectangle</Text>
          {sizeField('width', 'Width', width, setWidth, widthError)}
          {sizeField('length', 'Length', length, setLength, lengthError)}
          <Text mb={2}><b>Walls</b>&nbsp; {WALL_HEIGHT_FT} ft high (standard, fixed)</Text>
          <Text mb={4}>The room size cannot be changed later.</Text>
          {createError && <Text role="alert" color="red.500" mb={2}>{createError}</Text>}
          <Button type="submit" colorScheme="blue">Create room</Button>
        </Box>
        <Box flex="1 1 320px" borderWidth="1px" borderRadius="md" p={4}>
          <Heading as="h2" size="md" mb={4}>Preview (top view)</Heading>
          <RoomPreview width={w} length={l} />
        </Box>
      </Flex>
    </Box>
  );
}
