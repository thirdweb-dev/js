"use client";

import { client } from "@/lib/thirdweb-client";
import { useEffect, useState } from "react";
import {
  getContract,
  prepareContractCall,
  sendAndConfirmTransaction,
  toUnits,
} from "thirdweb";
import { ethereum } from "thirdweb/chains";
import { approve } from "thirdweb/extensions/erc20";
import {
  ConnectButton,
  PayEmbed,
  TransactionButton,
  useSendBatchTransaction,
} from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";

const dripContract = getContract({
  address: "0x1455d9bD6B98f95dd8FEB2b3D60ed825fcef0610",
  chain: ethereum,
  client,
});

const usdcContract = getContract({
  address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  chain: ethereum,
  client,
});

export function TipJar(props: {
  driverId: bigint;
}) {
  const sendBatch = useSendBatchTransaction();

  return (
    <ClientOnly>
      <PayEmbed
        client={client}
        connectOptions={{
          accountAbstraction: {
            chain: ethereum,
            sponsorGas: true,
          },
          chain: ethereum,
        }}
        payOptions={{
          prefillBuy: {
            chain: ethereum,
            token: {
              address: usdcContract.address,
              name: "USDC",
              symbol: "USDC",
            },
            allowEdits: {
              amount: true,
              chain: false,
              token: false,
            },
          },
        }}
      />
    </ClientOnly>
  );
}

function ClientOnly(props: { children: React.ReactNode }) {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    setLoaded(true);
  }, []);
  if (loaded) {
    return props.children;
  }
  return null;
}
