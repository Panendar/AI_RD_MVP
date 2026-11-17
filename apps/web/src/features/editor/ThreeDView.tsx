// REQ-364: the 3D tab. Read-only view of the room JSON; orbit (drag), zoom (scroll), pan (right-drag); Reset view.
// It is mounted only while the 3D tab is open, so every visit starts from the start view.
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react';
import type { RoomPlan } from '../../room/roomPlan';
import { buildRoomScene } from '../../room3d/buildScene';
import { FOV_DEG, computeStartView } from '../../room3d/startView';

export const NO_WEBGL_MESSAGE = '3D view is not available in this browser.';

export function ThreeDView({ plan }: { plan: RoomPlan }) {
  const mountRef = useRef<HTMLDivElement>(null);
  const resetRef = useRef<() => void>(() => {});
  const [unsupported, setUnsupported] = useState(false);
  const { width, length } = plan.room;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true });
    } catch {
      setUnsupported(true);
      return;
    }
    const w0 = mount.clientWidth || 800, h0 = mount.clientHeight || 500;
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(w0, h0);
    renderer.setClearColor('#E8EDF2');
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight('#FFFFFF', 0.85));
    const sun = new THREE.DirectionalLight('#FFFFFF', 0.9);
    sun.position.set(width * 0.2, 30, length * 1.2);
    scene.add(sun);
    scene.add(buildRoomScene(plan));

    const camera = new THREE.PerspectiveCamera(FOV_DEG, w0 / h0, 0.1, 500);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = false;
    controls.minDistance = 3;
    controls.maxDistance = 200;
    controls.maxPolarAngle = Math.PI / 2 - 0.02;   // never below the floor
    const reset = () => {
      const view = computeStartView(width, length, camera.aspect);
      camera.position.copy(view.position);
      controls.target.copy(view.target);
      camera.lookAt(view.target);
      controls.update();
    };
    resetRef.current = reset;
    reset();

    const render = () => renderer.render(scene, camera);
    controls.addEventListener('change', render);
    render();
    const onResize = () => {
      const w = mount.clientWidth || w0, h = mount.clientHeight || h0;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      render();
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      controls.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [plan, width, length]);

  return (
    <Flex h="100%" gap={4}>
      <Flex direction="column" flex="1" minW={0}>
        <Flex justify="space-between" align="center" mb={2}>
          <Heading as="h2" size="xs">3D VIEW (everything white, shaded and outlined)</Heading>
          <Button size="sm" variant="outline" onClick={() => resetRef.current()}>Reset view</Button>
        </Flex>
        <Box ref={mountRef} data-testid="three-d-canvas" flex="1" minH="400px" borderWidth="1px" />
        {unsupported && <Text role="alert" mt={2}>{NO_WEBGL_MESSAGE}</Text>}
        <Text mt={2} color="gray.600">drag = orbit    scroll = zoom    right-drag = pan</Text>
      </Flex>
      <Box w="220px">
        <Text>Room {width} x {length} ft</Text>
        <Text>Walls 10 ft high</Text>
        <Text>{plan.items.length} items, all white</Text>
        <Text mt={2} color="gray.600">3D is a preview, not photorealistic.</Text>
      </Box>
    </Flex>
  );
}
