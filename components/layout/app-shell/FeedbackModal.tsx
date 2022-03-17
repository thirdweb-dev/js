import { useWeb3 } from "@3rdweb-sdk/react";
import {
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { Button } from "components/buttons/Button";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface IFeedback {
  isOpen: boolean;
  onClose: () => void;
}

interface FeedbackData {
  contact: string;
  building: string;
  feedback: string;
  other: string;
}

export const FeedbackModal: React.FC<IFeedback> = ({ isOpen, onClose }) => {
  const toast = useToast();
  const { address, chainId } = useWeb3();
  const [isLoading, setIsLoading] = useState(false);

  const { watch, register, handleSubmit } = useForm<FeedbackData>();

  const onSubmit = async (data: FeedbackData) => {
    setIsLoading(true);
    const res = await fetch("/api/webhooks/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address,
        url: window.location.href,
        chainId,
        ...data,
      }),
    });

    setIsLoading(false);
    if (res.ok) {
      toast({
        title: "Thank you for your feedback!",
        description: "Your feedback was succesfully submitted.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      onClose();
    } else {
      toast({
        title: "Error",
        description: "Unable to submit feedback.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal size="xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent marginY="auto">
        <ModalHeader>
          <Stack>
            <Heading size="title.md">Leave us your feedback</Heading>
            <Text>
              We would love to hear any feedback you have for us. We take your
              feedback seriously and genuinely want to improve your experience
              building on web3.
            </Text>
          </Stack>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <form id="feedback-form" onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={8}>
              <FormControl>
                <Heading as={FormLabel} size="label.lg">
                  What are you building?
                </Heading>
                <Textarea
                  {...register("building")}
                  placeholder="Tell us a bit about what you're building..."
                />
              </FormControl>

              <FormControl>
                <Heading as={FormLabel} size="label.lg">
                  How can we improve your experience?
                </Heading>
                <Textarea
                  {...register("feedback")}
                  placeholder="Tell us how we can improve your experience..."
                />
              </FormControl>

              <FormControl>
                <Heading as={FormLabel} size="label.lg">
                  Anything else you would like to tell us?
                </Heading>
                <Textarea
                  height="160px"
                  {...register("other")}
                  placeholder="Let us know anything else..."
                />
              </FormControl>

              <FormControl>
                <Heading as={FormLabel} size="label.lg">
                  Where can we reach you?
                </Heading>
                <Text mb="4px">
                  This is completely optional - an email or twitter works great!
                </Text>
                <Input
                  {...register("contact")}
                  placeholder="name@example.com | https://twitter.com/username"
                />
              </FormControl>

              <Button
                type="submit"
                form="feedback-form"
                colorScheme="primary"
                isLoading={isLoading}
                isDisabled={
                  !watch("contact") &&
                  !watch("building") &&
                  !watch("feedback") &&
                  !watch("other")
                }
              >
                Submit
              </Button>
            </Stack>
          </form>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};
