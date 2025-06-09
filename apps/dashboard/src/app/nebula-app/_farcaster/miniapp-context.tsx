"use client";

import type { AddMiniAppResult } from "@farcaster/frame-core/dist/actions/AddMiniApp";
import type { FrameContext } from "@farcaster/frame-core/dist/context";
import { sdk } from "@farcaster/frame-sdk";
import { useQuery } from "@tanstack/react-query";
import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";

interface MiniAppContextType {
  isMiniAppReady: boolean;
  context: FrameContext | null;
  setMiniAppReady: () => void;
  addMiniApp: () => Promise<AddMiniAppResult | null>;
}

// eslint-disable-next-line no-restricted-syntax
const MiniAppContext = createContext<MiniAppContextType | undefined>(undefined);

export function MiniAppProvider({
  addMiniAppOnLoad,
  children,
}: {
  addMiniAppOnLoad?: boolean;
  children: ReactNode;
}) {
  const [context, setContext] = useState<FrameContext | null>(null);
  const [isMiniAppReady, setIsMiniAppReady] = useState(false);

  const setMiniAppReady = useCallback(async () => {
    try {
      const context = await sdk.context;
      if (context) {
        setContext(context as FrameContext);
      }
      await sdk.actions.ready();
    } catch (err) {
      console.error("SDK initialization error:", err);
    } finally {
      setIsMiniAppReady(true);
    }
  }, []);

  useQuery({
    queryKey: ["frame-ready"],
    queryFn: async () => {
      try {
        await setMiniAppReady();
        return true;
      } catch (error) {
        console.error("[error] setting mini app ready", error);
        return false;
      }
    },
  });

  const handleAddMiniApp = useCallback(async () => {
    try {
      const result = await sdk.actions.addFrame();
      if (result) {
        return result;
      }
      return null;
    } catch (error) {
      console.error("[error] adding frame", error);
      return null;
    }
  }, []);

  useQuery({
    queryKey: ["frame-add"],
    queryFn: async () => {
      try {
        await handleAddMiniApp();
        return true;
      } catch (error) {
        console.error("[error] adding frame", error);
        return false;
      }
    },
    enabled: isMiniAppReady && !context?.client?.added && addMiniAppOnLoad,
  });

  return (
    <MiniAppContext.Provider
      value={{
        isMiniAppReady,
        setMiniAppReady,
        addMiniApp: handleAddMiniApp,
        context,
      }}
    >
      {children}
    </MiniAppContext.Provider>
  );
}

export function useMiniApp() {
  const context = useContext(MiniAppContext);
  if (context === undefined) {
    throw new Error("useMiniApp must be used within a MiniAppProvider");
  }
  return context;
}
