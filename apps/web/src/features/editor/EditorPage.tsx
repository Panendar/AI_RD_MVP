// 2D editor screen (REQ-358: the room; REQ-359: add furniture from the catalog by drag and drop). The room size is shown
// but never editable here.
// REQ-362: Download JSON saves room_type.json (refused with a message for an empty room).
// REQ-363: Upload JSON opens a design from a file (1 MB max, checked, confirm before replacing an open design).
// REQ-364: the 3D tab shows the same room JSON as a white 3D room (read-only, always from the start view).
import { useRef, useState, type ChangeEvent } from 'react';
import { Navigate } from 'react-router-dom';
import {
  AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay,
  Box, Button, Flex, Heading, Text
} from '@chakra-ui/react';
import { facingLabel, ROTATION_STEP_DEG } from '../../room/rotation';
import { measureAll, formatGap, RECOMMENDED_GAP_FT } from '../../room/clearance';
import { DOWNLOAD_FILE_NAME, prepareDownload } from '../../room/exportRoomPlan';
import { saveTextFile } from '../../room/downloadFile';
import { INVALID_FILE_MESSAGE, openRoomPlan } from '../../room/openRoomPlan';
import type { RoomPlan } from '../../room/roomPlan';
import { useRoomStore } from '../../state/roomStore';
import { GRID_FT, PlanView } from './PlanView';
import { CatalogPanel } from './CatalogPanel';
import { useDragState } from './dragState';
import { ThreeDView } from './ThreeDView';

export function EditorPage() {
  const plan = useRoomStore((s) => s.plan);
  const addItem = useRoomStore((s) => s.addItem);
  const moveItem = useRoomStore((s) => s.moveItem);
  const rotateItem = useRoomStore((s) => s.rotateItem);
  const rotateItemStep = useRoomStore((s) => s.rotateItemStep);
  const deleteItem = useRoomStore((s) => s.deleteItem);
  const selectedId = useDragState((s) => s.selectedItemId);
  const selectItem = useDragState((s) => s.selectItem);
  const pending = useRoomStore((s) => s.pending);
  const notice = useRoomStore((s) => s.notice);
  const { beginChange, settleChange, confirmPending, cancelPending, dismissNotice, loadPlan } = useRoomStore.getState();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);
  const downloadOkRef = useRef<HTMLButtonElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const placeCancelRef = useRef<HTMLButtonElement>(null);
  const okRef = useRef<HTMLButtonElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadOkRef = useRef<HTMLButtonElement>(null);
  const replaceCancelRef = useRef<HTMLButtonElement>(null);
  const [uploadError, setUploadError] = useState(false);
  const [tab, setTab] = useState<'2d' | '3d'>('2d');
  const [toReplace, setToReplace] = useState<{ name: string; plan: RoomPlan } | null>(null);
  if (!plan) return <Navigate to="/" replace />;
  const { width, length } = plan.room;
  const selected = plan.items.find((it) => it.id === selectedId);
  const nearest = selected ? measureAll(plan.items, selected)[0] : undefined;
  const touching = pending !== null && pending.gap === 0;

  const onDownload = () => {
    const result = prepareDownload(plan);
    if (result.ok) saveTextFile(DOWNLOAD_FILE_NAME, result.json);
    else setDownloadError(result.errors.join(' '));
  };

  const openPlan = (next: RoomPlan) => { loadPlan(next); selectItem(null); };

  const onFileChosen = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';   // the same file can be chosen again
    if (!file) return;
    const result = await openRoomPlan(file);
    if (!result.ok) setUploadError(true);
    else if (plan.items.length === 0) openPlan(result.plan);
    else setToReplace({ name: file.name, plan: result.plan });
  };

  return (
    <Flex direction="column" h="100vh">
      <Flex as="header" align="center" gap={4} px={4} py={2} borderBottomWidth="1px" wrap="wrap">
        <Heading as="h1" size="md">Room {width} x {length} ft (fixed)</Heading>
        <Flex role="tablist" aria-label="Views" gap={2}>
          <Button role="tab" aria-selected={tab === '2d'} size="sm" colorScheme="blue" variant={tab === '2d' ? 'solid' : 'outline'} onClick={() => setTab('2d')}>2D plan</Button>
          <Button role="tab" aria-selected={tab === '3d'} size="sm" colorScheme="blue" variant={tab === '3d' ? 'solid' : 'outline'} onClick={() => setTab('3d')}>3D view</Button>
        </Flex>
        <Flex gap={2} ml="auto">
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            hidden
            aria-label="Choose a design file"
            data-testid="upload-input"
            onChange={onFileChosen}
          />
          <Button size="sm" variant="outline" onClick={() => fileInputRef.current?.click()}>Upload JSON</Button>
          <Button size="sm" variant="outline" onClick={onDownload}>Download JSON</Button>
        </Flex>
      </Flex>

      {tab === '3d' && (
        <Box as="main" flex="1" minH={0} p={4}>
          <ThreeDView plan={plan} />
        </Box>
      )}
      <Flex flex="1" minH={0} display={tab === '2d' ? 'flex' : 'none'}>
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
          <PlanView room={plan.room} items={plan.items} onDropItem={addItem} onMoveItem={moveItem} onRotateItem={rotateItem} />
        </Box>

        <Box as="aside" aria-label="Selected item" w="220px" p={4} borderLeftWidth="1px">
          <Heading as="h2" size="xs" mb={1}>SELECTED ITEM</Heading>
          {selected ? (
            <Box data-testid="selected-item">
              <Text fontWeight="bold">{selected.name}</Text>
              <Text>W {selected.size.width}  D {selected.size.depth}  H {selected.size.height} ft</Text>
              <Text>Centre  X {selected.position.x.toFixed(2)}  Y {selected.position.y.toFixed(2)}</Text>
              <Text>(size is fixed)</Text>
              <Text>Rotation  {selected.rotation} deg</Text>
              <Text>Facing: {facingLabel(selected.rotation)}</Text>
              <Text>Step: {ROTATION_STEP_DEG} deg</Text>
              <Heading as="h3" size="xs" mt={2}>GAP{nearest ? ` TO ${nearest.other.name.toUpperCase()}` : ''}</Heading>
              <Text data-testid="selected-gap" color={nearest && nearest.gap < RECOMMENDED_GAP_FT ? 'red.500' : undefined}>
                {nearest ? formatGap(nearest.gap) : 'no other item'}
              </Text>
              <Text>Recommended {RECOMMENDED_GAP_FT} ft</Text>
              <Text>Minimum none (touching is allowed, overlap is not)</Text>
              <Text mt={2} color="gray.600">Drag to move. Moves snap to 0.25 ft. Drag the knob around the ring, or press Rotate 10.</Text>
              <Flex mt={3} gap={2}>
                <Button size="sm" onClick={() => { beginChange(selected.id); rotateItemStep(selected.id); settleChange(selected.id); }}>Rotate 10</Button>
                <Button size="sm" colorScheme="red" variant="outline" onClick={() => setConfirmDelete(true)}>Delete</Button>
              </Flex>
            </Box>
          ) : (
            <>
              <Text color="gray.600">(nothing selected)</Text>
              <Text mt={2}>Add furniture from the catalog on the left.</Text>
            </>
          )}
        </Box>
      </Flex>

      <AlertDialog isOpen={pending !== null} leastDestructiveRef={placeCancelRef} onClose={cancelPending} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Too close</AlertDialogHeader>
            <AlertDialogBody>
              {pending && (touching
                ? `This is touching the ${pending.otherName}. Gap ${formatGap(pending.gap)}. `
                : `This is ${formatGap(pending.gap)} from the ${pending.otherName}. `)}
              We recommend at least {RECOMMENDED_GAP_FT} ft. Place it here?
            </AlertDialogBody>
            <AlertDialogFooter gap={2}>
              <Button ref={placeCancelRef} onClick={cancelPending}>Cancel</Button>
              <Button colorScheme="blue" onClick={confirmPending}>Place here</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog isOpen={notice !== null} leastDestructiveRef={okRef} onClose={dismissNotice} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Not allowed</AlertDialogHeader>
            <AlertDialogBody>{notice} The item went back to where it was.</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={okRef} onClick={dismissNotice}>OK</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog isOpen={downloadError !== null} leastDestructiveRef={downloadOkRef} onClose={() => setDownloadError(null)} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Cannot download</AlertDialogHeader>
            <AlertDialogBody>{downloadError}</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={downloadOkRef} onClick={() => setDownloadError(null)}>OK</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog isOpen={uploadError} leastDestructiveRef={uploadOkRef} onClose={() => setUploadError(false)} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Cannot open file</AlertDialogHeader>
            <AlertDialogBody>{INVALID_FILE_MESSAGE}</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={uploadOkRef} onClick={() => setUploadError(false)}>OK</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog isOpen={toReplace !== null} leastDestructiveRef={replaceCancelRef} onClose={() => setToReplace(null)} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Replace the current design?</AlertDialogHeader>
            <AlertDialogBody>Replace the current design with {toReplace?.name}? The current design will be lost.</AlertDialogBody>
            <AlertDialogFooter gap={2}>
              <Button ref={replaceCancelRef} onClick={() => setToReplace(null)}>Cancel</Button>
              <Button
                colorScheme="blue"
                onClick={() => { if (toReplace) openPlan(toReplace.plan); setToReplace(null); }}
              >
                Replace
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <AlertDialog isOpen={confirmDelete && !!selected} leastDestructiveRef={cancelRef} onClose={() => setConfirmDelete(false)} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader>Delete {selected?.name}?</AlertDialogHeader>
            <AlertDialogBody>It is removed from the plan and from the room JSON.</AlertDialogBody>
            <AlertDialogFooter gap={2}>
              <Button ref={cancelRef} onClick={() => setConfirmDelete(false)}>Cancel</Button>
              <Button
                colorScheme="red"
                onClick={() => {
                  if (selected) { deleteItem(selected.id); selectItem(null); }
                  setConfirmDelete(false);
                }}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
}
