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
import { base } from "thirdweb/chains";
import { useConnect } from "thirdweb/react";
import { EIP1193 } from "thirdweb/wallets";
import { nebulaAppThirdwebClient } from "../utils/nebulaThirdwebClient";

interface MiniAppContextType {
  isMiniAppReady: boolean;
  isInMiniApp: boolean;
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
  const [isInMiniApp, setisInMiniApp] = useState(false);
  const [, setError] = useState<string | null>(null);
  const { connect } = useConnect();

  const connectWallet = useCallback(async () => {
    connect(async () => {
      const wallet = EIP1193.fromProvider({ provider: sdk.wallet.ethProvider });
      await wallet.connect({ client: nebulaAppThirdwebClient, chain: base });
      return wallet;
    });
  }, [connect]);

  const setMiniAppReady = useCallback(async () => {
    try {
      const isInMiniApp = await sdk.isInMiniApp();
      setisInMiniApp(isInMiniApp);
      if (!isInMiniApp) return;
      const context = await sdk.context;
      if (context) {
        setContext(context as FrameContext);
      } else {
        setError("Failed to load Farcaster context");
      }
      await sdk.actions.ready();
      if (sdk.wallet) {
        await connectWallet();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initialize SDK");
      console.error("SDK initialization error:", err);
    } finally {
      setIsMiniAppReady(true);
    }
  }, [connectWallet]);

  useQuery({
    queryKey: ["miniapp-ready"],
    queryFn: async () => {
      try {
        await setMiniAppReady();
        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to initialize SDK",
        );
        console.error("SDK initialization error:", err);
        return false;
      }
    },
  });

  const handleAddMiniApp = useCallback(async () => {
    try {
      if (!isInMiniApp) return null;
      const result = await sdk.actions.addFrame();
      if (result) {
        return result;
      }
      return null;
    } catch (error) {
      console.error("[error] adding frame", error);
      return null;
    }
  }, [isInMiniApp]);

  useQuery({
    queryKey: ["miniapp-add"],
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
        isInMiniApp,
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
