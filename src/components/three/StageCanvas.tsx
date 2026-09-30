"use client";

import dynamic from "next/dynamic";
import { useTheme } from "../providers/Theme";

// WebGL only exists in the browser, so the scene is never prerendered.
const Scene = dynamic(() => import("./Scene"), { ssr: false });

export function Stage() {
  const { theme } = useTheme();
  return <Scene theme={theme} />;
}
