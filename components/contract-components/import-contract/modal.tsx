import {
  Flex,
  Input,
  Modal,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";
import { TransactionButton } from "components/buttons/TransactionButton";
import { NetworkSelectorButton } from "components/selects/NetworkSelectorButton";
import { useRouter } from "next/router";
import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Heading, Text } from "tw-components";

type ImportModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const defaultValues = {
  contractAddress: "",
  chainId: 1,
};

export const ImportModal: React.FC<ImportModalProps> = (props) => {
  const form = useForm({
    defaultValues,
  });

  const onClose = useCallback(() => {
    form.reset(defaultValues);
    props.onClose();
  }, [form, props]);

  const router = useRouter();

  return (
    <Modal isOpen={props.isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent
        as="form"
        onSubmit={form.handleSubmit((data) => {
          router.push(
            `/${data.chainId}/${data.contractAddress}?import=true&add=true`,
          );
        })}
        p={8}
        rounded="lg"
      >
        <Flex gap={6} direction="column">
          <Flex gap={1} direction="column">
            <Heading size="title.sm">Import Contract</Heading>
            <Text color="faded">
              Importing your contract unlocks smarter SDKs, custom admin
              dashboards, and tailored data feeds.
            </Text>
          </Flex>
          <Flex gap={3} direction="column">
            <Input
              placeholder="Contract address"
              {...form.register("contractAddress")}
            />

            <NetworkSelectorButton
              onSwitchChain={(chain) => {
                form.setValue("chainId", chain.chainId);
              }}
            />
          </Flex>
          <TransactionButton
            ml="auto"
            colorScheme="primary"
            type="submit"
            transactionCount={1}
            isLoading={false}
            isGasless
          >
            Import
          </TransactionButton>
        </Flex>
      </ModalContent>
    </Modal>
  );
};
