import { thirdwebClient } from "@/constants/client";
import type { Signer } from "ethers";
import * as ethers from "ethers";
import { useEffect, useState } from "react";
import { toEthersSigner } from "thirdweb/adapters/ethers5";
import {
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
} from "thirdweb/react";

export function useEthersSigner() {
  const activeWallet = useActiveWallet();
  const activeAccount = useActiveAccount();
  const activeChain = useActiveWalletChain();
  const [signer, setSigner] = useState<Signer | undefined>(undefined);

  // will be deleted as part of: https://github.com/thirdweb-dev/dashboard/pull/2648
  // eslint-disable-next-line no-restricted-syntax
  useEffect(() => {
    let active = true;
    async function run() {
      if (!activeWallet || !activeAccount || !activeChain) {
        setSigner(undefined);
        return;
      }
      try {
        const s = await toEthersSigner(
          ethers,
          thirdwebClient,
          activeAccount,
          activeChain,
        );
        if (active) {
          setSigner(s);
        }
      } catch (e) {
        console.error("failed to get signer", e);
      }
    }
    run();
    return () => {
      active = false;
    };
  }, [activeAccount, activeChain, activeWallet]);

  return signer;
}
