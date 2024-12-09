"use client";

import { Button } from "@/components/ui/button";
import { FormControl, Input, Select } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { CurrencySelector } from "components/shared/CurrencySelector";
import { useTrack } from "hooks/analytics/useTrack";
import { useAllChainsData } from "hooks/chains/allChains";
import { type Dispatch, type SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { NATIVE_TOKEN_ADDRESS, getContract, toUnits, toWei } from "thirdweb";
import type { ThirdwebContract } from "thirdweb/contract";
import { decimals } from "thirdweb/extensions/erc20";
import { isERC721, ownerOf } from "thirdweb/extensions/erc721";
import {
  isApprovedForAll as isApprovedForAll721,
  setApprovalForAll as setApprovalForAll721,
} from "thirdweb/extensions/erc721";
import { balanceOf, isERC1155 } from "thirdweb/extensions/erc1155";
import {
  isApprovedForAll as isApprovedForAll1155,
  setApprovalForAll as setApprovalForAll1155,
} from "thirdweb/extensions/erc1155";
import {
  type CreateAuctionParams,
  type CreateListingParams,
  createAuction,
  createListing,
} from "thirdweb/extensions/marketplace";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { shortenAddress } from "thirdweb/utils";
import { FormHelperText, FormLabel } from "tw-components";
import { auctionTimes } from "./list-form-shared";

type CreateListingsFormProps = {
  contract: ThirdwebContract;
  actionText: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
  type?: "direct-listings" | "english-auctions";
};

type ListFormManual =
  | (Omit<
      CreateListingParams,
      "quantity" | "currencyContractAddress" | "tokenId"
    > & {
      currencyContractAddress: string;
      tokenId: string;
      listingType: "direct";
      listingDurationInSeconds: string;
      quantity: string;
      pricePerToken: string;
    })
  | (Omit<
      CreateAuctionParams,
      "quantity" | "currencyContractAddress" | "tokenId"
    > & {
      currencyContractAddress: string;
      tokenId: string;
      listingType: "auction";
      listingDurationInSeconds: string;
      quantity: string;
      buyoutPricePerToken: string;
      reservePricePerToken: string;
    });

/**
 * Same functionality as list-form.tsx but this one allows users to specify tokenId and the contractAddress
 */
export function ListFormManual(props: CreateListingsFormProps) {
  const trackEvent = useTrack();
  const account = useActiveAccount();
  const sendAndConfirmTx = useSendAndConfirmTransaction();
  const { idToChain } = useAllChainsData();
  const network = idToChain.get(props.contract.chain.id);
  const [isFormLoading, setIsFormLoading] = useState(false);

  const form = useForm<ListFormManual>({
    defaultValues:
      props.type === "direct-listings"
        ? {
            currencyContractAddress: NATIVE_TOKEN_ADDRESS,
            quantity: "1",
            pricePerToken: "0",
            listingType: "direct",
            startTimestamp: new Date(),
            listingDurationInSeconds: (60 * 60 * 24 * 30).toString(),
          }
        : {
            currencyContractAddress: NATIVE_TOKEN_ADDRESS,
            quantity: "1",
            buyoutPricePerToken: "0",
            listingType: "auction",
            reservePricePerToken: "0",
            startTimestamp: new Date(),
            listingDurationInSeconds: (60 * 60 * 24 * 30).toString(),
          },
  });

  return (
    <form
      className="flex flex-col gap-6 pb-16"
      id="marketplace-list-form-manual"
      onSubmit={form.handleSubmit(async (data) => {
        try {
          if (!account) {
            return toast.error("No account detected");
          }
          setIsFormLoading(true);
          const nftContract = getContract({
            address: data.assetContractAddress,
            chain: props.contract.chain,
            client: props.contract.client,
          });
          const [is721, is1155] = await Promise.all([
            isERC721({ contract: nftContract }),
            isERC1155({ contract: nftContract }),
          ]);
          if (!is721 && !is1155) {
            setIsFormLoading(false);
            return toast.error(
              `Error: ${data.assetContractAddress} is neither an ERC721 or ERC1155 contract`,
            );
          }
          const nftType = is721 ? "ERC721" : "ERC1155";
          // Make sure the account owns the tokenId
          if (nftType === "ERC1155") {
            const balance = await balanceOf({
              contract: nftContract,
              tokenId: BigInt(data.tokenId),
              owner: account.address,
            });
            if (balance === 0n) {
              setIsFormLoading(false);
              return toast.error(
                `You do not own any tokenId #${data.tokenId} from the collection: ${shortenAddress(data.assetContractAddress)}`,
              );
            }
            if (balance < BigInt(data.quantity)) {
              setIsFormLoading(false);
              return toast.error(
                `The balance you own for tokenId #${data.tokenId} is less than the quantity (you own ${balance.toString()})`,
              );
            }
          } else {
            const owner = await ownerOf({
              contract: nftContract,
              tokenId: BigInt(data.tokenId),
            }).catch(() => undefined);
            if (owner?.toLowerCase() !== account.address.toLowerCase()) {
              setIsFormLoading(false);
              return toast.error(
                `You do not own the tokenId #${data.tokenId} from the collection: ${shortenAddress(data.assetContractAddress)}`,
              );
            }
          }

          const isNftApproved =
            nftType === "ERC1155" ? isApprovedForAll1155 : isApprovedForAll721;
          const isApproved = await isNftApproved({
            contract: nftContract,
            operator: props.contract.address,
            owner: account.address,
          });

          if (nftType === "ERC721" && data.quantity !== "1") {
            setIsFormLoading(false);
            return toast.error(
              "Error: Quantity should be `1` for ERC721 tokens",
            );
          }

          if (!isApproved) {
            const setNftApproval =
              nftType === "ERC1155"
                ? setApprovalForAll1155
                : setApprovalForAll721;
            const approveTx = setNftApproval({
              contract: nftContract,
              operator: props.contract.address,
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
          if (data.listingType === "direct") {
            const endTimestamp = new Date(
              new Date().setFullYear(new Date().getFullYear() + 100),
            );
            const transaction = createListing({
              contract: props.contract,
              assetContractAddress: data.assetContractAddress,
              tokenId: BigInt(data.tokenId),
              currencyContractAddress: data.currencyContractAddress,
              quantity: BigInt(data.quantity),
              startTimestamp: data.startTimestamp,
              pricePerToken: String(data.pricePerToken),
              endTimestamp,
            });

            const promise = sendAndConfirmTx.mutateAsync(transaction, {
              onSuccess: () => props.setOpen(false),
              onError: (err) => console.error(err),
            });
            toast.promise(promise, {
              loading: "Listing NFT",
              success: "NFT listed successfully",
              error: "Failed to list NFT",
            });
          } else if (data.listingType === "auction") {
            let minimumBidAmountWei: bigint;
            let buyoutBidAmountWei: bigint;
            if (
              data.currencyContractAddress.toLowerCase() ===
              NATIVE_TOKEN_ADDRESS.toLocaleLowerCase()
            ) {
              minimumBidAmountWei = toWei(data.reservePricePerToken.toString());
              buyoutBidAmountWei = toWei(data.buyoutPricePerToken.toString());
            } else {
              const tokenContract = getContract({
                address: data.currencyContractAddress,
                chain: props.contract.chain,
                client: props.contract.client,
              });
              const _decimals = await decimals({ contract: tokenContract });
              minimumBidAmountWei = toUnits(
                data.reservePricePerToken.toString(),
                _decimals,
              );
              buyoutBidAmountWei = toUnits(
                data.buyoutPricePerToken.toString(),
                _decimals,
              );
            }

            const transaction = createAuction({
              contract: props.contract,
              assetContractAddress: data.assetContractAddress,
              tokenId: BigInt(data.tokenId),
              startTimestamp: data.startTimestamp,
              currencyContractAddress: data.currencyContractAddress,
              endTimestamp: new Date(
                new Date().getTime() +
                  Number.parseInt(data.listingDurationInSeconds) * 1000,
              ),
              minimumBidAmountWei: minimumBidAmountWei * BigInt(data.quantity),
              buyoutBidAmountWei: buyoutBidAmountWei * BigInt(data.quantity),
            });

            const promise = sendAndConfirmTx.mutateAsync(transaction, {
              onSuccess: () => {
                trackEvent({
                  category: "marketplace",
                  action: "add-listing",
                  label: "success",
                  network,
                });
                props.setOpen(false);
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
            toast.promise(promise, {
              loading: "Creating auction",
              success: "Auction created successfully",
              error: "Failed to create auction",
            });
          }
        } catch (err) {
          console.error(err);
          toast.error(
            `Failed to ${props.type === "direct-listings" ? "create listing" : "create auction"}`,
          );
        }
        setIsFormLoading(false);
      })}
    >
      <FormControl isRequired>
        <FormLabel>NFT Contract Address</FormLabel>
        <Input {...form.register("assetContractAddress")} />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Token ID</FormLabel>
        <Input {...form.register("tokenId")} />
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Listing Currency</FormLabel>
        <CurrencySelector
          contractChainId={props.contract.chain.id}
          value={form.watch("currencyContractAddress")}
          onChange={(e) =>
            form.setValue("currencyContractAddress", e.target.value)
          }
        />
        <FormHelperText>
          The currency you want to sell your tokens for.
        </FormHelperText>
      </FormControl>
      <FormControl isRequired>
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
      <FormControl isRequired>
        <div className="flex flex-row justify-between gap-2">
          <FormLabel>Quantity</FormLabel>
        </div>
        <Input {...form.register("quantity")} />
        <FormHelperText>The number of tokens to list for sale.</FormHelperText>
      </FormControl>
      {form.watch("listingType") === "auction" && (
        <>
          <FormControl isRequired>
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

      <div className="flex flex-row items-center justify-end gap-3">
        <Button
          disabled={isFormLoading}
          variant="default"
          onClick={() => props.setOpen(false)}
        >
          Cancel
        </Button>
        <TransactionButton
          txChainID={props.contract.chain.id}
          isPending={isFormLoading}
          transactionCount={2}
          form="marketplace-list-form-manual"
          type="submit"
        >
          {props.actionText}
        </TransactionButton>
      </div>
    </form>
  );
}
