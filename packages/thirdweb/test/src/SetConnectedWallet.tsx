import { useEffect, useRef } from "react";
import { createWalletAdapter } from "../../src/adapters/wallet-adapter.js";
import { ethereum } from "../../src/chains/chain-definitions/ethereum.js";
import { useConnect } from "../../src/react/core/hooks/wallets/useConnect.js";
import { TEST_CLIENT } from "./test-clients.js";
import { TEST_ACCOUNT_A } from "./test-wallets.js";

export const SetConnectedWallet = () => {
  const connectStarted = useRef(false);
  const { connect } = useConnect();

  // biome-ignore lint/correctness/useExhaustiveDependencies: legit use case
  useEffect(() => {
    if (connectStarted.current) {
      return;
    }

    connectStarted.current = true;

    const wallet = createWalletAdapter({
      adaptedAccount: TEST_ACCOUNT_A,
      client: TEST_CLIENT,
      chain: ethereum,
      onDisconnect: () => {},
      switchChain: () => {},
    });

    connect(wallet);
  }, []);

  return null;
};
