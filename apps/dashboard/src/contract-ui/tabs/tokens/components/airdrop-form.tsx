import {
  DrawerBody,
  DrawerHeader,
  Flex,
  Icon,
  Stack,
  useDisclosure,
  useModalContext,
} from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import {
  type AirdropAddressInput,
  AirdropUpload,
} from "contract-ui/tabs/nfts/components/airdrop-upload";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import { BsCircleFill } from "react-icons/bs";
import { FiUpload } from "react-icons/fi";
import type { ThirdwebContract } from "thirdweb";
import { transferBatch } from "thirdweb/extensions/erc20";
import { useActiveAccount, useSendAndConfirmTransaction } from "thirdweb/react";
import { Button, Heading, Text } from "tw-components";

interface TokenAirdropFormProps {
  contract: ThirdwebContract;
}

export const TokenAirdropForm: React.FC<TokenAirdropFormProps> = ({
  contract,
}) => {
  const address = useActiveAccount()?.address;
  const { handleSubmit, setValue, watch, formState } = useForm<{
    addresses: AirdropAddressInput[];
  }>({
    defaultValues: { addresses: [] },
  });
  const trackEvent = useTrack();
  const modalContext = useModalContext();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const sendTransaction = useSendAndConfirmTransaction();

  const { onSuccess, onError } = useTxNotifications(
    "Airdrop successful",
    "Error transferring",
    contract,
  );

  const addresses = watch("addresses");

  return (
    <>
      <DrawerHeader>
        <Heading>Airdrop tokens</Heading>
      </DrawerHeader>
      <DrawerBody>
        <Stack pt={3}>
          <form
            onSubmit={handleSubmit((data) => {
              trackEvent({
                category: "token",
                action: "airdrop",
                label: "attempt",
                contractAddress: contract.address,
              });

              const tx = transferBatch({
                contract,
                batch: data.addresses
                  .filter((address) => address.quantity !== undefined)
                  .map((address) => ({
                    to: address.address,
                    amount: address.quantity,
                  })),
              });

              sendTransaction.mutate(tx, {
                onSuccess: () => {
                  onSuccess();
                  trackEvent({
                    category: "token",
                    action: "airdrop",
                    label: "success",
                    contract_address: contract.address,
                  });
                  modalContext.onClose();
                },
                onError: (error) => {
                  trackEvent({
                    category: "token",
                    action: "airdrop",
                    label: "success",
                    contract_address: contract.address,
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
                          <strong>{addresses.length} addresses</strong> ready to
                          be airdropped
                        </Text>
                      </>
                    )}
                  </Flex>
                </Flex>
              </Stack>
              <Text>
                You can airdrop to a maximum of 250 addresses at a time. If you
                have more, please do it in multiple transactions.
              </Text>
              <TransactionButton
                transactionCount={1}
                isLoading={sendTransaction.isPending}
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
      </DrawerBody>
    </>
  );
};
