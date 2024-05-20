import { CreateFeedbackInput } from "@3rdweb-sdk/react/hooks/useApi";
import { useLoggedInUser } from "@3rdweb-sdk/react/hooks/useLoggedInUser";
import {
  Box,
  Flex,
  FormControl,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { ConnectWallet } from "@thirdweb-dev/react";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import { Button, FormLabel, Text } from "tw-components";

export const FeedbackForm = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const form = useForm<CreateFeedbackInput>();
  const { onSuccess, onError } = useTxNotifications(
    "Feedback successfully sent!",
    "Failed to submit feedback",
  );
  const { isLoggedIn } = useLoggedInUser();

  return (
    <>
      <Box
        position={{ base: "fixed", md: "relative" }}
        bottom={{ base: 4, md: "auto" }}
        right={{ base: 4, md: "auto" }}
        zIndex={{ base: "popover", md: "auto" }}
      >
        <Button
          onClick={onOpen}
          color="bgBlack"
          display={{ base: "none", md: "block" }}
          size="sm"
          bg={"transparent"}
          px={0}
          _hover={{ bg: "transparent", textDecoration: "underline" }}
          mx={1.5}
        >
          Feedback
        </Button>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent
          as="form"
          onSubmit={form.handleSubmit((data) => {
            try {
              // createTicket(data);
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
              👋 Tell us your experience
            </Heading>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody p={6} as={Flex} gap={4} flexDir="column">
            <Text>
              We'd love to hear from you! How{"'"}s your experience with
              thirdweb?
            </Text>
            <FormControl>
              <FormLabel>Subject</FormLabel>
              <Input
                autoComplete="off"
                {...form.register("title", {
                  required: false,
                })}
              ></Input>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Feedback</FormLabel>
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
            {isLoggedIn ? <Button>Submit</Button> : <ConnectWallet />}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
