// Mutable state shared between the DOM (scroll, pointer) and the WebGL loop.
// Plain object on purpose: it is read every frame, so it must not trigger renders.

export type Pose = {
  /** horizontal centre, as a fraction of viewport width (-0.5 left edge, 0.5 right edge) */
  x: number;
  /** vertical centre, as a fraction of viewport height (-0.5 bottom, 0.5 top) */
  y: number;
  /** model height as a fraction of viewport height */
  s: number;
  /** yaw in radians */
  r: number;
  /** opacity, 0 to 1; phones fade the figure behind text-heavy sections */
  o: number;
};

type PoseSet = { desktop: Pose; mobile: Pose };

// Keyed by the `data-stage` attribute on each section.
export const POSES: Record<string, PoseSet> = {
  hero: {
    desktop: { x: 0, y: -0.04, s: 0.98, r: 0, o: 1 },
    mobile: { x: 0.04, y: -0.22, s: 0.6, r: 0, o: 1 },
  },
  about: {
    desktop: { x: -0.24, y: -0.02, s: 0.9, r: 0.55, o: 1 },
    mobile: { x: 0.18, y: 0.1, s: 0.62, r: 0.5, o: 0.22 },
  },
  work: {
    desktop: { x: 0.22, y: -0.03, s: 0.86, r: -0.35, o: 1 },
    mobile: { x: 0.2, y: 0.26, s: 0.44, r: -0.35, o: 1 },
  },
  experience: {
    desktop: { x: 0.3, y: -0.05, s: 0.8, r: -0.75, o: 1 },
    mobile: { x: 0.2, y: 0.1, s: 0.62, r: -0.75, o: 0.22 },
  },
  training: {
    desktop: { x: 0.33, y: -0.04, s: 0.84, r: -0.4, o: 1 },
    mobile: { x: 0.2, y: 0.1, s: 0.62, r: -0.4, o: 0.2 },
  },
  skills: {
    desktop: { x: -0.35, y: -0.05, s: 0.76, r: 0.8, o: 1 },
    mobile: { x: 0.2, y: 0.1, s: 0.62, r: -0.6, o: 0.22 },
  },
  contact: {
    desktop: { x: 0.35, y: -0.12, s: 0.94, r: -0.45, o: 1 },
    mobile: { x: 0.14, y: -0.1, s: 0.66, r: -0.3, o: 0.18 },
  },
};

export const stage = {
  /** Lenis scroll velocity, px per frame */
  velocity: 0,
  /** extra yaw added by the project carousel, radians */
  spin: 0,
  /** pointer in normalised device coords */
  pointer: { x: 0, y: 0 },
  /** current figure opacity, written by the character, read by the slice pass */
  opacity: 1,
  /** set true once the preloader has cleared */
  revealed: false,
};

export const MOBILE_BREAKPOINT = 768;

export function columnCount(width: number) {
  return width < MOBILE_BREAKPOINT ? 4 : 6;
}

/** matches --gutter in globals.css */
export function gutter(width: number) {
  return width < MOBILE_BREAKPOINT ? 20 : 40;
}
