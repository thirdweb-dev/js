"use client";

import { Flex, useDisclosure } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { UploadIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import type { ThirdwebContract } from "thirdweb";
import { multicall } from "thirdweb/extensions/common";
import { balanceOf, encodeSafeTransferFrom } from "thirdweb/extensions/erc1155";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { Button, Text } from "tw-components";
import { type AirdropAddressInput, AirdropUpload } from "./airdrop-upload";

interface AirdropTabProps {
  contract: ThirdwebContract;
  tokenId: string;
}

/**
 * This component must only take in ERC1155 contracts
 */
const AirdropTab: React.FC<AirdropTabProps> = ({ contract, tokenId }) => {
  const account = useActiveAccount();

  const address = useActiveAccount()?.address;
  const { handleSubmit, setValue, watch, reset, formState } = useForm<{
    addresses: AirdropAddressInput[];
  }>({
    defaultValues: { addresses: [] },
  });
  const trackEvent = useTrack();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { mutate, isPending } = useSendAndConfirmTransaction();

  const { onSuccess, onError } = useTxNotifications(
    "Airdrop successful",
    "Error transferring",
    contract,
  );

  const addresses = watch("addresses");

  return (
    <div className="flex w-full flex-col gap-2">
      <form
        onSubmit={handleSubmit(async (_data) => {
          trackEvent({
            category: "nft",
            action: "airdrop",
            label: "attempt",
            contract_address: contract.address,
            token_id: tokenId,
          });
          const totalOwned = await balanceOf({
            contract,
            tokenId: BigInt(tokenId),
            owner: account?.address ?? "",
          });
          // todo: make a batch-transfer extension for erc1155?
          const totalToAirdrop = _data.addresses.reduce((prev, curr) => {
            return BigInt(prev) + BigInt(curr?.quantity || 1);
          }, 0n);
          if (totalOwned < totalToAirdrop) {
            return onError(
              new Error(
                `The caller owns ${totalOwned.toString()} NFTs, but wants to airdrop ${totalToAirdrop.toString()} NFTs.`,
              ),
            );
          }
          const data = _data.addresses.map(({ address: to, quantity }) =>
            encodeSafeTransferFrom({
              from: account?.address ?? "",
              to,
              value: BigInt(quantity),
              data: "0x",
              tokenId: BigInt(tokenId),
            }),
          );
          const transaction = multicall({ contract, data });
          mutate(transaction, {
            onSuccess: () => {
              trackEvent({
                category: "nft",
                action: "airdrop",
                label: "success",
                contract_address: contract.address,
                token_id: tokenId,
              });
              onSuccess();
              reset();
            },
            onError: (error) => {
              trackEvent({
                category: "nft",
                action: "airdrop",
                label: "success",
                contract_address: contract.address,
                token_id: tokenId,
                error,
              });
              onError(error);
            },
          });
        })}
      >
        <div className="flex flex-col gap-2">
          <div className="mb-3 flex w-full flex-col gap-6 md:flex-row">
            <AirdropUpload
              isOpen={isOpen}
              onClose={onClose}
              setAirdrop={(value) =>
                setValue("addresses", value, { shouldDirty: true })
              }
            />
            <Flex direction={{ base: "column", md: "row" }} gap={4}>
              <Button
                colorScheme="primary"
                borderRadius="md"
                onClick={onOpen}
                rightIcon={<UploadIcon className="size-5" />}
              >
                Upload addresses
              </Button>

              <Flex
                gap={2}
                direction="row"
                align="center"
                justify="center"
                color={addresses.length === 0 ? "orange.500" : "green.500"}
              >
                {addresses.length > 0 && (
                  <Text size="body.sm" color="inherit">
                    ● <strong>{addresses.length} addresses</strong> ready to be
                    airdropped
                  </Text>
                )}
              </Flex>
            </Flex>
          </div>
          <Text>
            You can airdrop to a maximum of 250 addresses at a time. If you have
            more, please do it in multiple transactions.
          </Text>
          <TransactionButton
            txChainID={contract.chain.id}
            transactionCount={1}
            isLoading={isPending}
            type="submit"
            colorScheme="primary"
            disabled={!!address && addresses.length === 0}
            alignSelf="flex-end"
            isDisabled={!formState.isDirty}
          >
            Airdrop
          </TransactionButton>
        </div>
      </form>
    </div>
  );
};
export default AirdropTab;
