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

export const chain = baseSepolia;
export const editionDropAddress = "0x638263e3eAa3917a53630e61B1fBa685308024fa";
export const editionDropTokenId = 1n;

export const editionDropContract = getContract({
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
    contract: editionDropContract,
    // biome-ignore lint/style/noNonNullAssertion: handled by queryOptions
    address: smartAccount?.address!,
    queryOptions: { enabled: !!smartAccount },
  });

  return (
    <div className="flex flex-col justify-center items-center">
      {isNftLoading ? (
        <div className="w-full mt-24">Loading...</div>
      ) : (
        <>
          <div className="flex flex-col justify-center p-2 gap-2">
            <ConnectButton
              client={THIRDWEB_CLIENT}
              chain={chain}
              wallets={WALLETS}
              accountAbstraction={{
                chain,
                sponsorGas: true,
              }}
              connectButton={{
                label: "Login to mint this Kitten!",
              }}
            />
          </div>
          {nft ? (
            <MediaRenderer
              client={THIRDWEB_CLIENT}
              src={nft.metadata.image}
              style={{ width: "400px", marginTop: "10px" }}
            />
          ) : null}
          {smartAccount ? (
            <div className="flex flex-col justify-center p-2">
              <p className="font-semibold text-center mb-2">
                You own {ownedNfts?.[0]?.quantityOwned.toString() || "0"}{" "}
                Kittens
              </p>
              <TransactionButton
                transaction={() =>
                  claimTo({
                    contract: editionDropContract,
                    tokenId: editionDropTokenId,
                    to: smartAccount.address,
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
                onTransactionConfirmed={async (receipt) => {
                  setTxHash(receipt.transactionHash);
                }}
              >
                Mint
              </TransactionButton>
            </div>
          ) : null}
          {txHash ? (
            <div className="flex flex-col justify-center p-2">
              <p className="text-green-500 text-center mb-2">
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
