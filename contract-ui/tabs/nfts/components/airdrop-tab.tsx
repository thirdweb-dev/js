import { Flex, Icon, Stack, useDisclosure } from "@chakra-ui/react";
import { useAddress, useAirdropNFT } from "@thirdweb-dev/react";
import { Erc1155 } from "@thirdweb-dev/sdk";
import { TransactionButton } from "components/buttons/TransactionButton";
import {
  AirdropAddressInput,
  AirdropUpload,
} from "contract-ui/tabs/nfts/components/airdrop-upload";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import { BsCircleFill } from "react-icons/bs";
import { FiUpload } from "react-icons/fi";
import { Button, Text } from "tw-components";

interface AirdropTabProps {
  contract: Erc1155;
  tokenId: string;
}

const AirdropTab: React.FC<AirdropTabProps> = ({ contract, tokenId }) => {
  const address = useAddress();
  const { handleSubmit, setValue, watch, reset, formState } = useForm<{
    addresses: AirdropAddressInput[];
  }>({
    defaultValues: { addresses: [] },
  });
  const trackEvent = useTrack();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const airdrop = useAirdropNFT(contract);

  const { onSuccess, onError } = useTxNotifications(
    "Airdrop successful",
    "Error transferring",
  );

  const addresses = watch("addresses");

  return (
    <Stack w="full">
      <form
        onSubmit={handleSubmit((data) => {
          trackEvent({
            category: "nft",
            action: "airdrop",
            label: "attempt",
            contractAddress: contract?.getAddress(),
            token_id: tokenId,
          });
          airdrop.mutate(
            {
              tokenId,
              addresses: data.addresses,
            },
            {
              onSuccess: () => {
                trackEvent({
                  category: "nft",
                  action: "airdrop",
                  label: "success",
                  contract_address: contract?.getAddress(),
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
                  contract_address: contract?.getAddress(),
                  token_id: tokenId,
                  error,
                });
                onError(error);
              },
            },
          );
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
                setValue(`addresses`, value, { shouldDirty: true })
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
            isLoading={airdrop.isLoading}
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
