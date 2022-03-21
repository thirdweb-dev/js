import {
  useActiveChainId,
  useMarketplaceAuctionListMutation,
  useMarketplaceDirectListMutation,
} from "@3rdweb-sdk/react";
import {
  WalletNftData,
  useWalletNFTs,
} from "@3rdweb-sdk/react/hooks/useAlchemy";
import {
  Center,
  DrawerBody,
  DrawerFooter,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Icon,
  Image,
  Input,
  List,
  ListItem,
  Select,
  Spinner,
  Stack,
  Text,
  Tooltip,
  useModalContext,
} from "@chakra-ui/react";
import { Marketplace, NATIVE_TOKEN_ADDRESS } from "@thirdweb-dev/sdk";
import { Button } from "components/buttons/Button";
import { TransactionButton } from "components/buttons/TransactionButton";
import { CurrencySelector } from "components/shared/CurrencySelector";
import { useTxNotifications } from "hooks/useTxNotifications";
import React from "react";
import { useForm } from "react-hook-form";
import { FaImage } from "react-icons/fa";
import { ChainId, SUPPORTED_CHAIN_ID } from "utils/network";
import { shortenIfAddress } from "utils/usedapp-external";

const LIST_FORM_ID = "marketplace-list-form";
interface IMarketplaceListForm {
  contract: Marketplace;
}

interface ListForm {
  selected?: WalletNftData;
  quantity: string;
  buyoutPricePerToken: string;
  currencyContractAddress: string;
  listingType: "direct" | "auction";
  reservePricePerToken: string;
  startTimeInSeconds: string;
  listingDurationInSeconds: string;
}

export const MarketplaceListForm: React.FC<IMarketplaceListForm> = ({
  contract,
}) => {
  const { data: nfts, isLoading: nftsLoading } = useWalletNFTs();
  const modalContext = useModalContext();
  const { onSuccess, onError } = useTxNotifications(
    "Succesfully created listing",
    "Error creating listing",
  );
  const directList = useMarketplaceDirectListMutation(contract.getAddress());
  const auctionList = useMarketplaceAuctionListMutation(contract.getAddress());
  const { watch, register, setValue, handleSubmit } = useForm<ListForm>({
    defaultValues: {
      selected: undefined,
      currencyContractAddress: NATIVE_TOKEN_ADDRESS,
      quantity: "1",
      buyoutPricePerToken: "0",
      listingType: "direct",
      reservePricePerToken: "0",
      startTimeInSeconds: "0",
      listingDurationInSeconds: (60 * 60 * 24).toString(),
    },
  });

  const isSelected = (nft: WalletNftData) => {
    return (
      watch("selected")?.tokenId === nft.tokenId &&
      watch("selected")?.contractAddress === nft.contractAddress
    );
  };

  const onSubmit = (data: any) => {
    const {
      selected,
      currencyContractAddress,
      quantity,
      buyoutPricePerToken,
      listingType,
      listingDurationInSeconds,
      startTimeInSeconds,
      reservePricePerToken,
    } = data;

    if (listingType === "direct") {
      directList.mutate(
        {
          tokenId: selected?.tokenId,
          assetContractAddress: selected?.contractAddress,
          currencyContractAddress,
          buyoutPricePerToken,
          quantity,
          startTimeInSeconds,
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
    } else {
      auctionList.mutate(
        {
          tokenId: selected?.tokenId,
          assetContractAddress: selected?.contractAddress,
          currencyContractAddress,
          buyoutPricePerToken,
          quantity,
          startTimeInSeconds,
          listingDurationInSeconds,
          reservePricePerToken,
        },
        {
          onSuccess: () => {
            onSuccess();
            modalContext.onClose();
          },
          onError,
        },
      );
    }
  };

  return (
    <>
      <DrawerBody>
        <Stack
          spacing={6}
          as="form"
          id={LIST_FORM_ID}
          onSubmit={handleSubmit(onSubmit)}
        >
          <FormControl>
            <Heading as={FormLabel} size="label.lg">
              Select NFT
            </Heading>
            <FormHelperText mb="8px">
              Select the NFTs you want to list for sale
            </FormHelperText>
            {nftsLoading ? (
              <Center height="60px">
                <Spinner />
              </Center>
            ) : nfts?.length ? (
              <Flex gap={2} flexWrap="wrap">
                {nfts.map((nft, id) => {
                  if (nft.image) {
                    return (
                      <Tooltip
                        key={id}
                        label={
                          <List>
                            <ListItem>
                              <strong>Name:</strong>{" "}
                              {nft.metadata?.name || "N/A"}
                            </ListItem>
                            <ListItem>
                              <strong>Contract Address:</strong>{" "}
                              {shortenIfAddress(nft.contractAddress)}
                            </ListItem>
                            <ListItem>
                              <strong>Token ID: </strong> {nft.tokenId}
                            </ListItem>
                            <ListItem>
                              <strong>Token Standard: </strong> {nft.tokenType}
                            </ListItem>
                          </List>
                        }
                      >
                        <Image
                          src={nft.image}
                          width="140px"
                          height="140px"
                          alt={nft.metadata?.name || ""}
                          borderRadius="md"
                          cursor="pointer"
                          onClick={() =>
                            isSelected(nft)
                              ? setValue("selected", undefined)
                              : setValue("selected", nft)
                          }
                          border={isSelected(nft) ? "5px solid" : undefined}
                          borderColor={
                            isSelected(nft) ? "purple.500" : undefined
                          }
                        />
                      </Tooltip>
                    );
                  }

                  if (nft.metadata && nft.metadata.name) {
                    return (
                      <Tooltip
                        key={id}
                        label={
                          <List>
                            <ListItem>
                              <strong>Name:</strong>{" "}
                              {nft.metadata?.name || "N/A"}
                            </ListItem>
                            <ListItem>
                              <strong>Contract Address:</strong>{" "}
                              {shortenIfAddress(nft.contractAddress)}
                            </ListItem>
                            <ListItem>
                              <strong>Token ID: </strong> {nft.tokenId}
                            </ListItem>
                            <ListItem>
                              <strong>Token Standard: </strong> {nft.tokenType}
                            </ListItem>
                          </List>
                        }
                      >
                        <Center
                          flexDirection="column"
                          width="140px"
                          height="140px"
                          borderRadius="md"
                          cursor="pointer"
                          onClick={() =>
                            isSelected(nft)
                              ? setValue("selected", undefined)
                              : setValue("selected", nft)
                          }
                          border={isSelected(nft) ? "5px solid" : undefined}
                          borderColor={
                            isSelected(nft) ? "purple.500" : undefined
                          }
                          bg="gray.200"
                        >
                          <Text>{nft.metadata?.name}</Text>
                        </Center>
                      </Tooltip>
                    );
                  }

                  return (
                    <Tooltip
                      key={id}
                      label={
                        <List>
                          <ListItem>
                            <strong>Name:</strong> {nft.metadata?.name || "N/A"}
                          </ListItem>
                          <ListItem>
                            <strong>Contract Address:</strong>{" "}
                            {shortenIfAddress(nft.contractAddress)}
                          </ListItem>
                          <ListItem>
                            <strong>Token ID: </strong> {nft.tokenId}
                          </ListItem>
                          <ListItem>
                            <strong>Token Standard: </strong> {nft.tokenType}
                          </ListItem>
                        </List>
                      }
                    >
                      <Center
                        flexDirection="column"
                        width="140px"
                        height="140px"
                        borderRadius="md"
                        cursor="pointer"
                        onClick={() =>
                          isSelected(nft)
                            ? setValue("selected", undefined)
                            : setValue("selected", nft)
                        }
                        border={isSelected(nft) ? "5px solid" : undefined}
                        borderColor={isSelected(nft) ? "purple.500" : undefined}
                        bg="gray.200"
                      >
                        <Icon as={FaImage} boxSize={3} />
                      </Center>
                    </Tooltip>
                  );
                })}
              </Flex>
            ) : (
              <Center height="60px">
                <Text>There are no NFTs owned by this wallet</Text>
              </Center>
            )}
          </FormControl>
          <FormControl>
            <Heading as={FormLabel} size="label.lg">
              Listing Type
            </Heading>
            <Select {...register("listingType")}>
              <option value="direct">Direct</option>
              <option value="auction">Auction</option>
            </Select>
            <FormHelperText>
              The type of listing you want to create, either an auction or
              direct listing.
            </FormHelperText>
          </FormControl>
          <FormControl isRequired>
            <Heading as={FormLabel} size="label.lg">
              Listing Currency
            </Heading>
            <CurrencySelector
              value={watch("currencyContractAddress")}
              onChange={(e) =>
                setValue("currencyContractAddress", e.target.value)
              }
            />
            <FormHelperText>
              The currency you want to sell your tokens for.
            </FormHelperText>
          </FormControl>
          <FormControl isRequired>
            <Heading as={FormLabel} size="label.lg">
              {watch("listingType") === "auction"
                ? "Buyout Price Per Token"
                : "Listing Price"}
            </Heading>
            <Input {...register("buyoutPricePerToken")} />
            <FormHelperText>
              {watch("listingType") === "auction"
                ? "The price per token a buyer can pay to instantly buyout the auction."
                : "The price of each token you are listing for sale."}
            </FormHelperText>
          </FormControl>
          {watch("selected")?.tokenType.toLowerCase() !== "erc721" && (
            <FormControl isRequired>
              <Stack justify="space-between" direction="row">
                <Heading as={FormLabel} size="label.lg">
                  Quantity
                </Heading>
                {/* {watch("selected") && (
                  <Text
                    color="blue.400"
                    cursor="pointer"
                    _hover={{ textDecor: "underline" }}
                  >
                    Max
                  </Text>
                )} */}
              </Stack>
              <Input {...register("quantity")} />
              <FormHelperText>
                The number of tokens to list for sale.
              </FormHelperText>
            </FormControl>
          )}
          {watch("listingType") === "auction" && (
            <>
              <FormControl isRequired>
                <Heading as={FormLabel} size="label.lg">
                  Reserve Price Per Token
                </Heading>
                <Input {...register("reservePricePerToken")} />
                <FormHelperText>
                  The minimum price per token necessary to bid on this auction
                </FormHelperText>
              </FormControl>
              <FormControl isRequired>
                <Heading as={FormLabel} size="label.lg">
                  Auction Duration (Seconds)
                </Heading>
                <Input {...register("listingDurationInSeconds")} />
                <FormHelperText>
                  The duration of this auction in seconds (86400 is one day)
                </FormHelperText>
              </FormControl>
            </>
          )}
        </Stack>
      </DrawerBody>
      <DrawerFooter>
        <Button
          isDisabled={directList.isLoading || auctionList.isLoading}
          variant="outline"
          mr={3}
          onClick={modalContext.onClose}
        >
          Cancel
        </Button>
        <TransactionButton
          borderRadius="full"
          isLoading={directList.isLoading || auctionList.isLoading}
          isDisabled={!watch("selected")}
          transactionCount={2}
          form={LIST_FORM_ID}
          type="submit"
          colorScheme="primary"
        >
          Create Listing
        </TransactionButton>
      </DrawerFooter>
    </>
  );
};
