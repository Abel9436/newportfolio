"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { stage } from "../three/stage";

type IntroState = { ready: boolean; finish: () => void };

const IntroContext = createContext<IntroState>({ ready: false, finish: () => {} });

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const finish = useCallback(() => {
    stage.revealed = true;
    setReady(true);
  }, []);
  const value = useMemo(() => ({ ready, finish }), [ready, finish]);
  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export const useIntro = () => useContext(IntroContext);
