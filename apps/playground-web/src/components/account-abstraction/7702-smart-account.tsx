"use client";

import { useState } from "react";
import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { claimTo, getNFT, getOwnedNFTs } from "thirdweb/extensions/erc1155";
import {
  ConnectButton,
  MediaRenderer,
  TransactionButton,
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
  useReadContract,
} from "thirdweb/react";
import { shortenHex } from "thirdweb/utils";
import { inAppWallet } from "thirdweb/wallets/in-app";
import { THIRDWEB_CLIENT } from "../../lib/client";
import { Button } from "../ui/button";

const chain = baseSepolia;
const editionDropAddress = "0x638263e3eAa3917a53630e61B1fBa685308024fa";
const editionDropTokenId = 2n;

const editionDropContract = getContract({
  address: editionDropAddress,
  chain,
  client: THIRDWEB_CLIENT,
});

const iaw = inAppWallet({
  executionMode: {
    mode: "EIP7702",
    sponsorGas: true,
  },
});

export function Eip7702SmartAccountPreview() {
  const [txHash, setTxHash] = useState<string | null>(null);
  const activeEOA = useActiveAccount();
  const activeWallet = useActiveWallet();
  const { disconnect } = useDisconnect();
  const { data: nft, isLoading: isNftLoading } = useReadContract(getNFT, {
    contract: editionDropContract,
    tokenId: editionDropTokenId,
  });
  const { data: ownedNfts } = useReadContract(getOwnedNFTs, {
    // biome-ignore lint/style/noNonNullAssertion: handled by queryOptions
    address: activeEOA?.address!,
    contract: editionDropContract,
    queryOptions: { enabled: !!activeEOA },
    useIndexer: false,
  });

  if (activeEOA && activeWallet && activeWallet?.id !== iaw.id) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        Please connect with an in-app wallet for this example
        <Button
          onClick={() => {
            disconnect(activeWallet);
          }}
        >
          Disconnect current wallet
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {isNftLoading ? (
        <div className="mt-24 w-full">Loading...</div>
      ) : (
        <>
          <div className="flex flex-col justify-center gap-2 p-2">
            <ConnectButton
              chain={chain}
              client={THIRDWEB_CLIENT}
              connectButton={{
                label: "Login to mint!",
              }}
              wallets={[iaw]}
            />
          </div>
          {nft ? (
            <MediaRenderer
              client={THIRDWEB_CLIENT}
              src={nft.metadata.image}
              style={{ marginTop: "10px", width: "300px" }}
            />
          ) : null}
          {activeEOA ? (
            <div className="flex flex-col justify-center gap-4 p-2">
              <p className="mb-2 text-center font-semibold">
                You own {ownedNfts?.[0]?.quantityOwned.toString() || "0"}{" "}
                {nft?.metadata?.name}
              </p>
              <TransactionButton
                onClick={() => {
                  setTxHash(null);
                }}
                onError={(error) => {
                  alert(`Error: ${error.message}`);
                }}
                onTransactionSent={async (tx) => {
                  setTxHash(tx.transactionHash);
                }}
                payModal={{
                  metadata: nft?.metadata,
                }}
                transaction={() =>
                  claimTo({
                    contract: editionDropContract,
                    quantity: 1n,
                    to: activeEOA.address,
                    tokenId: editionDropTokenId,
                  })
                }
              >
                Mint with EIP-7702
              </TransactionButton>
            </div>
          ) : null}
          {txHash ? (
            <div className="flex flex-col justify-center p-2">
              <p className="mb-2 text-center text-green-500">
                Minted! Tx Hash:{" "}
                <a
                  className="underline"
                  href={`${chain.blockExplorers?.[0]?.url}/tx/${txHash}`}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {shortenHex(txHash)}
                </a>
              </p>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
