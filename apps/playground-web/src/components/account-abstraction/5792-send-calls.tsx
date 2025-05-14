"use client";
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
  useWaitForCallsReceipt,
} from "thirdweb/react";
import { shortenHex } from "thirdweb/utils";
import { createWallet } from "thirdweb/wallets";
import { THIRDWEB_CLIENT } from "../../lib/client";
import { Spinner } from "../ui/Spinner/Spinner";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

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

  const sendCalls = useSendCalls();
  const results = useWaitForCallsReceipt(sendCalls.data);

  const txHash = results.data?.receipts?.[0]?.transactionHash;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center justify-center gap-4">
      {isNftLoading || isNft2Loading ? (
        <Card className="w-full">
          <CardContent className="flex items-center justify-center pt-6">
            <Spinner className="h-8 w-8 text-primary" />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="w-full">
            {!activeEOA && (
              <Card className="mb-4">
                <CardContent className="pt-6">
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
                </CardContent>
              </Card>
            )}

            <Card className="w-full">
              <CardHeader className="text-center">
                <CardTitle>Mint 2 NFTs at once</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-row items-center justify-center gap-6">
                  <div className="flex flex-col items-center">
                    {nft && (
                      <>
                        <MediaRenderer
                          client={THIRDWEB_CLIENT}
                          src={nft.metadata.image}
                          className="h-32 w-32 rounded-lg"
                          alt={nft.metadata.name || "NFT Image"}
                        />
                        <p className="mt-2 font-medium text-sm">
                          {nft.metadata.name}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Owned:{" "}
                          {ownedNfts2?.[0]?.quantityOwned.toString() || "0"}
                        </p>
                      </>
                    )}
                  </div>

                  <div className="flex h-8 w-8 items-center justify-center">
                    <span className="font-bold text-3xl">+</span>
                  </div>

                  <div className="flex flex-col items-center">
                    {nft2 && (
                      <>
                        <MediaRenderer
                          client={THIRDWEB_CLIENT}
                          src={nft2.metadata.image}
                          className="h-32 w-32 rounded-lg"
                          alt={nft2.metadata.name || "NFT Image"}
                        />
                        <p className="mt-2 font-medium text-sm">
                          {nft2.metadata.name}
                        </p>
                        <p className="text-muted-foreground text-xs">
                          Owned:{" "}
                          {ownedNfts?.[0]?.quantityOwned.toString() || "0"}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                {activeEOA && (
                  <Button
                    onClick={async () => {
                      await sendCalls.mutateAsync({
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
                    }}
                    disabled={sendCalls.isPending || results.isLoading}
                  >
                    {results.isLoading ? (
                      "Confirming..."
                    ) : sendCalls.isPending ? (
                      <>
                        <Spinner className="mr-2 h-4 w-4 text-current" />
                        Minting...
                      </>
                    ) : (
                      "Batch Mint with EIP-5792"
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>

          {sendCalls.data && results.isLoading && (
            <Card className="mt-4 w-full">
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-3">
                  <Spinner className="h-5 w-5 text-primary" />
                  <p className="text-center text-sm">
                    Waiting for transaction to be confirmed...
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {txHash && (
            <Card className="mt-4 w-full">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center gap-2">
                  <p className="font-medium text-green-500">
                    Transaction Confirmed!
                  </p>
                  <a
                    href={`${chain.blockExplorers?.[0]?.url}/tx/${txHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary text-sm hover:underline"
                  >
                    {shortenHex(txHash)}
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="ml-1"
                      role="img"
                      aria-label="Open in Explorer"
                    >
                      <path
                        d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M15 3H21V9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10 14L21 3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </a>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
