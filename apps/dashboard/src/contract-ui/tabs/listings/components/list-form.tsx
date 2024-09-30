import { Alert, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { useDashboardOwnedNFTs } from "@3rdweb-sdk/react/hooks/useDashboardOwnedNFTs";
import { useWalletNFTs } from "@3rdweb-sdk/react/hooks/useWalletNFTs";
import {
  Box,
  Flex,
  FormControl,
  Icon,
  Input,
  Select,
  Spinner,
  Stack,
  Tooltip,
  useModalContext,
} from "@chakra-ui/react";
import { CurrencySelector } from "components/shared/CurrencySelector";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { isAlchemySupported } from "lib/wallet/nfts/alchemy";
import { isMoralisSupported } from "lib/wallet/nfts/moralis";
import { isSimpleHashSupported } from "lib/wallet/nfts/simpleHash";
import type { WalletNFT } from "lib/wallet/nfts/types";
import { CircleAlertIcon } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { FiInfo } from "react-icons/fi";
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
  setApprovalForAll as setApprovalForAll721,
} from "thirdweb/extensions/erc721";
import {
  isApprovedForAll as isApprovedForAll1155,
  setApprovalForAll as setApprovalForAll1155,
} from "thirdweb/extensions/erc1155";
import { createAuction, createListing } from "thirdweb/extensions/marketplace";
import type {
  CreateAuctionParams,
  CreateListingParams,
} from "thirdweb/extensions/marketplace";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import {
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Link,
  Text,
} from "tw-components";
import { NFTMediaWithEmptyState } from "tw-components/nft-media";
import { shortenIfAddress } from "utils/usedapp-external";

import { useAllChainsData } from "../../../../hooks/chains/allChains";

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
  formId: string;
  type?: "direct-listings" | "english-auctions";
  setIsFormLoading: (loading: boolean) => void;
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
  formId,
  type,
  setIsFormLoading,
}) => {
  const trackEvent = useTrack();
  const chainId = contract.chain.id;
  const { idToChain } = useAllChainsData();
  const network = idToChain.get(chainId);

  const isSupportedChain =
    chainId &&
    (isSimpleHashSupported(chainId) ||
      isAlchemySupported(chainId) ||
      isMoralisSupported(chainId));

  const account = useActiveAccount();

  const { data: walletNFTs, isPending: isWalletNFTsLoading } = useWalletNFTs({
    chainId,
    walletAddress: account?.address,
  });
  const sendAndConfirmTx = useSendAndConfirmTransaction();

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
        (walletNFTs?.result || []).length > 0,
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

  const modalContext = useModalContext();

  const { onSuccess, onError } = useTxNotifications(
    "NFT listed successfully",
    "Failed to list NFT",
  );

  return (
    <Stack
      spacing={6}
      as="form"
      id={formId}
      onSubmit={form.handleSubmit(async (formData) => {
        if (!formData.selected || !selectedContract) {
          return;
        }

        if (!account) {
          return toast.error("No account detected");
        }

        setIsFormLoading(true);

        try {
          const isNftApproved =
            formData.selected.type === "ERC1155"
              ? isApprovedForAll1155
              : isApprovedForAll721;
          const isApproved = await isNftApproved({
            contract: selectedContract,
            operator: contract.address,
            owner: account.address,
          });

          if (!isApproved) {
            const setNftApproval =
              formData.selected.type === "ERC1155"
                ? setApprovalForAll1155
                : setApprovalForAll721;
            const approveTx = setNftApproval({
              contract: selectedContract,
              operator: contract.address,
              approved: true,
            });

            try {
              await sendAndConfirmTx.mutateAsync(approveTx);
            } catch {
              setIsFormLoading(false);
              return toast.error("Failed to approve NFT for marketplace");
            }
          }

          if (formData.listingType === "direct") {
            // Hard code to 100 years for now
            const endTimestamp = new Date(
              new Date().setFullYear(new Date().getFullYear() + 100),
            );
            const transaction = createListing({
              contract,
              assetContractAddress: formData.selected.contractAddress,
              tokenId: BigInt(formData.selected.id),
              currencyContractAddress: formData.currencyContractAddress,
              quantity: BigInt(formData.quantity),
              startTimestamp: formData.startTimestamp,
              pricePerToken: String(formData.pricePerToken),
              endTimestamp,
            });
            await sendAndConfirmTx.mutateAsync(transaction, {
              onSuccess: () => {
                onSuccess();
                modalContext.onClose();
              },
              onError,
            });
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
              assetContractAddress: formData.selected.contractAddress,
              tokenId: BigInt(formData.selected.id),
              startTimestamp: formData.startTimestamp,
              currencyContractAddress: formData.currencyContractAddress,
              endTimestamp: new Date(
                new Date().getTime() +
                  Number.parseInt(formData.listingDurationInSeconds) * 1000,
              ),
              minimumBidAmountWei:
                minimumBidAmountWei * BigInt(formData.quantity),
              buyoutBidAmountWei:
                buyoutBidAmountWei * BigInt(formData.quantity),
            });

            await sendAndConfirmTx.mutateAsync(transaction, {
              onSuccess: () => {
                onSuccess();
                trackEvent({
                  category: "marketplace",
                  action: "add-listing",
                  label: "success",
                  network,
                });
                modalContext.onClose();
              },
              onError: (error) => {
                trackEvent({
                  category: "marketplace",
                  action: "add-listing",
                  label: "error",
                  network,
                  error,
                });
                onError(error);
              },
            });
          }
        } catch {
          toast.error("Failed to list NFT");
        }

        setIsFormLoading(false);
      })}
    >
      <FormControl>
        <Heading as={FormLabel} size="label.lg">
          Select NFT
        </Heading>
        <FormHelperText mb="8px">
          Select the NFT you want to list for sale
        </FormHelperText>
        {!isSupportedChain ? (
          <Flex flexDir="column" gap={4} mb={4}>
            <Stack
              direction="row"
              bg="orange.50"
              borderRadius="md"
              borderWidth="1px"
              borderColor="orange.100"
              align="center"
              padding="10px"
              spacing={3}
              _dark={{
                bg: "orange.300",
                borderColor: "orange.300",
              }}
            >
              <Icon
                as={FiInfo}
                color="orange.400"
                _dark={{ color: "orange.900" }}
                boxSize={6}
              />
              <Text color="orange.800" _dark={{ color: "orange.900" }}>
                This chain is not supported by our NFT API yet, please enter the
                contract address of the NFT you want to list.
              </Text>
            </Stack>
            <FormControl
              isInvalid={!!form.formState.errors.selected?.contractAddress}
            >
              <Heading as={FormLabel} size="label.lg">
                Contract address
              </Heading>
              <SolidityInput
                solidityType="address"
                formContext={form}
                {...form.register("selected.contractAddress", {
                  required: "Contract address is required",
                })}
                placeholder=""
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
                    outlineColor={isSelected(nft) ? "purple.500" : undefined}
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
          <Stack
            direction="row"
            bg="orange.50"
            borderRadius="md"
            borderWidth="1px"
            borderColor="orange.100"
            align="center"
            padding="10px"
            spacing={3}
            _dark={{
              bg: "orange.300",
              borderColor: "orange.300",
            }}
          >
            <Icon
              as={FiInfo}
              color="orange.400"
              _dark={{ color: "orange.900" }}
              boxSize={6}
            />
            <Text color="orange.800" _dark={{ color: "orange.900" }}>
              There are no NFTs owned by this wallet. You need NFTs to create a
              listing. You can create NFTs with thirdweb.{" "}
              <Link href="/explore/nft" color="blue.600" isExternal>
                Explore NFT contracts
              </Link>
              .
            </Text>
          </Stack>
        ) : null}
      </FormControl>
      <FormControl isRequired isDisabled={noNfts}>
        <Heading as={FormLabel} size="label.lg">
          Listing Currency
        </Heading>
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
      <FormControl isRequired isDisabled={noNfts}>
        <Heading as={FormLabel} size="label.lg">
          {form.watch("listingType") === "auction"
            ? "Buyout Price Per Token"
            : "Listing Price"}
        </Heading>
        <Input {...form.register("pricePerToken")} />
        <FormHelperText>
          {form.watch("listingType") === "auction"
            ? "The price per token a buyer can pay to instantly buyout the auction."
            : "The price of each token you are listing for sale."}
        </FormHelperText>
      </FormControl>
      {form.watch("selected")?.type?.toLowerCase() !== "erc721" && (
        <FormControl isRequired isDisabled={noNfts}>
          <Stack justify="space-between" direction="row">
            <Heading as={FormLabel} size="label.lg">
              Quantity
            </Heading>
          </Stack>
          <Input {...form.register("quantity")} />
          <FormHelperText>
            The number of tokens to list for sale.
          </FormHelperText>
        </FormControl>
      )}
      {form.watch("listingType") === "auction" && (
        <>
          <FormControl isRequired isDisabled={noNfts}>
            <Heading as={FormLabel} size="label.lg">
              Reserve Price Per Token
            </Heading>
            <Input {...form.register("reservePricePerToken")} />
            <FormHelperText>
              The minimum price per token necessary to bid on this auction
            </FormHelperText>
          </FormControl>
          <FormControl isRequired>
            <Heading as={FormLabel} size="label.lg">
              Auction Duration
            </Heading>
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

      {!form.watch("selected.id") && (
        <Alert>
          <CircleAlertIcon className="size-4" />
          <AlertTitle>No NFT selected</AlertTitle>
        </Alert>
      )}
    </Stack>
  );
};
