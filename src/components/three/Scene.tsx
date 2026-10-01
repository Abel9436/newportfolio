"use client";

import { Environment, Lightformer, Sparkles } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect } from "react";
import * as THREE from "three";
import type { Theme } from "../providers/Theme";
import { Character } from "./Character";
import { SliceComposite } from "./SliceComposite";
import { stage } from "./stage";

// A black-and-white studio: one soft key, two hard rims that cut the jacket out of
// the background, and white softboxes for the leather to reflect.
function Studio({ theme }: { theme: Theme }) {
  const dark = theme === "dark";
  return (
    <>
      <ambientLight intensity={dark ? 0.12 : 0.5} />
      <directionalLight position={[2.5, 3, 4]} intensity={dark ? 1.7 : 2.1} />
      <spotLight position={[-3.2, 2, -2.5]} angle={0.55} penumbra={1} intensity={dark ? 80 : 30} />
      <spotLight position={[3.2, 1, -2.5]} angle={0.55} penumbra={1} intensity={dark ? 55 : 22} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.4} position={[0, 4, 2]} scale={[6, 2, 1]} rotation-x={Math.PI / 2} />
        <Lightformer
          form="rect"
          intensity={3}
          position={[-4, 0.5, -0.5]}
          scale={[0.6, 6, 1]}
          rotation-y={Math.PI / 2}
        />
        <Lightformer
          form="rect"
          intensity={2}
          position={[4, 0.5, -0.5]}
          scale={[0.6, 6, 1]}
          rotation-y={-Math.PI / 2}
        />
        <Lightformer form="ring" intensity={dark ? 0.6 : 1.4} position={[0, 0, -6]} scale={4} />
      </Environment>
    </>
  );
}

export default function Scene({ theme }: { theme: Theme }) {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      stage.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      stage.pointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[1]">
      {/* R3F re-enables pointer events on its container; the scene has nothing to click, so turn them off */}
      <Canvas
        style={{ pointerEvents: "none" }}
        dpr={[1, 1.75]}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: theme === "dark" ? 1.05 : 1.15,
        }}
        camera={{ fov: 30, position: [0, 0, 5], near: 0.1, far: 50 }}
      >
        <Suspense fallback={null}>
          <Studio theme={theme} />
          <Character theme={theme} />
          {theme === "dark" && (
            <Sparkles count={45} scale={[7, 4, 3]} size={1.4} speed={0.2} opacity={0.3} color="#ffffff" />
          )}
        </Suspense>
        <SliceComposite />
      </Canvas>
    </div>
  );
}
