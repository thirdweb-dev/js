"use client";
import { useState } from "react";
import { getContract } from "thirdweb";
import { zkSyncSepolia } from "thirdweb/chains";
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

// const chain = abstractTestnet;
// const editionDropContract = getContract({
//   client: THIRDWEB_CLIENT,
//   address: "0x8A24a7Df38fA5fCCcFD1259e90Fb6996fDdfcADa",
//   chain,
// });
const chain = zkSyncSepolia;
const editionDropContract = getContract({
  client: THIRDWEB_CLIENT,
  address: "0xd563ACBeD80e63B257B2524562BdD7Ec666eEE77",
  chain,
});
const editionDropTokenId = 0n;

export function SponsoredTxZksyncPreview() {
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
    <div className="flex flex-col items-center justify-center">
      {isNftLoading ? (
        <div className="mt-24 w-full">Loading...</div>
      ) : (
        <>
          <div className="flex flex-col justify-center gap-2 p-2">
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
              <p className="mb-2 text-center font-semibold">
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
                  console.error("error", error);
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
