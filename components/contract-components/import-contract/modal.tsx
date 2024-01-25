import { useMultiChainRegContractList } from "@3rdweb-sdk/react";
import { useAddContractMutation } from "@3rdweb-sdk/react/hooks/useRegistry";
import {
  Flex,
  FormControl,
  Modal,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import { useAddress, useChainId } from "@thirdweb-dev/react";
import { NetworkSelectorButton } from "components/selects/NetworkSelectorButton";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { useChainSlug } from "hooks/chains/chainSlug";
import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { FiFilePlus } from "react-icons/fi";
import { Button, FormErrorMessage, Heading, Text } from "tw-components";

type ImportModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const defaultValues = {
  contractAddress: "",
};

export const ImportModal: React.FC<ImportModalProps> = (props) => {
  const addToDashboard = useAddContractMutation();
  const address = useAddress();
  const registry = useMultiChainRegContractList(address);
  const form = useForm({
    defaultValues,
  });

  const onClose = useCallback(() => {
    form.reset(defaultValues);
    props.onClose();
  }, [form, props]);

  const router = useRouter();
  const chainId = useChainId();
  const chainSlug = useChainSlug(chainId || 1);
  const [isRedirecting, setIsRedirecting] = useState(false);

  return (
    <Modal isOpen={props.isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent
        as="form"
        onSubmit={form.handleSubmit(async (data) => {
          if (!chainId) {
            throw new Error("No chain id");
          }

          try {
            const res = await fetch(
              `https://contract.thirdweb.com/metadata/${chainId}/${data.contractAddress}`,
            );
            const json = await res.json();

            if (json.error) {
              throw new Error(json.message);
            }

            const hasUnknownContractName =
              !!json.settings?.compilationTarget?.["UnknownContract"];

            const hasPartialAbi = json.metadata?.isPartialAbi;

            if (hasUnknownContractName || hasPartialAbi) {
              form.setError("contractAddress", {
                message:
                  "This contract cannot be imported since it's not verified on any block explorers.",
              });
              return;
            }

            const isOnRegistry =
              registry.isFetched &&
              registry.data?.find(
                (c) =>
                  c.address.toLowerCase() ===
                  data.contractAddress.toLowerCase(),
              ) &&
              registry.isSuccess;

            if (isOnRegistry) {
              router.push(`/${chainSlug}/${data.contractAddress}`);
              setIsRedirecting(true);
              return;
            }

            addToDashboard.mutate(
              {
                contractAddress: data.contractAddress,
                chainId,
              },
              {
                onSuccess: () => {
                  router.push(`/${chainSlug}/${data.contractAddress}`);
                },
                onError: (err) => {
                  console.error(err);
                },
              },
            );
          } catch (err) {
            console.error(err);
          }
        })}
        p={8}
        rounded="lg"
      >
        <Flex gap={6} direction="column">
          <Flex gap={1} direction="column">
            <Heading size="title.sm" mb={1}>
              Import Contract
            </Heading>
            <Text color="faded">
              Import an already deployed contract into thirdweb by entering a
              contract address below.
            </Text>
          </Flex>
          <Flex gap={3} direction="column">
            <FormControl isInvalid={!!form.formState.errors.contractAddress}>
              <SolidityInput
                solidityType="address"
                formContext={form}
                placeholder="Contract address"
                {...form.register("contractAddress")}
              />
              <FormErrorMessage>
                {form.formState.errors.contractAddress?.message}
              </FormErrorMessage>
            </FormControl>

            <NetworkSelectorButton />
          </Flex>
          <Button
            ml="auto"
            leftIcon={<FiFilePlus />}
            colorScheme="primary"
            type="submit"
            isLoading={
              form.formState.isSubmitting ||
              addToDashboard.isLoading ||
              addToDashboard.isSuccess ||
              isRedirecting
            }
            loadingText={
              addToDashboard.isSuccess || isRedirecting
                ? "Redirecting"
                : "Importing contract"
            }
          >
            Import
          </Button>
        </Flex>
      </ModalContent>
    </Modal>
  );
};
