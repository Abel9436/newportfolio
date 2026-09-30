"use client";

import { useFBO } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { columnCount, gutter, stage } from "./stage";

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// Splits the rendered frame into the same vertical columns as the page grid and
// pushes alternate columns up and down with scroll speed, then prints it in greyscale.
const fragment = /* glsl */ `
  uniform sampler2D uScene;
  uniform float uVel;
  uniform float uCols;
  uniform float uInset;
  uniform float uOpacity;
  varying vec2 vUv;

  float hash(float n) { return fract(sin(n) * 43758.5453); }

  void main() {
    float gx = (vUv.x - uInset) / (1.0 - 2.0 * uInset);
    float col = floor(gx * uCols);
    float dir = mod(col, 2.0) * 2.0 - 1.0;
    float amount = uVel * (0.45 + 0.55 * hash(col + 3.0)) * dir;
    vec4 color = texture2D(uScene, vUv + vec2(0.0, amount));

    // black and white, like a print
    float luma = dot(color.rgb, vec3(0.2126, 0.7152, 0.0722));
    // premultiplied, so fading scales every channel
    gl_FragColor = vec4(vec3(luma), color.a) * uOpacity;
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;

function createPass() {
  const material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    uniforms: {
      uScene: { value: null },
      uVel: { value: 0 },
      uCols: { value: 6 },
      uInset: { value: 0 },
      uOpacity: { value: 1 },
    },
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const geometry = new THREE.PlaneGeometry(2, 2);
  const scene = new THREE.Scene();
  scene.add(new THREE.Mesh(geometry, material));
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  return { scene, camera, material, geometry };
}

export function SliceComposite() {
  const fbo = useFBO({ samples: 4, type: THREE.HalfFloatType });
  const pass = useRef<ReturnType<typeof createPass> | null>(null);

  useEffect(() => {
    const p = createPass();
    pass.current = p;
    return () => {
      p.material.dispose();
      p.geometry.dispose();
      pass.current = null;
    };
  }, []);

  useFrame((state, delta) => {
    const { gl, scene, camera, size: frame } = state;
    const p = pass.current;
    if (!p) return;
    const u = p.material.uniforms;
    const raw = THREE.MathUtils.clamp(stage.velocity / Math.max(frame.height, 1), -0.06, 0.06);
    u.uVel.value = THREE.MathUtils.damp(u.uVel.value, raw * 1.6, 8, Math.min(delta, 1 / 20));
    u.uScene.value = fbo.texture;
    u.uOpacity.value = stage.opacity;
    u.uCols.value = columnCount(frame.width);
    u.uInset.value = gutter(frame.width) / Math.max(frame.width, 1);

    gl.setRenderTarget(fbo);
    gl.clear();
    gl.render(scene, camera);
    gl.setRenderTarget(null);
    gl.render(p.scene, p.camera);
  }, 1);

  return null;
}
