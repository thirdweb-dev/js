"use client";

import { baseSepolia } from "thirdweb/chains";
import { claimTo, getNFT, getOwnedNFTs } from "thirdweb/extensions/erc1155";
import {
  MediaRenderer,
  TransactionButton,
  useActiveAccount,
  useReadContract,
} from "thirdweb/react";
import { inAppWallet } from "thirdweb/wallets";
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
    // biome-ignore lint/style/noNonNullAssertion: handled by queryOptions
    address: smartAccount?.address!,
    contract: editionDropContract,
    queryOptions: { enabled: !!smartAccount },
  });

  return (
    <div className="flex flex-col">
      <div className="flex justify-center">
        <StyledConnectButton
          wallets={[
            inAppWallet({
              auth: {
                options: [
                  "google",
                  "x",
                  "discord",
                  "telegram",
                  "email",
                  "phone",
                  "passkey",
                  "guest",
                ],
              },
              // TODO (7702): update to 7702 once pectra is out
              executionMode: {
                mode: "EIP4337",
                smartAccount: {
                  chain: baseSepolia,
                  sponsorGas: true,
                },
              },
            }),
          ]}
        />
      </div>
      {isNftLoading ? (
        <div className="mt-24 w-full">Loading...</div>
      ) : (
        <>
          {nft ? (
            <MediaRenderer
              client={THIRDWEB_CLIENT}
              src={nft.metadata.image}
              style={{ marginTop: "10px", width: "400px" }}
            />
          ) : null}
          {smartAccount ? (
            <>
              <p className="mb-2 text-center font-semibold">
                You own {ownedNfts?.[0]?.quantityOwned.toString() || "0"}{" "}
                Kittens
              </p>
              <div className="flex justify-center">
                <TransactionButton
                  onError={(error) => {
                    alert(`Error: ${error.message}`);
                  }}
                  onTransactionConfirmed={async () => {
                    alert("Minted successful!");
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
                  Mint
                </TransactionButton>
              </div>
            </>
          ) : (
            <p
              style={{
                marginTop: "10px",
                textAlign: "center",
                width: "400px",
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
