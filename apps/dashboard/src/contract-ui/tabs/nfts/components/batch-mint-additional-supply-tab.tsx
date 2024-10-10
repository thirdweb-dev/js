"use client";

import { Flex, useDisclosure } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import {
  type AirdropAddressInput,
  AirdropUpload,
} from "contract-ui/tabs/nfts/components/airdrop-upload";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { UploadIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import type { ThirdwebContract } from "thirdweb";
import { batchMintAdditionalSupplyTo } from "thirdweb/extensions/erc1155";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { Button, Text } from "tw-components";

export default function BatchMintAdditionalSupplyTab({
  contract,
  tokenId,
}: {
  contract: ThirdwebContract;
  tokenId: string;
}) {
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
    "Batch mint successful",
    "Error batch mint",
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
          const transaction = batchMintAdditionalSupplyTo({
            contract,
            tokenId: BigInt(tokenId),
            content: _data.addresses.map((item) => ({
              to: item.address,
              supply: BigInt(item.quantity),
            })),
          });
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
                    minted
                  </Text>
                )}
              </Flex>
            </Flex>
          </div>
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
            Batch mint
          </TransactionButton>
        </div>
      </form>
    </div>
  );
}
