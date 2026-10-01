"use client";

import { Line, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import type { Line2 } from "three-stdlib";
import type { Theme } from "../providers/Theme";
import { MOBILE_BREAKPOINT, POSES, stage, type Pose } from "./stage";

export const MODEL_URL = "/models/abel.glb";

type Key = { at: number; pose: Pose };

// Each section holds its pose while it fills the viewport, and hands over to the
// next section's pose while that one scrolls in. Pinned sections are measured
// through their pin-spacer so the pose holds for the whole pin.
function measureKeys(): Key[] {
  const vh = window.innerHeight;
  const max = Math.max(0, document.documentElement.scrollHeight - vh);
  const mobile = window.innerWidth < MOBILE_BREAKPOINT;
  const keys: Key[] = [];

  document.querySelectorAll<HTMLElement>("[data-stage]").forEach((el) => {
    const set = POSES[el.dataset.stage ?? ""];
    if (!set) return;
    const parent = el.parentElement;
    const outer = parent?.classList.contains("pin-spacer") ? parent : el;
    const rect = outer.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const pose = mobile ? set.mobile : set.desktop;
    keys.push({ at: Math.min(top, max), pose });
    keys.push({ at: Math.min(Math.max(top, top + rect.height - vh), max), pose });
  });

  return keys;
}

const smooth = (t: number) => t * t * (3 - 2 * t);

function sample(keys: Key[], y: number, out: Pose) {
  if (!keys.length) return;
  let a = keys[0];
  let b = keys[0];
  if (y >= keys[keys.length - 1].at) {
    a = b = keys[keys.length - 1];
  } else {
    for (let i = 0; i < keys.length - 1; i++) {
      if (y >= keys[i].at && y <= keys[i + 1].at) {
        a = keys[i];
        b = keys[i + 1];
        break;
      }
    }
  }
  const span = b.at - a.at;
  const t = span > 0 ? smooth((y - a.at) / span) : 0;
  out.x = THREE.MathUtils.lerp(a.pose.x, b.pose.x, t);
  out.y = THREE.MathUtils.lerp(a.pose.y, b.pose.y, t);
  out.s = THREE.MathUtils.lerp(a.pose.s, b.pose.s, t);
  out.r = THREE.MathUtils.lerp(a.pose.r, b.pose.r, t);
  out.o = THREE.MathUtils.lerp(a.pose.o, b.pose.o, t);
}

function circle(radius: number, segments = 180) {
  return Array.from({ length: segments + 1 }, (_, i) => {
    const a = (i / segments) * Math.PI * 2;
    return new THREE.Vector3(Math.cos(a) * radius, Math.sin(a) * radius, 0);
  });
}

const INNER = circle(0.2);
const OUTER = circle(0.27);
// roughly where the head sits once the mesh is normalised to one unit tall
const HEAD_Y = 0.36;

export function Character({ theme }: { theme: Theme }) {
  const { scene } = useGLTF(MODEL_URL, false, true);
  const group = useRef<THREE.Group>(null);
  const keys = useRef<Key[]>([]);
  const target = useRef<Pose>({ ...POSES.hero.desktop });
  const intro = useRef(0);
  const halo = useRef<THREE.Group>(null);
  const spinner = useRef<THREE.Group>(null);
  const inner = useRef<Line2>(null);
  const outer = useRef<Line2>(null);
  const ink = theme === "dark" ? "#f0efeb" : "#0c0c0c";

  // Centre the mesh on its bounding box and normalise it to one unit tall,
  // so poses can be written as fractions of the viewport.
  const model = useMemo(() => {
    const root = scene.clone(true);
    const box = new THREE.Box3().setFromObject(root);
    const size = box.getSize(new THREE.Vector3());
    const centre = box.getCenter(new THREE.Vector3());
    const unit = 1 / size.y;
    root.position.sub(centre).multiplyScalar(unit);
    root.scale.setScalar(unit);
    root.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (!mesh.isMesh) return;
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.envMapIntensity = 1.15;
      mat.needsUpdate = true;
    });
    return root;
  }, [scene]);

  useEffect(() => {
    const refresh = () => {
      keys.current = measureKeys();
    };
    refresh();
    ScrollTrigger.addEventListener("refresh", refresh);
    window.addEventListener("resize", refresh);
    return () => {
      ScrollTrigger.removeEventListener("refresh", refresh);
      window.removeEventListener("resize", refresh);
    };
  }, []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(delta, 1 / 20);
    const vp = state.viewport.getCurrentViewport(state.camera, [0, 0, 0]);
    const pose = target.current;
    sample(keys.current, window.scrollY, pose);

    intro.current = THREE.MathUtils.damp(intro.current, stage.revealed ? 1 : 0, 1.6, dt);
    const lag = 1 - intro.current;
    const t = state.clock.elapsedTime;

    const x = pose.x * vp.width;
    const y = pose.y * vp.height - lag * vp.height * 0.35 + Math.sin(t * 0.8) * 0.012 * vp.height;
    const s = pose.s * vp.height * (1 - lag * 0.15);
    // A flick keeps him turning; once it dies down he eases back to the nearest full turn,
    // so every section still finds him facing the way its pose expects.
    const drag = stage.drag;
    if (!drag.active) {
      drag.yaw += drag.velocity * dt;
      drag.velocity = THREE.MathUtils.damp(drag.velocity, 0, 2.2, dt);
      if (Math.abs(drag.velocity) < 0.3) {
        const home = Math.round(drag.yaw / (Math.PI * 2)) * Math.PI * 2;
        drag.yaw = THREE.MathUtils.damp(drag.yaw, home, 1.4, dt);
      }
    }
    const yaw = pose.r + stage.spin + drag.yaw + stage.pointer.x * 0.22 + Math.sin(t * 0.35) * 0.05 - lag * 1.4;

    g.position.x = THREE.MathUtils.damp(g.position.x, x, 3.2, dt);
    g.position.y = THREE.MathUtils.damp(g.position.y, y, 3.2, dt);
    const next = THREE.MathUtils.damp(g.scale.x, s, 3.2, dt);
    g.scale.setScalar(next);
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, yaw, drag.active ? 14 : 3, dt);
    stage.opacity = THREE.MathUtils.damp(stage.opacity, pose.o, 3, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, -stage.pointer.y * 0.06, 3, dt);

    state.gl.toneMappingExposure = theme === "dark" ? 1.05 : 1.15;

    // The halo follows the figure but never turns with it, so it always reads as a circle.
    const h = halo.current;
    if (h) {
      const k = g.scale.x * (0.75 + 0.25 * intro.current);
      h.position.set(g.position.x, g.position.y + HEAD_Y * g.scale.x, -0.4 * g.scale.x);
      h.scale.setScalar(k);
      h.rotation.x = g.rotation.x * 0.5;
    }
    if (spinner.current) spinner.current.rotation.z = t * 0.12;
    const fade = intro.current;
    const strength = theme === "dark" ? 1 : 1.4;
    if (inner.current) inner.current.material.opacity = 0.32 * fade * strength;
    if (outer.current) outer.current.material.opacity = 0.22 * fade * strength;
  });

  return (
    <>
      <group ref={halo} scale={0.001}>
        <Line ref={inner} points={INNER} color={ink} lineWidth={1} transparent opacity={0} />
        <group ref={spinner}>
          <Line
            ref={outer}
            points={OUTER}
            color={ink}
            lineWidth={1}
            transparent
            opacity={0}
            dashed
            dashSize={0.012}
            gapSize={0.012}
          />
        </group>
      </group>
      <group ref={group} scale={0.001}>
        <primitive object={model} />
      </group>
    </>
  );
}

useGLTF.preload(MODEL_URL, false, true);
