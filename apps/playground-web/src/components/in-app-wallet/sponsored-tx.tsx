"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";
import { claimTo, getNFT, getOwnedNFTs } from "thirdweb/extensions/erc1155";
import {
  MediaRenderer,
  TransactionButton,
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
  useReadContract,
} from "thirdweb/react";
import { THIRDWEB_CLIENT } from "../../lib/client";
import { CodeExample } from "../code/code-example";
import { editionDropContract, editionDropTokenId } from "./constants";

export function SponsoredInAppTx() {
  return (
    <>
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
          Signless Sponsored Transactions
        </h2>
        <p className="max-w-[600px]">
          With in-app wallets, users don&apos;t need to confirm every
          transaction.
          <br />
          Combine it with smart account flag to cover gas costs for the best UX.
        </p>
      </div>
      <CodeExample
        preview={<SponsoredInAppTxPreview />}
        code={`import { inAppWallet } from "thirdweb/wallets";
  import { claimTo } from "thirdweb/extensions/erc1155";
  import { ConnectButton, TransactionButton } from "thirdweb/react";

  
  const wallets = [
    inAppWallet(
      // turn on gas sponsorship for in-app wallets
      { smartAccount: { chain, sponsorGas: true }}
    )
  ];

  function App(){
    return (<>
<ConnectButton client={client} wallets={wallets} />

{/* signless, sponsored transactions */}
<TransactionButton transaction={() => claimTo({ contract, to: "0x123...", tokenId: 0n, quantity: 1n })}>Mint</TransactionButton>
</>);
};`}
        lang="tsx"
      />
    </>
  );
}

function SponsoredInAppTxPreview() {
  const wallet = useActiveWallet();
  const { disconnect } = useDisconnect();
  useEffect(() => {
    if (wallet && wallet.id !== "inApp") {
      disconnect(wallet);
    }
  }, [wallet, disconnect]);
  const { theme } = useTheme();
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
      {isNftLoading ? (
        <div className="w-full mt-24">Loading...</div>
      ) : (
        <>
          {nft ? (
            <MediaRenderer
              client={THIRDWEB_CLIENT}
              src={nft.metadata.image}
              style={{ width: "100%", marginTop: "10px" }}
            />
          ) : null}
          {smartAccount ? (
            <>
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
                onError={(error) => {
                  alert(`Error: ${error.message}`);
                }}
                onTransactionConfirmed={async () => {
                  alert("Minted successful!");
                }}
              >
                Mint
              </TransactionButton>
            </>
          ) : (
            <p
              style={{
                textAlign: "center",
                width: "100%",
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
