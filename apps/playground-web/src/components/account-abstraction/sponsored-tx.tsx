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
  useReadContract,
} from "thirdweb/react";
import { shortenHex } from "thirdweb/utils";
import { THIRDWEB_CLIENT } from "../../lib/client";
import { WALLETS } from "../../lib/constants";

const chain = baseSepolia;
const editionDropAddress = "0x638263e3eAa3917a53630e61B1fBa685308024fa";
const editionDropTokenId = 1n;

const editionDropContract = getContract({
  address: editionDropAddress,
  chain,
  client: THIRDWEB_CLIENT,
});

export function SponsoredTxPreview() {
  const [txHash, setTxHash] = useState<string | null>(null);
  const smartAccount = useActiveAccount();
  const { data: nft, isLoading: isNftLoading } = useReadContract(getNFT, {
    contract: editionDropContract,
    tokenId: editionDropTokenId,
  });
  const { data: ownedNfts } = useReadContract(getOwnedNFTs, {
    // biome-ignore lint/style/noNonNullAssertion: handled by queryOptions
    address: smartAccount?.address!,
    contract: editionDropContract,
    queryOptions: { enabled: !!smartAccount },
    useIndexer: false,
  });

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {isNftLoading ? (
        <div className="mt-24 w-full">Loading...</div>
      ) : (
        <>
          <div className="flex flex-col justify-center gap-2 p-2">
            <ConnectButton
              accountAbstraction={{
                chain,
                sponsorGas: true,
              }}
              chain={chain}
              client={THIRDWEB_CLIENT}
              connectButton={{
                label: "Login to mint this Kitten!",
              }}
              wallets={WALLETS}
            />
          </div>
          {nft ? (
            <MediaRenderer
              client={THIRDWEB_CLIENT}
              src={nft.metadata.image}
              style={{ marginTop: "10px", width: "300px" }}
            />
          ) : null}
          {smartAccount ? (
            <div className="flex flex-col justify-center p-2">
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
                onTransactionConfirmed={async (receipt) => {
                  setTxHash(receipt.transactionHash);
                }}
                payModal={{
                  metadata: nft?.metadata,
                }}
                transaction={() =>
                  claimTo({
                    contract: editionDropContract,
                    quantity: 1n,
                    to: smartAccount.address,
                    tokenId: editionDropTokenId,
                  })
                }
              >
                Mint with EIP-4337
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
