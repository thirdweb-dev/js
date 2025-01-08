import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import { useDashboardOwnedNFTs } from "@3rdweb-sdk/react/hooks/useDashboardOwnedNFTs";
import { useWalletNFTs } from "@3rdweb-sdk/react/hooks/useWalletNFTs";
import {
  Box,
  Flex,
  FormControl,
  Input,
  Select,
  Spinner,
  Tooltip,
} from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { CurrencySelector } from "components/shared/CurrencySelector";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { useTrack } from "hooks/analytics/useTrack";
import { useAllChainsData } from "hooks/chains/allChains";
import { useTxNotifications } from "hooks/useTxNotifications";
import { isAlchemySupported } from "lib/wallet/nfts/alchemy";
import { isMoralisSupported } from "lib/wallet/nfts/moralis";
import { useSimplehashSupport } from "lib/wallet/nfts/simpleHash";
import type { WalletNFT } from "lib/wallet/nfts/types";
import { CircleAlertIcon, InfoIcon } from "lucide-react";
import Link from "next/link";
import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  NATIVE_TOKEN_ADDRESS,
  type ThirdwebContract,
  getContract,
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
import { createAuction, createListing } from "thirdweb/extensions/marketplace";
import type {
  CreateAuctionParams,
  CreateListingParams,
} from "thirdweb/extensions/marketplace";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";
import { FormErrorMessage, FormHelperText, FormLabel } from "tw-components";
import { NFTMediaWithEmptyState } from "tw-components/nft-media";
import { shortenIfAddress } from "utils/usedapp-external";

const LIST_FORM_ID = "marketplace-list-form";

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
  twAccount: Account | undefined;
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
  twAccount,
  mode,
}) => {
  const trackEvent = useTrack();
  const chainId = contract.chain.id;
  const { idToChain } = useAllChainsData();
  const network = idToChain.get(chainId);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const simplehashQuery = useSimplehashSupport(contract.chain.id);
  const isSupportedChain =
    chainId &&
    (!!simplehashQuery.data ||
      isAlchemySupported(chainId) ||
      isMoralisSupported(chainId));

  const account = useActiveAccount();

  const { data: walletNFTs, isPending: isWalletNFTsLoading } = useWalletNFTs({
    chainId,
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
            selected: undefined,
            currencyContractAddress: NATIVE_TOKEN_ADDRESS,
            quantity: "1",
            pricePerToken: "0",
            listingType: "direct",
            startTimestamp: new Date(),
            // Default to one month duration
            listingDurationInSeconds: (60 * 60 * 24 * 30).toString(),
          }
        : {
            selected: undefined,
            currencyContractAddress: NATIVE_TOKEN_ADDRESS,
            quantity: "1",
            buyoutPricePerToken: "0",
            listingType: "auction",
            reservePricePerToken: "0",
            startTimestamp: new Date(),
            // Default to one month duration
            listingDurationInSeconds: (60 * 60 * 24 * 30).toString(),
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
      owner: account?.address,
      // Only run this hook as the last resort if this chain is not supported by the API services we are using
      disabled:
        !selectedContract ||
        isSupportedChain ||
        isWalletNFTsLoading ||
        (walletNFTs?.result || []).length > 0 ||
        mode === "manual",
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
          id: String(nft.id),
          metadata: nft.metadata,
          supply: "1",
          contractAddress: form.watch("selected.contractAddress"),
          tokenId: nft.id.toString(),
          owner: nft.owner,
          type: "ERC721",
          tokenURI: nft.tokenURI,
        };
      }
      return {
        id: String(nft.id),
        metadata: nft.metadata,
        supply: String(nft.supply),
        contractAddress: form.watch("selected.contractAddress"),
        tokenId: nft.id.toString(),
        owner: nft.owner,
        type: "ERC1155",
        tokenURI: nft.tokenURI,
      };
    }) as WalletNFT[];
  }, [ownedNFTs, form]);

  const nfts = ownedWalletNFTs || walletNFTs?.result;

  const noNfts = !nfts?.length;

  return (
    <form
      className="flex flex-col gap-6 pb-16"
      id={LIST_FORM_ID}
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
                tokenId: selectedTokenId,
                owner: account.address,
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
            nftType === "ERC1155" ? isApprovedForAll1155 : isApprovedForAll721;
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
              contract: _selectedContract,
              operator: contract.address,
              approved: true,
            });

            const promise = sendAndConfirmTx.mutateAsync(approveTx);
            toast.promise(promise, {
              loading: "Approving NFT for listing",
              success: "NFT approved succesfully",
              error: "Failed to approve NFT",
            });
            await promise;
          }

          if (formData.listingType === "direct") {
            // Hard code to 100 years for now
            const endTimestamp = new Date(
              new Date().setFullYear(new Date().getFullYear() + 100),
            );
            const transaction = createListing({
              contract,
              assetContractAddress: _selectedContract.address,
              tokenId: selectedTokenId,
              currencyContractAddress: formData.currencyContractAddress,
              quantity: selectedQuantity,
              startTimestamp: formData.startTimestamp,
              pricePerToken: String(formData.pricePerToken),
              endTimestamp,
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
              contract,
              assetContractAddress: _selectedContract.address,
              tokenId: selectedTokenId,
              startTimestamp: formData.startTimestamp,
              currencyContractAddress: formData.currencyContractAddress,
              endTimestamp: new Date(
                new Date().getTime() +
                  Number.parseInt(formData.listingDurationInSeconds) * 1000,
              ),
              minimumBidAmountWei: minimumBidAmountWei * selectedQuantity,
              buyoutBidAmountWei: buyoutBidAmountWei * selectedQuantity,
            });

            await sendAndConfirmTx.mutateAsync(transaction, {
              onSuccess: () => {
                trackEvent({
                  category: "marketplace",
                  action: "add-listing",
                  label: "success",
                  network,
                });
                setOpen(false);
              },
              onError: (error) => {
                trackEvent({
                  category: "marketplace",
                  action: "add-listing",
                  label: "error",
                  network,
                  error,
                });
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
      {mode === "manual" ? (
        <>
          <FormControl isRequired>
            <FormHelperText className="!mt-0 mb-5">
              Manually enter the contract address and token ID of the NFT you
              want to list for sale
            </FormHelperText>
            <FormLabel>NFT Contract Address</FormLabel>
            <Input {...form.register("assetContractAddress")} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Token ID</FormLabel>
            <Input {...form.register("tokenId")} />
          </FormControl>
        </>
      ) : (
        <>
          <FormControl>
            <FormHelperText className="!mt-0 mb-5">
              Select the NFT you want to list for sale
            </FormHelperText>
            {!isSupportedChain ? (
              <Flex flexDir="column" gap={4} mb={4}>
                <div className="flex flex-row items-center gap-3 rounded-md border border-border border-orange-100 bg-orange-50 p-[10px] dark:border-orange-300 dark:bg-orange-300">
                  <InfoIcon className="size-6 text-orange-400 dark:text-orange-900" />
                  <p className="text-orange-800 dark:text-orange-900">
                    This chain is not supported by our NFT API yet, please enter
                    the contract address of the NFT you want to list.
                  </p>
                </div>
                <FormControl
                  isInvalid={!!form.formState.errors.selected?.contractAddress}
                >
                  <FormLabel>Contract address</FormLabel>
                  <SolidityInput
                    solidityType="address"
                    formContext={form}
                    {...form.register("selected.contractAddress", {
                      required: "Contract address is required",
                    })}
                    placeholder="0x..."
                  />
                  <FormErrorMessage>
                    {form.formState.errors.selected?.contractAddress?.message}
                  </FormErrorMessage>
                  <FormHelperText>
                    This will display all the NFTs you own from this contract.
                  </FormHelperText>
                </FormControl>
              </Flex>
            ) : null}
            {isWalletNFTsLoading ||
            (isOwnedNFTsLoading &&
              !isSupportedChain &&
              form.watch("selected.contractAddress")) ? (
              <div className="flex h-[60px] items-center justify-center">
                <Spinner />
              </div>
            ) : nfts && nfts.length !== 0 ? (
              <Flex gap={2} flexWrap="wrap">
                {nfts?.map((nft) => {
                  return (
                    <Tooltip
                      bg="transparent"
                      boxShadow="none"
                      shouldWrapChildren
                      placement="left-end"
                      key={nft.contractAddress + nft.id}
                      label={
                        <Card className="p-4">
                          <ul>
                            <li>
                              <strong>Name:</strong>{" "}
                              {nft.metadata?.name || "N/A"}
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
                        </Card>
                      }
                    >
                      <Box
                        borderRadius="lg"
                        cursor="pointer"
                        onClick={() =>
                          isSelected(nft)
                            ? form.setValue("selected", undefined)
                            : form.setValue("selected", nft)
                        }
                        outline={isSelected(nft) ? "3px solid" : undefined}
                        outlineColor={
                          isSelected(nft) ? "purple.500" : undefined
                        }
                        overflow="hidden"
                      >
                        <NFTMediaWithEmptyState
                          metadata={nft.metadata}
                          width="140px"
                          height="140px"
                          requireInteraction
                        />
                      </Box>
                    </Tooltip>
                  );
                })}
              </Flex>
            ) : nfts && nfts.length === 0 ? (
              <div className="flex flex-row items-center gap-3 rounded-md border border-border border-orange-100 bg-orange-50 p-[10px] dark:border-orange-300 dark:bg-orange-300">
                <InfoIcon className="size-6 text-orange-400 dark:text-orange-900" />
                <p className="text-orange-800 dark:text-orange-900">
                  There are no NFTs owned by this wallet. You need NFTs to
                  create a listing. You can create NFTs with thirdweb.{" "}
                  <Link href="/explore/nft" color="blue.600" target="_blank">
                    Explore NFT contracts
                  </Link>
                  .
                </p>
              </div>
            ) : null}
          </FormControl>
        </>
      )}

      <FormControl isRequired isDisabled={mode === "automatic" && noNfts}>
        <FormLabel>Listing Currency</FormLabel>
        <CurrencySelector
          contractChainId={chainId}
          value={form.watch("currencyContractAddress")}
          onChange={(e) =>
            form.setValue("currencyContractAddress", e.target.value)
          }
        />
        <FormHelperText>
          The currency you want to sell your tokens for.
        </FormHelperText>
      </FormControl>
      <FormControl isRequired isDisabled={mode === "automatic" && noNfts}>
        <FormLabel>
          {form.watch("listingType") === "auction"
            ? "Buyout Price Per Token"
            : "Listing Price"}
        </FormLabel>
        <Input {...form.register("pricePerToken")} />
        <FormHelperText>
          {form.watch("listingType") === "auction"
            ? "The price per token a buyer can pay to instantly buyout the auction."
            : "The price of each token you are listing for sale."}
        </FormHelperText>
      </FormControl>
      {form.watch("selected")?.type?.toLowerCase() !== "erc721" && (
        <FormControl isRequired isDisabled={mode === "automatic" && noNfts}>
          <div className="flex flex-row justify-between gap-2">
            <FormLabel>Quantity</FormLabel>
          </div>
          <Input {...form.register("quantity")} />
          <FormHelperText>
            The number of tokens to list for sale.
          </FormHelperText>
        </FormControl>
      )}
      {form.watch("listingType") === "auction" && (
        <>
          <FormControl isRequired isDisabled={mode === "automatic" && noNfts}>
            <FormLabel>Reserve Price Per Token</FormLabel>
            <Input {...form.register("reservePricePerToken")} />
            <FormHelperText>
              The minimum price per token necessary to bid on this auction
            </FormHelperText>
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Auction Duration</FormLabel>
            <Select {...form.register("listingDurationInSeconds")}>
              {auctionTimes.map((time) => (
                <option key={time.value} value={time.value}>
                  {time.label}
                </option>
              ))}
            </Select>
            <FormHelperText>The duration of this auction.</FormHelperText>
          </FormControl>
        </>
      )}

      {mode === "automatic" && !form.watch("selected.id") && (
        <Alert>
          <CircleAlertIcon className="size-4" />
          <AlertTitle>No NFT selected</AlertTitle>
        </Alert>
      )}

      {/* Need to pin these at the bottom because this is a very long form */}
      <div className="fixed right-6 bottom-4 flex flex-row items-center justify-end gap-3">
        <Button
          disabled={isFormLoading}
          variant="default"
          onClick={() => setOpen(false)}
        >
          Cancel
        </Button>
        <TransactionButton
          twAccount={twAccount}
          txChainID={contract.chain.id}
          isPending={isFormLoading}
          transactionCount={2}
          form={LIST_FORM_ID}
          type="submit"
        >
          {actionText}
        </TransactionButton>
      </div>
    </form>
  );
};
