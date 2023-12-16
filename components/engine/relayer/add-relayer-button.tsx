import {
  CreateRelayerInput,
  useEngineBackendWallets,
  useEngineCreateRelayer,
} from "@3rdweb-sdk/react/hooks/useEngine";
import {
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Icon,
  FormControl,
  Input,
  Select,
  UseDisclosureReturn,
  Textarea,
} from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import { Button, FormHelperText, FormLabel } from "tw-components";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useAllChainsData } from "hooks/chains/allChains";
import { NetworkDropdown } from "components/contract-components/contract-publish-form/NetworkDropdown";
import { isAddress } from "ethers/lib/utils";
import { shortenString } from "@thirdweb-dev/react";

interface AddRelayerButtonProps {
  instanceUrl: string;
}

export const AddRelayerButton: React.FC<AddRelayerButtonProps> = ({
  instanceUrl,
}) => {
  const disclosure = useDisclosure();

  return (
    <>
      <Button
        onClick={disclosure.onOpen}
        variant="ghost"
        size="sm"
        leftIcon={<Icon as={AiOutlinePlusCircle} boxSize={6} />}
        colorScheme="primary"
        w="fit-content"
      >
        Add Relayer
      </Button>

      {disclosure.isOpen && (
        <AddModal instanceUrl={instanceUrl} disclosure={disclosure} />
      )}
    </>
  );
};

export interface AddModalInput {
  chainId: number;
  backendWalletAddress: string;
  name?: string;
  allowedContractsRaw: string;
  allowedForwardersRaw: string;
}

const AddModal = ({
  instanceUrl,
  disclosure,
}: {
  instanceUrl: string;
  disclosure: UseDisclosureReturn;
}) => {
  const { mutate: createRelayer } = useEngineCreateRelayer(instanceUrl);
  const { data: backendWallets } = useEngineBackendWallets(instanceUrl);
  const { slugToChainRecord, chainIdToChainRecord } = useAllChainsData();
  const trackEvent = useTrack();
  const { onSuccess, onError } = useTxNotifications(
    "Relayer created successfully.",
    "Failed to create relayer.",
  );

  const form = useForm<AddModalInput>({
    defaultValues: {
      chainId: slugToChainRecord["mumbai"].chainId,
    },
  });

  const onSubmit = (data: AddModalInput) => {
    const createRelayerData: CreateRelayerInput = {
      chain: chainIdToChainRecord[data.chainId].slug,
      backendWalletAddress: data.backendWalletAddress,
      name: data.name,
      allowedContracts: parseAddressListRaw(data.allowedContractsRaw),
      allowedForwarders: parseAddressListRaw(data.allowedForwardersRaw),
    };

    createRelayer(createRelayerData, {
      onSuccess: () => {
        onSuccess();
        disclosure.onClose();
        trackEvent({
          category: "engine",
          action: "create-relayer",
          label: "success",
          instance: instanceUrl,
        });
      },
      onError: (error) => {
        onError(error);
        trackEvent({
          category: "engine",
          action: "create-relayer",
          label: "error",
          instance: instanceUrl,
          error,
        });
      },
    });
  };

  return (
    <Modal isOpen={disclosure.isOpen} onClose={disclosure.onClose} isCentered>
      <ModalOverlay />
      <ModalContent as="form" onSubmit={form.handleSubmit(onSubmit)}>
        <ModalHeader>Add Relayer</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Flex flexDir="column" gap={4}>
            <FormControl isRequired>
              <FormLabel>Chain</FormLabel>
              <NetworkDropdown
                value={form.watch("chainId")}
                onSingleChange={(val) => form.setValue("chainId", val)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Backend Wallet</FormLabel>
              <Select
                {...form.register("backendWalletAddress", { required: true })}
              >
                <option value="" disabled selected hidden>
                  Select a backend wallet to use as a relayer
                </option>
                {backendWallets?.map((wallet) => (
                  <option key={wallet.address} value={wallet.address}>
                    {shortenString(wallet.address, false)}
                    {wallet.label && ` (${wallet.label})`}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Label</FormLabel>
              <Input
                type="text"
                placeholder="Enter a description for this relayer"
                {...form.register("name")}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Allowed Contracts</FormLabel>
              <Textarea
                {...form.register("allowedContractsRaw")}
                placeholder="Enter a comma or newline-separated list of contract addresses"
                rows={4}
              />
              <FormHelperText>Allow all contracts if omitted.</FormHelperText>
            </FormControl>
            <FormControl>
              <FormLabel>Allowed Forwarders</FormLabel>
              <Textarea
                {...form.register("allowedForwardersRaw")}
                placeholder="Enter a comma or newline-separated list of forwarder addresses"
                rows={4}
              />
              <FormHelperText>Allow all forwarders if omitted.</FormHelperText>
            </FormControl>
          </Flex>
        </ModalBody>

        <ModalFooter as={Flex} gap={3}>
          <Button type="button" onClick={disclosure.onClose} variant="ghost">
            Cancel
          </Button>
          <Button
            type="submit"
            colorScheme="primary"
            isDisabled={!form.formState.isValid}
          >
            Add
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

/**
 * Returns a list of valid addresses from a comma or newline-separated string.
 *
 * Example:
 *  input: 0xa5B8492D8223D255dB279C7c3ebdA34Be5eC9D85,0x4Ff9aa707AE1eAeb40E581DF2cf4e14AffcC553d
 *  output:
 *  [
 *    0xa5B8492D8223D255dB279C7c3ebdA34Be5eC9D85,
 *    0x4Ff9aa707AE1eAeb40E581DF2cf4e14AffcC553d,
 *  ]
 */
export const parseAddressListRaw = (raw: string): string[] | undefined => {
  const addresses = raw
    .split(/[,\n]/)
    .map((entry) => entry.trim())
    .filter((entry) => isAddress(entry));
  return addresses.length > 0 ? addresses : undefined;
};
