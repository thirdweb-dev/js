import {
  Box,
  Flex,
  FormControl,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { Button, FormLabel, Heading } from "tw-components";
import { useTxNotifications } from "hooks/useTxNotifications";
import {
  CreateTicketInput,
  useAccount,
  useCreateTicket,
} from "@3rdweb-sdk/react/hooks/useApi";
import { ConnectWallet } from "@thirdweb-dev/react";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";

const productOptions = [
  "Wallets",
  "Contracts",
  "Payments",
  "Infrastructure",
  "Account",
  "Billing",
  "Other",
];

export const ContactSupportModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const form = useForm<CreateTicketInput>();
  const { onSuccess, onError } = useTxNotifications(
    "Successfully sent ticket. Our team will be in touch shortly.",
    "Failed to send ticket. Please try again.",
  );
  const { isLoggedIn } = useLoggedInUser();
  const { mutate: createTicket } = useCreateTicket();

  return (
    <>
      <Box
        position={{ base: "fixed", md: "relative" }}
        bottom={{ base: 4, md: "auto" }}
        right={{ base: 4, md: "auto" }}
        zIndex={{ base: "popover", md: "auto" }}
      >
        <Button onClick={onOpen} colorScheme="primary">
          Submit a ticket
        </Button>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          as="form"
          onSubmit={form.handleSubmit((data) => {
            try {
              createTicket(data);
              onClose();
              onSuccess();
              form.reset();
            } catch (err) {
              console.error(err);
              onError(err);
            }
          })}
        >
          <ModalHeader>
            <Heading size="title.md" mt={2}>
              Get in touch with us
            </Heading>
          </ModalHeader>
          <ModalBody p={6} as={Flex} gap={4} flexDir="column">
            <FormControl>
              <FormLabel>What do you need help with?</FormLabel>
              <Select {...form.register("product", { required: true })}>
                {productOptions?.map((product) => (
                  <option key={product} value={product}>
                    {product}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Description</FormLabel>
              <Textarea
                autoComplete="off"
                {...form.register("markdown", { required: true })}
                rows={7}
                maxLength={10000}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter as={Flex} gap={3}>
            <Button onClick={onClose} variant="ghost">
              Cancel
            </Button>
            {isLoggedIn ? (
              <Button
                type="submit"
                colorScheme="primary"
                isDisabled={form.watch("markdown")?.length === 0}
              >
                Submit
              </Button>
            ) : (
              <ConnectWallet />
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
