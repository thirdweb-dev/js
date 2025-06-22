import {
  Flex,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
  type UseDisclosureReturn,
  useDisclosure,
} from "@chakra-ui/react";
import { Button } from "chakra/button";
import { FormHelperText, FormLabel } from "chakra/form";
import { CirclePlusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import { isAddress, shortenAddress } from "thirdweb/utils";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { useAllChainsData } from "@/hooks/chains/allChains";
import {
  type CreateRelayerInput,
  useEngineBackendWallets,
  useEngineCreateRelayer,
} from "@/hooks/useEngine";
import { useTxNotifications } from "@/hooks/useTxNotifications";

interface AddRelayerButtonProps {
  instanceUrl: string;
  authToken: string;
  client: ThirdwebClient;
}

export const AddRelayerButton: React.FC<AddRelayerButtonProps> = ({
  instanceUrl,
  authToken,
  client,
}) => {
  const disclosure = useDisclosure();

  return (
    <>
      <Button
        colorScheme="primary"
        leftIcon={<CirclePlusIcon className="size-6" />}
        onClick={disclosure.onOpen}
        size="sm"
        variant="ghost"
        w="fit-content"
      >
        Add Relayer
      </Button>

      {disclosure.isOpen && (
        <AddModal
          authToken={authToken}
          client={client}
          disclosure={disclosure}
          instanceUrl={instanceUrl}
        />
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
  authToken,
  client,
}: {
  instanceUrl: string;
  disclosure: UseDisclosureReturn;
  authToken: string;
  client: ThirdwebClient;
}) => {
  const { mutate: createRelayer } = useEngineCreateRelayer({
    authToken,
    instanceUrl,
  });
  const { data: backendWallets } = useEngineBackendWallets({
    authToken,
    instanceUrl,
  });
  const { idToChain } = useAllChainsData();
  const { onSuccess, onError } = useTxNotifications(
    "Relayer created successfully.",
    "Failed to create relayer.",
  );

  const form = useForm<AddModalInput>({
    defaultValues: {
      chainId: 11155111, // sepolia chain id
    },
  });

  const onSubmit = (data: AddModalInput) => {
    const createRelayerData: CreateRelayerInput = {
      allowedContracts: parseAddressListRaw(data.allowedContractsRaw),
      allowedForwarders: parseAddressListRaw(data.allowedForwardersRaw),
      backendWalletAddress: data.backendWalletAddress,
      chain: idToChain.get(data.chainId)?.slug ?? "unknown",
      name: data.name,
    };

    createRelayer(createRelayerData, {
      onError: (error) => {
        onError(error);
        console.error(error);
      },
      onSuccess: () => {
        onSuccess();
        disclosure.onClose();
      },
    });
  };

  return (
    <Modal isCentered isOpen={disclosure.isOpen} onClose={disclosure.onClose}>
      <ModalOverlay />
      <ModalContent
        as="form"
        className="!bg-background rounded-lg border border-border"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <ModalHeader>Add Relayer</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Flex flexDir="column" gap={4}>
            <FormControl isRequired>
              <FormLabel>Chain</FormLabel>
              <SingleNetworkSelector
                chainId={form.watch("chainId")}
                client={client}
                onChange={(val) => form.setValue("chainId", val)}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Backend Wallet</FormLabel>
              <Select
                {...form.register("backendWalletAddress", { required: true })}
              >
                <option disabled hidden selected value="">
                  Select a backend wallet to use as a relayer
                </option>
                {backendWallets?.map((wallet) => (
                  <option key={wallet.address} value={wallet.address}>
                    {shortenAddress(wallet.address)}
                    {wallet.label && ` (${wallet.label})`}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Label</FormLabel>
              <Input
                placeholder="Enter a description for this relayer"
                type="text"
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
          <Button onClick={disclosure.onClose} type="button" variant="ghost">
            Cancel
          </Button>
          <Button
            colorScheme="primary"
            isDisabled={!form.formState.isValid}
            type="submit"
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
