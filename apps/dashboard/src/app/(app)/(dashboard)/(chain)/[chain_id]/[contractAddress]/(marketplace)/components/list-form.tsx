import { InfoIcon } from "lucide-react";
import Link from "next/link";
import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  getContract,
  NATIVE_TOKEN_ADDRESS,
  type ThirdwebContract,
  toUnits,
  toWei,
} from "thirdweb";
import { decimals } from "thirdweb/extensions/erc20";
import {
  isApprovedForAll as isApprovedForAll721,
  isERC721,
  ownerOf,
  setApprovalForAll as setApprovalForAll721,
} from "thirdweb/extensions/erc721";
import {
  balanceOf,
  isApprovedForAll as isApprovedForAll1155,
  isERC1155,
  setApprovalForAll as setApprovalForAll1155,
} from "thirdweb/extensions/erc1155";
import type {
  CreateAuctionParams,
  CreateListingParams,
} from "thirdweb/extensions/marketplace";
import { createAuction, createListing } from "thirdweb/extensions/marketplace";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";
import { CurrencySelector } from "@/components/blocks/CurrencySelector";
import { NFTMediaWithEmptyState } from "@/components/blocks/nft-media";
import { SolidityInput } from "@/components/solidity-inputs";
import { TransactionButton } from "@/components/tx-button";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { ToolTipLabel } from "@/components/ui/tooltip";
import { useDashboardOwnedNFTs } from "@/hooks/useDashboardOwnedNFTs";
import { useTxNotifications } from "@/hooks/useTxNotifications";
import { useWalletNFTs } from "@/hooks/useWalletNFTs";
import { cn } from "@/lib/utils";
import { isAlchemySupported } from "@/lib/wallet/nfts/isAlchemySupported";
import { isMoralisSupported } from "@/lib/wallet/nfts/isMoralisSupported";
import type { WalletNFT } from "@/lib/wallet/nfts/types";
import { shortenIfAddress } from "@/utils/usedapp-external";

type ListForm =
  | (Omit<CreateListingParams, "quantity" | "currencyContractAddress"> & {
      currencyContractAddress: string;
      selected?: WalletNFT;
      listingType: "direct";
      listingDurationInSeconds: string;
      quantity: string;
      pricePerToken: string;
    })
  | (Omit<CreateAuctionParams, "quantity" | "currencyContractAddress"> & {
      currencyContractAddress: string;
      selected?: WalletNFT;
      listingType: "auction";
      listingDurationInSeconds: string;
      quantity: string;
      buyoutPricePerToken: string;
      reservePricePerToken: string;
    });

type CreateListingsFormProps = {
  contract: ThirdwebContract;
  actionText: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mode: "automatic" | "manual";
  type?: "direct-listings" | "english-auctions";
  isLoggedIn: boolean;
  isInsightSupported: boolean;
};

const auctionTimes = [
  { label: "1 day", value: 60 * 60 * 24 },
  { label: "3 days", value: 60 * 60 * 24 * 3 },
  { label: "7 days", value: 60 * 60 * 24 * 7 },
  { label: "1 month", value: 60 * 60 * 24 * 30 },
  { label: "3 months", value: 60 * 60 * 24 * 30 * 3 },
  { label: "6 months", value: 60 * 60 * 24 * 30 * 6 },
  { label: "1 year", value: 60 * 60 * 24 * 365 },
];

export const CreateListingsForm: React.FC<CreateListingsFormProps> = ({
  contract,
  type,
  actionText,
  setOpen,
  isLoggedIn,
  mode,
  isInsightSupported,
}) => {
  const chainId = contract.chain.id;

  const [isFormLoading, setIsFormLoading] = useState(false);

  const isSupportedChain =
    chainId &&
    (isInsightSupported ||
      isAlchemySupported(chainId) ||
      isMoralisSupported(chainId));

  const account = useActiveAccount();

  const { data: walletNFTs, isPending: isWalletNFTsLoading } = useWalletNFTs({
    chainId,
    isInsightSupported,
    walletAddress: account?.address,
  });

  const sendAndConfirmTx = useSendAndConfirmTransaction();
  const listingNotifications = useTxNotifications(
    "NFT listed Successfully",
    "Failed to list NFT",
  );

  const auctionNotifications = useTxNotifications(
    "Auction created successfully",
    "Failed to create an auction",
  );

  const form = useForm<ListForm>({
    defaultValues:
      type === "direct-listings"
        ? {
            currencyContractAddress: NATIVE_TOKEN_ADDRESS,
            // Default to one month duration
            listingDurationInSeconds: (60 * 60 * 24 * 30).toString(),
            listingType: "direct",
            pricePerToken: "0",
            quantity: "1",
            selected: undefined,
            startTimestamp: new Date(),
          }
        : {
            buyoutPricePerToken: "0",
            currencyContractAddress: NATIVE_TOKEN_ADDRESS,
            // Default to one month duration
            listingDurationInSeconds: (60 * 60 * 24 * 30).toString(),
            listingType: "auction",
            quantity: "1",
            reservePricePerToken: "0",
            selected: undefined,
            startTimestamp: new Date(),
          },
  });

  const selectedContract = form.watch("selected.contractAddress")
    ? getContract({
        address: form.watch("selected.contractAddress"),
        chain: contract.chain,
        client: contract.client,
      })
    : undefined;

  const { data: ownedNFTs, isPending: isOwnedNFTsLoading } =
    useDashboardOwnedNFTs({
      contract: selectedContract,
      // Only run this hook as the last resort if this chain is not supported by the API services we are using
      disabled:
        !selectedContract ||
        isSupportedChain ||
        isWalletNFTsLoading ||
        (walletNFTs?.result || []).length > 0 ||
        mode === "manual",
      owner: account?.address,
    });

  const isSelected = (nft: WalletNFT) => {
    return (
      form.watch("selected")?.id === nft.id &&
      form.watch("selected")?.contractAddress === nft.contractAddress
    );
  };

  const ownedWalletNFTs: WalletNFT[] = useMemo(() => {
    return ownedNFTs?.map((nft) => {
      if (nft.type === "ERC721") {
        return {
          chainId: nft.chainId,
          contractAddress: form.watch("selected.contractAddress"),
          id: String(nft.id),
          metadata: nft.metadata,
          owner: nft.owner,
          supply: "1",
          tokenAddress: nft.tokenAddress,
          tokenId: nft.id.toString(),
          tokenURI: nft.tokenURI,
          type: "ERC721",
        };
      }
      return {
        chainId: nft.chainId,
        contractAddress: form.watch("selected.contractAddress"),
        id: String(nft.id),
        metadata: nft.metadata,
        owner: nft.owner,
        supply: String(nft.supply),
        tokenAddress: nft.tokenAddress,
        tokenId: nft.id.toString(),
        tokenURI: nft.tokenURI,
        type: "ERC1155",
      };
    }) as WalletNFT[];
  }, [ownedNFTs, form]);

  const nfts = ownedWalletNFTs || walletNFTs?.result;

  return (
    <Form {...form}>
      <form
        className="space-y-5"
        onSubmit={form.handleSubmit(async (formData) => {
          if (!account) {
            return toast.error("No account detected");
          }
          setIsFormLoading(true);
          let nftType: "ERC1155" | "ERC721";
          let _selectedContract: ThirdwebContract;
          let selectedTokenId: bigint;
          const selectedQuantity = BigInt(formData.quantity);
          try {
            if (mode === "manual") {
              if (!formData.assetContractAddress) {
                setIsFormLoading(false);
                return toast.error("Enter a valid NFT contract address");
              }
              _selectedContract = getContract({
                address: formData.assetContractAddress,
                chain: contract.chain,
                client: contract.client,
              });
              /**
               * In manual mode we need to detect the NFT type ourselves
               * instead of relying on the third-party providers
               */
              const [is721, is1155] = await Promise.all([
                isERC721({ contract: _selectedContract }),
                isERC1155({ contract: _selectedContract }),
              ]);
              if (!is721 && !is1155) {
                setIsFormLoading(false);
                return toast.error(
                  `Error: ${formData.assetContractAddress} is neither an ERC721 or ERC1155 contract`,
                );
              }
              selectedTokenId = BigInt(formData.tokenId);
              nftType = is721 ? "ERC721" : "ERC1155";
              /**
               * Also in manual mode we need to make sure the user owns the tokenId they entered
               * For ERC1155, the owned balance must be >= the entered quantity
               * For ERC721, the owner address must match theirs
               */
              if (nftType === "ERC1155") {
                const balance = await balanceOf({
                  contract: _selectedContract,
                  owner: account.address,
                  tokenId: selectedTokenId,
                });
                if (balance === 0n) {
                  setIsFormLoading(false);
                  return toast.error(
                    `You do not own any tokenId #${selectedTokenId.toString()} from the collection: ${shortenAddress(formData.assetContractAddress)}`,
                  );
                }
                if (balance < selectedQuantity) {
                  setIsFormLoading(false);
                  return toast.error(
                    `The balance you own for tokenId #${selectedTokenId.toString()} is less than the quantity (you own ${balance.toString()})`,
                  );
                }
              } else {
                if (selectedQuantity !== 1n) {
                  setIsFormLoading(false);
                  return toast.error(
                    "The quantity can only be 1 for ERC721 token",
                  );
                }
                const owner = await ownerOf({
                  contract: _selectedContract,
                  tokenId: selectedTokenId,
                }).catch(() => undefined);
                if (owner?.toLowerCase() !== account.address.toLowerCase()) {
                  setIsFormLoading(false);
                  return toast.error(
                    `You do not own the tokenId #${selectedTokenId.toString()} from the collection: ${shortenAddress(formData.assetContractAddress)}`,
                  );
                }
              }
            } else {
              if (!formData.selected || !selectedContract) {
                setIsFormLoading(false);
                return toast.error("Please select an NFT to list");
              }
              nftType = formData.selected.type;
              _selectedContract = selectedContract;
              selectedTokenId = BigInt(formData.selected.id);
            }
            /**
             * Make sure the selected item is approved to be listed on the marketplace contract
             * todo: We are checking "isApprovedForAll" for both erc1155 and 721.
             * However for ERC721 there's also a function called "getApproved" which is used to check for approval status of a single token
             * - might worth adding that logic here.
             */
            const isNftApproved =
              nftType === "ERC1155"
                ? isApprovedForAll1155
                : isApprovedForAll721;
            const isApproved = await isNftApproved({
              contract: _selectedContract,
              operator: contract.address,
              owner: account.address,
            });

            if (!isApproved) {
              const setNftApproval =
                nftType === "ERC1155"
                  ? setApprovalForAll1155
                  : setApprovalForAll721;
              const approveTx = setNftApproval({
                approved: true,
                contract: _selectedContract,
                operator: contract.address,
              });

              const promise = sendAndConfirmTx.mutateAsync(approveTx);
              toast.promise(promise, {
                error: "Failed to approve NFT",
                loading: "Approving NFT for listing",
                success: "NFT approved successfully",
              });
              await promise;
            }

            if (formData.listingType === "direct") {
              // Hard code to 100 years for now
              const endTimestamp = new Date(
                new Date().setFullYear(new Date().getFullYear() + 100),
              );
              const transaction = createListing({
                assetContractAddress: _selectedContract.address,
                contract,
                currencyContractAddress: formData.currencyContractAddress,
                endTimestamp,
                pricePerToken: String(formData.pricePerToken),
                quantity: selectedQuantity,
                startTimestamp: formData.startTimestamp,
                tokenId: selectedTokenId,
              });

              await sendAndConfirmTx.mutateAsync(transaction, {
                onSuccess: () => setOpen(false),
              });

              listingNotifications.onSuccess();
            } else if (formData.listingType === "auction") {
              let minimumBidAmountWei: bigint;
              let buyoutBidAmountWei: bigint;
              if (
                formData.currencyContractAddress.toLowerCase() ===
                NATIVE_TOKEN_ADDRESS.toLocaleLowerCase()
              ) {
                minimumBidAmountWei = toWei(
                  formData.reservePricePerToken.toString(),
                );
                buyoutBidAmountWei = toWei(
                  formData.buyoutPricePerToken.toString(),
                );
              } else {
                const tokenContract = getContract({
                  address: formData.currencyContractAddress,
                  chain: contract.chain,
                  client: contract.client,
                });
                const _decimals = await decimals({ contract: tokenContract });
                minimumBidAmountWei = toUnits(
                  formData.reservePricePerToken.toString(),
                  _decimals,
                );
                buyoutBidAmountWei = toUnits(
                  formData.buyoutPricePerToken.toString(),
                  _decimals,
                );
              }

              const transaction = createAuction({
                assetContractAddress: _selectedContract.address,
                buyoutBidAmountWei: buyoutBidAmountWei * selectedQuantity,
                contract,
                currencyContractAddress: formData.currencyContractAddress,
                endTimestamp: new Date(
                  Date.now() +
                    Number.parseInt(formData.listingDurationInSeconds) * 1000,
                ),
                minimumBidAmountWei: minimumBidAmountWei * selectedQuantity,
                startTimestamp: formData.startTimestamp,
                tokenId: selectedTokenId,
              });

              await sendAndConfirmTx.mutateAsync(transaction, {
                onSuccess: () => {
                  setOpen(false);
                },
              });
              auctionNotifications.onSuccess();
            }
          } catch (err) {
            console.error(err);
            if (formData.listingType === "auction") {
              auctionNotifications.onError(err);
            } else {
              listingNotifications.onError(err);
            }
          }

          setIsFormLoading(false);
        })}
      >
        {mode === "manual" && (
          <>
            {/* contract address */}
            <FormItem>
              <FormDescription className="!mt-0 mb-5">
                Manually enter the contract address and token ID of the NFT you
                want to list for sale
              </FormDescription>
              <FormLabel>NFT Contract Address</FormLabel>
              <FormControl>
                <Input
                  {...form.register("assetContractAddress")}
                  className="bg-card"
                />
              </FormControl>
              <FormMessage />
            </FormItem>

            {/* token id */}
            <FormItem>
              <FormLabel>Token ID</FormLabel>
              <FormControl>
                <Input {...form.register("tokenId")} className="bg-card" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </>
        )}

        {/* select owned nft */}
        {mode === "automatic" && (
          <FormItem>
            <FormDescription className="!mt-0 mb-5">
              Select the NFT you want to list for sale
            </FormDescription>

            {!isSupportedChain ? (
              <div className="flex flex-col gap-4 mb-4">
                <div className="flex flex-row items-center gap-3 rounded-md border border-border border-orange-100 bg-orange-50 p-[10px] dark:border-orange-300 dark:bg-orange-300">
                  <InfoIcon className="size-6 text-orange-400 dark:text-orange-900" />
                  <p className="text-orange-800 dark:text-orange-900">
                    This chain is not supported by our NFT API yet, please enter
                    the contract address of the NFT you want to list.
                  </p>
                </div>
                <FormItem>
                  <FormLabel>Contract address</FormLabel>
                  <FormControl>
                    <SolidityInput
                      client={contract.client}
                      formContext={form}
                      solidityType="address"
                      {...form.register("selected.contractAddress", {
                        required: "Contract address is required",
                      })}
                      placeholder="0x..."
                    />
                  </FormControl>
                  <FormMessage>
                    {form.formState.errors.selected?.contractAddress?.message}
                  </FormMessage>
                  <FormDescription>
                    This will display all the NFTs you own from this contract.
                  </FormDescription>
                </FormItem>
              </div>
            ) : null}

            {isWalletNFTsLoading ||
            (isOwnedNFTsLoading &&
              !isSupportedChain &&
              form.watch("selected.contractAddress")) ? (
              <div className="flex flex-wrap gap-3">
                {new Array(8).fill(0).map((_, index) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: ok
                  <Skeleton key={index} className="size-[140px] rounded-md" />
                ))}
              </div>
            ) : nfts && nfts.length !== 0 ? (
              <div className="flex flex-wrap gap-3">
                {nfts?.map((nft) => {
                  function handleClick() {
                    if (isSelected(nft)) {
                      form.setValue("selected", undefined);
                    } else {
                      form.setValue("selected", nft);
                    }
                  }

                  return (
                    <ToolTipLabel
                      key={nft.contractAddress + nft.id}
                      label={
                        <ul>
                          <li>
                            <strong>Name:</strong> {nft.metadata?.name || "N/A"}
                          </li>
                          <li>
                            <strong>Contract Address:</strong>{" "}
                            {shortenIfAddress(nft.contractAddress)}
                          </li>
                          <li>
                            <strong>Token ID: </strong> {nft.id.toString()}
                          </li>
                          <li>
                            <strong>Token Standard: </strong> {nft.type}
                          </li>
                        </ul>
                      }
                    >
                      {/** biome-ignore lint/a11y/useSemanticElements: ok */}
                      <div
                        tabIndex={0}
                        role="button"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleClick();
                          }
                        }}
                        className={cn(
                          "rounded-lg cursor-pointer overflow-hidden",
                          isSelected(nft) &&
                            "ring-2 ring-primary ring-offset-2 ring-offset-background",
                        )}
                        onClick={handleClick}
                      >
                        <NFTMediaWithEmptyState
                          client={contract.client}
                          height="140px"
                          metadata={nft.metadata}
                          requireInteraction
                          width="140px"
                          className="bg-card"
                        />
                      </div>
                    </ToolTipLabel>
                  );
                })}
              </div>
            ) : nfts && nfts.length === 0 ? (
              <div className="flex flex-row items-center gap-3 rounded-md border border-border border-orange-100 bg-orange-50 p-[10px] dark:border-orange-300 dark:bg-orange-300">
                <InfoIcon className="size-6 text-orange-400 dark:text-orange-900" />
                <p className="text-orange-800 dark:text-orange-900">
                  There are no NFTs owned by this wallet. You need NFTs to
                  create a listing. You can create NFTs with thirdweb.{" "}
                  <Link
                    className="text-blue-600"
                    href="/explore/nft"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Explore NFT contracts
                  </Link>
                  .
                </p>
              </div>
            ) : null}
          </FormItem>
        )}

        {/* listing currency */}
        <FormItem>
          <FormLabel>Listing Currency</FormLabel>
          <FormControl>
            <CurrencySelector
              className="bg-card"
              contractChainId={chainId}
              onChange={(e) =>
                form.setValue("currencyContractAddress", e.target.value)
              }
              value={form.watch("currencyContractAddress")}
            />
          </FormControl>
          <FormDescription>
            The currency you want to sell your tokens for.
          </FormDescription>
        </FormItem>

        {/* listing price */}
        <FormItem>
          <FormLabel>
            {form.watch("listingType") === "auction"
              ? "Buyout Price Per Token"
              : "Listing Price"}
          </FormLabel>
          <FormControl>
            <Input {...form.register("pricePerToken")} className="bg-card" />
          </FormControl>
          <FormDescription>
            {form.watch("listingType") === "auction"
              ? "The price per token a buyer can pay to instantly buyout the auction."
              : "The price of each token you are listing for sale."}
          </FormDescription>
        </FormItem>

        {/* quantity */}
        {form.watch("selected")?.type?.toLowerCase() !== "erc721" && (
          <FormItem>
            <div className="flex flex-row justify-between gap-2">
              <FormLabel>Quantity</FormLabel>
            </div>
            <FormControl>
              <Input {...form.register("quantity")} className="bg-card" />
            </FormControl>
            <FormDescription>
              The number of tokens to list for sale.
            </FormDescription>
          </FormItem>
        )}

        {/* auction */}
        {form.watch("listingType") === "auction" && (
          <>
            <FormItem>
              <FormLabel>Reserve Price Per Token</FormLabel>
              <FormControl>
                <Input
                  {...form.register("reservePricePerToken")}
                  className="bg-card"
                />
              </FormControl>
              <FormDescription>
                The minimum price per token necessary to bid on this auction
              </FormDescription>
            </FormItem>
            <FormItem>
              <FormLabel>Auction Duration</FormLabel>
              <FormControl>
                <Select
                  onValueChange={(value) =>
                    form.setValue("listingDurationInSeconds", value)
                  }
                  value={form.watch("listingDurationInSeconds")?.toString()}
                >
                  <SelectTrigger className="bg-card">
                    <SelectValue placeholder="Select a duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {auctionTimes.map((time) => (
                      <SelectItem
                        key={time.value}
                        value={time.value.toString()}
                      >
                        {time.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>The duration of this auction.</FormDescription>
            </FormItem>
          </>
        )}

        {/* Need to pin these at the bottom because this is a very long form */}
        <div className="flex items-center justify-end gap-3">
          <Button
            disabled={isFormLoading}
            onClick={() => setOpen(false)}
            variant="outline"
          >
            Cancel
          </Button>
          <TransactionButton
            client={contract.client}
            isLoggedIn={isLoggedIn}
            isPending={isFormLoading}
            transactionCount={2}
            txChainID={contract.chain.id}
            type="submit"
          >
            {actionText}
          </TransactionButton>
        </div>
      </form>
    </Form>
  );
};
