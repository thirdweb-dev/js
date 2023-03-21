import {
  SafeWallet,
  SafeConnectionArgs,
} from "@thirdweb-dev/wallets/evm/wallets/safe";
import { useCallback } from "react";
import { useConnect } from "../../../core/hooks/wallet-hooks";

export function useSafe() {
  const connect = useConnect();
  return useCallback(
    (connectProps: SafeConnectionArgs) => connect(SafeWallet, connectProps),
    [connect],
  );
}

// backwards compatibility
export const useGnosis = useSafe;
