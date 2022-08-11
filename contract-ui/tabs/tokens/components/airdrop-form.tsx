import {
  DrawerBody,
  DrawerHeader,
  Flex,
  Icon,
  Stack,
  useDisclosure,
  useModalContext,
} from "@chakra-ui/react";
import {
  TokenParams,
  WalletAddress,
  useAddress,
  useTransferBatchToken,
} from "@thirdweb-dev/react";
import { Amount, Erc20 } from "@thirdweb-dev/sdk";
import {
  AirdropAddressInput,
  AirdropUpload,
} from "components/batch-upload/AirdropUpload";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import React from "react";
import { useForm } from "react-hook-form";
import { BsCircleFill } from "react-icons/bs";
import { FiUpload } from "react-icons/fi";
import { Button, Heading, Text } from "tw-components";

interface TokenAirdropFormProps {
  contract: Erc20;
}

export const TokenAirdropForm: React.FC<TokenAirdropFormProps> = ({
  contract,
}) => {
  const address = useAddress();
  const { handleSubmit, setValue, watch } = useForm<{
    addresses: AirdropAddressInput[];
  }>({
    defaultValues: { addresses: [] },
  });
  const trackEvent = useTrack();
  const modalContext = useModalContext();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const airdrop = useTransferBatchToken(contract);

  const { onSuccess, onError } = useTxNotifications(
    "Airdrop successful",
    "Error transferring",
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
                contractAddress: contract?.getAddress(),
              });
              const params: TokenParams[] = data.addresses.map(
                (paramsData) => ({
                  to: paramsData.address as WalletAddress,
                  amount: paramsData.quantity as Amount,
                }),
              );

              airdrop.mutate(params, {
                onSuccess: () => {
                  onSuccess();
                  trackEvent({
                    category: "token",
                    action: "airdrop",
                    label: "success",
                    contract_address: contract?.getAddress(),
                  });
                  modalContext.onClose();
                },
                onError: (error) => {
                  trackEvent({
                    category: "token",
                    action: "airdrop",
                    label: "success",
                    contract_address: contract?.getAddress(),
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
                  setAirdrop={(value) => setValue(`addresses`, value)}
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
              <TransactionButton
                transactionCount={1}
                isLoading={airdrop.isLoading}
                type="submit"
                colorScheme="primary"
                disabled={!!address && addresses.length === 0}
                alignSelf="flex-end"
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
