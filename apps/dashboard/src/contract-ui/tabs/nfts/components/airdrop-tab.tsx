import { Flex, Icon, Stack, useDisclosure } from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import {
  type AirdropAddressInput,
  AirdropUpload,
} from "contract-ui/tabs/nfts/components/airdrop-upload";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { thirdwebClient } from "lib/thirdweb-client";
import { useV5DashboardChain } from "lib/v5-adapter";
import { useForm } from "react-hook-form";
import { BsCircleFill } from "react-icons/bs";
import { FiUpload } from "react-icons/fi";
import { getContract } from "thirdweb";
import { multicall } from "thirdweb/extensions/common";
import { balanceOf, encodeSafeTransferFrom } from "thirdweb/extensions/erc1155";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { Button, Text } from "tw-components";

interface AirdropTabProps {
  contractAddress: string;
  tokenId: string;
  chainId: number;
}

/**
 * This component must only take in ERC1155 contracts
 */
const AirdropTab: React.FC<AirdropTabProps> = ({
  contractAddress,
  tokenId,
  chainId,
}) => {
  const account = useActiveAccount();
  const chain = useV5DashboardChain(chainId);
  const contract = getContract({
    address: contractAddress,
    chain: chain,
    client: thirdwebClient,
  });
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
    <Stack w="full">
      <form
        onSubmit={handleSubmit(async (_data) => {
          trackEvent({
            category: "nft",
            action: "airdrop",
            label: "attempt",
            contractAddress,
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
                contract_address: contractAddress,
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
                contract_address: contractAddress,
                token_id: tokenId,
                error,
              });
              onError(error);
            },
          });
        })}
      >
        <Stack>
          <Stack
            spacing={6}
            w="100%"
            direction={{ base: "column", md: "row" }}
            mb={3}
          >
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
                rightIcon={<Icon as={FiUpload} />}
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
                  <>
                    <Icon as={BsCircleFill} boxSize={2} />
                    <Text size="body.sm" color="inherit">
                      <strong>{addresses.length} addresses</strong> ready to be
                      airdropped
                    </Text>
                  </>
                )}
              </Flex>
            </Flex>
          </Stack>
          <Text>
            You can airdrop to a maximum of 250 addresses at a time. If you have
            more, please do it in multiple transactions.
          </Text>
          <TransactionButton
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
        </Stack>
      </form>
    </Stack>
  );
};
export default AirdropTab;
