"use client";

import { useState } from "react";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { claimTo } from "thirdweb/extensions/erc1155";
import { getNFT, getOwnedNFTs } from "thirdweb/extensions/erc1155";
import {
  ConnectButton,
  MediaRenderer,
  TransactionButton,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import { shortenHex } from "thirdweb/utils";
import { inAppWallet } from "thirdweb/wallets/in-app";
import { THIRDWEB_CLIENT } from "../../lib/client";

const chain = sepolia;
const editionDropAddress = "0x7B3e0B8353Ad5cD6C60355B50550F63335752f9F";
const editionDropTokenId = 1n;

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
  const { data: nft, isLoading: isNftLoading } = useReadContract(getNFT, {
    contract: editionDropContract,
    tokenId: editionDropTokenId,
  });
  const { data: ownedNfts } = useReadContract(getOwnedNFTs, {
    contract: editionDropContract,
    useIndexer: false,
    // biome-ignore lint/style/noNonNullAssertion: handled by queryOptions
    address: activeEOA?.address!,
    queryOptions: { enabled: !!activeEOA },
  });

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {isNftLoading ? (
        <div className="mt-24 w-full">Loading...</div>
      ) : (
        <>
          <div className="flex flex-col justify-center gap-2 p-2">
            <ConnectButton
              client={THIRDWEB_CLIENT}
              chain={sepolia}
              wallets={[iaw]}
              connectButton={{
                label: "Login to mint!",
              }}
            />
          </div>
          {nft ? (
            <MediaRenderer
              client={THIRDWEB_CLIENT}
              src={nft.metadata.image}
              style={{ width: "300px", marginTop: "10px" }}
            />
          ) : null}
          {activeEOA ? (
            <div className="flex flex-col justify-center gap-4 p-2">
              <p className="mb-2 text-center font-semibold">
                You own {ownedNfts?.[0]?.quantityOwned.toString() || "0"}{" "}
                {nft?.metadata?.name}
              </p>
              <TransactionButton
                transaction={() =>
                  claimTo({
                    contract: editionDropContract,
                    tokenId: editionDropTokenId,
                    to: activeEOA.address,
                    quantity: 1n,
                  })
                }
                payModal={{
                  metadata: nft?.metadata,
                }}
                onError={(error) => {
                  alert(`Error: ${error.message}`);
                }}
                onClick={() => {
                  setTxHash(null);
                }}
                onTransactionSent={async (tx) => {
                  setTxHash(tx.transactionHash);
                }}
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
                  href={`${chain.blockExplorers?.[0]?.url}/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
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
