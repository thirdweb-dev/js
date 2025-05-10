"use client";

import { useState } from "react";
import { getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import { claimTo } from "thirdweb/extensions/erc1155";
import { getNFT, getOwnedNFTs } from "thirdweb/extensions/erc1155";
import {
  ConnectButton,
  MediaRenderer,
  useActiveAccount,
  useReadContract,
  useSendCalls,
} from "thirdweb/react";
import { shortenHex } from "thirdweb/utils";
import { createWallet } from "thirdweb/wallets";
import { THIRDWEB_CLIENT } from "../../lib/client";
import { Button } from "../ui/button";

const chain = sepolia;

const editionDropContract = getContract({
  address: "0x7B3e0B8353Ad5cD6C60355B50550F63335752f9F",
  chain,
  client: THIRDWEB_CLIENT,
});

const editionDropContract2 = getContract({
  address: "0xe2cb0eb5147b42095c2FfA6F7ec953bb0bE347D8",
  chain,
  client: THIRDWEB_CLIENT,
});

export function Eip5792SendCallsPreview() {
  const [txHash, setTxHash] = useState<string | null>(null);
  const activeEOA = useActiveAccount();
  const { data: nft, isLoading: isNftLoading } = useReadContract(getNFT, {
    contract: editionDropContract2,
    tokenId: 0n,
  });
  const { data: nft2, isLoading: isNft2Loading } = useReadContract(getNFT, {
    contract: editionDropContract,
    tokenId: 1n,
  });
  const { data: ownedNfts } = useReadContract(getOwnedNFTs, {
    contract: editionDropContract,
    useIndexer: false,
    // biome-ignore lint/style/noNonNullAssertion: handled by queryOptions
    address: activeEOA?.address!,
    queryOptions: { enabled: !!activeEOA },
  });
  const { data: ownedNfts2 } = useReadContract(getOwnedNFTs, {
    contract: editionDropContract2,
    useIndexer: false,
    // biome-ignore lint/style/noNonNullAssertion: handled by queryOptions
    address: activeEOA?.address!,
    queryOptions: { enabled: !!activeEOA },
  });

  const sendCalls = useSendCalls({
    client: THIRDWEB_CLIENT,
    waitForResult: true,
  });

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {isNftLoading || isNft2Loading ? (
        <div className="mt-24 w-full">Loading...</div>
      ) : (
        <>
          <div className="flex flex-col justify-center gap-2 p-2">
            <ConnectButton
              client={THIRDWEB_CLIENT}
              chain={sepolia}
              wallets={[
                createWallet("io.metamask"),
                createWallet("com.coinbase.wallet"),
              ]}
              connectButton={{
                label: "Login to mint!",
              }}
            />
          </div>
          <p className="font-semibold text-lg">Send batched transactions</p>
          <div className="flex flex-row items-center gap-2 p-2">
            {nft ? (
              <MediaRenderer
                client={THIRDWEB_CLIENT}
                src={nft.metadata.image}
                style={{ width: "100px", marginTop: "10px" }}
              />
            ) : null}
            <p className="text-2xl">+</p>
            {nft2 ? (
              <MediaRenderer
                client={THIRDWEB_CLIENT}
                src={nft2.metadata.image}
                style={{ width: "100px", marginTop: "10px" }}
              />
            ) : null}
          </div>
          {activeEOA ? (
            <div className="flex flex-col justify-center gap-4 p-2">
              <p className="mb-2 text-center font-semibold">
                You own {ownedNfts?.[0]?.quantityOwned.toString() || "0"}{" "}
                {nft?.metadata?.name} and{" "}
                {ownedNfts2?.[0]?.quantityOwned.toString() || "0"}{" "}
                {nft2?.metadata?.name}
              </p>
              <Button
                onClick={async () => {
                  const result = await sendCalls.mutateAsync({
                    calls: [
                      claimTo({
                        contract: editionDropContract2,
                        tokenId: 0n,
                        to: activeEOA.address,
                        quantity: 1n,
                      }),
                      claimTo({
                        contract: editionDropContract,
                        tokenId: 1n,
                        to: activeEOA.address,
                        quantity: 1n,
                      }),
                    ],
                  });
                  if (typeof result === "string") {
                    setTxHash(result);
                  } else {
                    setTxHash(result?.receipts?.[0]?.transactionHash ?? null);
                  }
                }}
              >
                {sendCalls.isPending
                  ? "Minting..."
                  : "Batch Mint with EIP-5792"}
              </Button>
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
