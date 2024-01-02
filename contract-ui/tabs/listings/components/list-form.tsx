import { useDashboardEVMChainId, useEVMContractInfo } from "@3rdweb-sdk/react";
import { useWalletNFTs } from "@3rdweb-sdk/react/hooks/useWalletNFTs";
import {
  Box,
  Center,
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
import {
  UseContractResult,
  useAddress,
  useContract,
  useContractType,
  useCreateAuctionListing,
  useCreateDirectListing,
  useOwnedNFTs,
} from "@thirdweb-dev/react";
import {
  Marketplace,
  MarketplaceV3,
  NATIVE_TOKEN_ADDRESS,
  NewAuctionListing,
  NewDirectListing,
} from "@thirdweb-dev/sdk";
import { CurrencySelector } from "components/shared/CurrencySelector";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { formatEther, parseEther } from "ethers/lib/utils";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { isAlchemySupported } from "lib/wallet/nfts/alchemy";
import { isMoralisSupported } from "lib/wallet/nfts/moralis";
import { WalletNFT } from "lib/wallet/nfts/types";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { FiInfo } from "react-icons/fi";
import {
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Link,
  Text,
} from "tw-components";
import { NFTMediaWithEmptyState } from "tw-components/nft-media";
import { ListLabel } from "./list-label";
import { isSimpleHashSupported } from "lib/wallet/nfts/simpleHash";

interface ListForm
  extends Omit<NewDirectListing, "type">,
    Omit<NewAuctionListing, "type"> {
  selected?: WalletNFT;
  contractAddress: string;
  tokenId: string;
  listingType: "direct" | "auction";
  listingDurationInSeconds: string;
  quantity: string;
}

type NFTMintForm = {
  contractQuery:
    | UseContractResult<Marketplace>
    | UseContractResult<MarketplaceV3>;
  directList: ReturnType<typeof useCreateDirectListing>;
  auctionList: ReturnType<typeof useCreateAuctionListing>;
  formId: string;
  type?: "direct-listings" | "english-auctions";
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

export const CreateListingsForm: React.FC<NFTMintForm> = ({
  contractQuery,
  directList,
  auctionList,
  formId,
  type,
}) => {
  const trackEvent = useTrack();
  const network = useEVMContractInfo()?.chain;
  const chainId = useDashboardEVMChainId();

  const isSupportedChain =
    chainId &&
    (isSimpleHashSupported(chainId) ||
      isAlchemySupported(chainId) ||
      isMoralisSupported(chainId));

  const { data: contractType } = useContractType(
    contractQuery?.contract?.getAddress(),
  );

  const { data: walletNFTs, isLoading: isWalletNFTsLoading } = useWalletNFTs();

  const form = useForm<ListForm>({
    defaultValues: {
      selected: undefined,
      contractAddress: "",
      tokenId: "",
      currencyContractAddress: NATIVE_TOKEN_ADDRESS,
      quantity: "1",
      buyoutPricePerToken: "0",
      listingType: type === "english-auctions" ? "auction" : "direct",
      reservePricePerToken: "0",
      startTimestamp: new Date(),
      // Default to one month duration
      listingDurationInSeconds: (60 * 60 * 24 * 30).toString(),
    },
  });

  const { contract } = useContract(form.watch("contractAddress"));
  const address = useAddress();
  const { data: ownedNFTs, isLoading: isOwnedNFTsLoading } = useOwnedNFTs(
    contract,
    address,
  );
  const isSelected = (nft: WalletNFT) => {
    return (
      form.watch("selected")?.tokenId === nft.tokenId &&
      form.watch("selected")?.contractAddress === nft.contractAddress
    );
  };

  const ownedWalletNFTs: WalletNFT[] = useMemo(() => {
    return ownedNFTs?.map((nft) => {
      return {
        ...nft,
        contractAddress: form.watch("contractAddress"),
        tokenId: nft.metadata.id,
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
      onSubmit={form.handleSubmit((formData) => {
        if (!formData.selected) {
          return;
        }
        if (formData.listingType === "direct") {
          directList.mutate(
            {
              assetContractAddress: formData.selected.contractAddress,
              tokenId: formData.selected.tokenId,
              currencyContractAddress: formData.currencyContractAddress,
              quantity: formData.quantity,
              startTimestamp: formData.startTimestamp,
              // Hard code to year 2100 for now
              pricePerToken: formData.buyoutPricePerToken,
              endTimestamp: new Date(4102444800000),

              // Marketplace v1 only params
              buyoutPricePerToken: formData.buyoutPricePerToken,
              // Hard code to 100 years for now
              listingDurationInSeconds: (60 * 60 * 24 * 365 * 100).toString(),
            },
            {
              onSuccess: () => {
                onSuccess();
                modalContext.onClose();
              },
              onError,
            },
          );
        } else if (formData.listingType === "auction") {
          auctionList.mutate(
            {
              assetContractAddress: formData.selected.contractAddress,
              tokenId: formData.selected.tokenId,
              quantity: formData.quantity,
              startTimestamp: formData.startTimestamp,
              currencyContractAddress: formData.currencyContractAddress,
              minimumBidAmount: mulDecimalByQuantity(
                formData.reservePricePerToken,
                formData.quantity,
              ),
              buyoutBidAmount: mulDecimalByQuantity(
                formData.buyoutPricePerToken,
                formData.quantity,
              ),
              // Create endTimestamp with the current date + listingDurationInSeconds
              endTimestamp: new Date(
                new Date().getTime() +
                  parseInt(formData.listingDurationInSeconds) * 1000,
              ),

              // Marketplace v1 only params
              reservePricePerToken: formData.reservePricePerToken,
              buyoutPricePerToken: formData.buyoutPricePerToken,
              listingDurationInSeconds: formData.listingDurationInSeconds,
            },
            {
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
            },
          );
        }
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
            <FormControl isInvalid={!!form.formState.errors.contractAddress}>
              <Heading as={FormLabel} size="label.lg">
                Contract address
              </Heading>
              <SolidityInput
                solidityType="address"
                formContext={form}
                {...form.register("contractAddress")}
                placeholder=""
              />
              <FormErrorMessage>
                {form.formState.errors.contractAddress?.message}
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
          form.watch("contractAddress")) ? (
          <Center height="60px">
            <Spinner />
          </Center>
        ) : nfts && nfts.length !== 0 ? (
          <Flex gap={2} flexWrap="wrap">
            {nfts?.map((nft, id) => {
              return (
                <Tooltip
                  bg="transparent"
                  boxShadow="none"
                  shouldWrapChildren
                  placement="left-end"
                  key={id}
                  label={<ListLabel nft={nft} />}
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
              <Link
                href="https://thirdweb.com/explore/nft"
                color="blue.600"
                isExternal
              >
                Explore NFT contracts
              </Link>
              .
            </Text>
          </Stack>
        ) : null}
      </FormControl>
      {contractType === "marketplace" ? (
        <FormControl isDisabled={noNfts}>
          <Heading as={FormLabel} size="label.lg">
            Listing Type
          </Heading>
          <Select {...form.register("listingType")}>
            <option value="direct">Direct</option>
            <option value="auction">Auction</option>
          </Select>
          <FormHelperText>
            The type of listing you want to create, either an auction or direct
            listing.
          </FormHelperText>
        </FormControl>
      ) : null}
      <FormControl isRequired isDisabled={noNfts}>
        <Heading as={FormLabel} size="label.lg">
          Listing Currency
        </Heading>
        <CurrencySelector
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
        <Input {...form.register("buyoutPricePerToken")} />
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
    </Stack>
  );
};
function mulDecimalByQuantity(a: string | number, b: string | number): string {
  if (!a || a.toString() === "0" || !b || b.toString() === "0") {
    return "0";
  }

  const aWei = parseEther(a.toString());
  const result = aWei.mul(b);

  return formatEther(result).toString();
}
