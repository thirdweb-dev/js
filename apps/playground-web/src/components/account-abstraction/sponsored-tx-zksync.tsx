"use client";

import { useEffect } from "react";
import { getContract } from "thirdweb";
import { zkSyncSepolia } from "thirdweb/chains";
import { claimTo, getNFT, getOwnedNFTs } from "thirdweb/extensions/erc1155";
import {
  ConnectButton,
  MediaRenderer,
  TransactionButton,
  useActiveAccount,
  useActiveWallet,
  useActiveWalletChain,
  useDisconnect,
  useReadContract,
} from "thirdweb/react";
import { THIRDWEB_CLIENT } from "../../lib/client";
import { WALLETS } from "../../lib/constants";

const chain = zkSyncSepolia;
const editionDropContract = getContract({
  client: THIRDWEB_CLIENT,
  address: "0xd563ACBeD80e63B257B2524562BdD7Ec666eEE77",
  chain,
});
const editionDropTokenId = 0n;

export function SponsoredTxZksyncPreview() {
  const wallet = useActiveWallet();
  const { disconnect } = useDisconnect();
  const activeChain = useActiveWalletChain();
  useEffect(() => {
    if (
      wallet &&
      (wallet.id !== "smart" ||
        (activeChain && activeChain?.id !== zkSyncSepolia.id))
    ) {
      disconnect(wallet);
    }
  }, [wallet, disconnect, activeChain]);
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
                onTransactionConfirmed={async () => {
                  alert("Minted successful!");
                }}
              >
                Mint
              </TransactionButton>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
