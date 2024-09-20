"use client";

import { baseSepolia } from "thirdweb/chains";
import { claimTo, getNFT, getOwnedNFTs } from "thirdweb/extensions/erc1155";
import {
  MediaRenderer,
  TransactionButton,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import { THIRDWEB_CLIENT } from "../../lib/client";
import { StyledConnectButton } from "../styled-connect-button";
import { editionDropContract, editionDropTokenId } from "./constants";

export function SponsoredInAppTxPreview() {
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
    <div className="flex flex-col">
      <div className="flex justify-center">
        <StyledConnectButton
          accountAbstraction={{
            sponsorGas: true,
            chain: baseSepolia,
          }}
        />
      </div>
      {isNftLoading ? (
        <div className="w-full mt-24">Loading...</div>
      ) : (
        <>
          {nft ? (
            <MediaRenderer
              client={THIRDWEB_CLIENT}
              src={nft.metadata.image}
              style={{ width: "400px", marginTop: "10px" }}
            />
          ) : null}
          {smartAccount ? (
            <>
              <p className="mb-2 font-semibold text-center">
                You own {ownedNfts?.[0]?.quantityOwned.toString() || "0"}{" "}
                Kittens
              </p>
              <div className="flex justify-center">
                <TransactionButton
                  transaction={() =>
                    claimTo({
                      contract: editionDropContract,
                      tokenId: editionDropTokenId,
                      to: smartAccount.address,
                      quantity: 1n,
                    })
                  }
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
            </>
          ) : (
            <p
              style={{
                textAlign: "center",
                width: "400px",
                marginTop: "10px",
              }}
            >
              Login to mint this Kitten!
            </p>
          )}
        </>
      )}
    </div>
  );
}
