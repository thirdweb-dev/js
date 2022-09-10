import {
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useAddress } from "@thirdweb-dev/react";
import { Logo } from "components/logo";
import { useLocalStorage } from "hooks/useLocalStorage";
import { useForm } from "react-hook-form";
import { Button, Checkbox, Heading, Text, TrackedLink } from "tw-components";

export const PrivacyNotice: React.FC = () => {
  const [hasAcceptedTOS, setHasAcceptedTOS] = useLocalStorage(
    "accepted-tos",
    false,
  );
  const isMobile = useBreakpointValue({ base: true, md: false });
  const address = useAddress();
  const { register, watch, handleSubmit } = useForm<{ accepted: false }>();

  return hasAcceptedTOS.data || hasAcceptedTOS.isLoading || !address ? null : (
    <Modal
      size={isMobile ? "full" : "xl"}
      closeOnEsc={false}
      allowPinchZoom
      closeOnOverlayClick={false}
      isCentered
      isOpen
      onClose={() => undefined}
    >
      <ModalOverlay />
      <ModalContent p={{ base: 0, md: 8 }}>
        <ModalHeader mt={{ base: 8, md: 0 }}>
          <Flex align="flex-start" gap={1}>
            <Logo />
          </Flex>
        </ModalHeader>
        <ModalBody>
          <Flex
            gap={1}
            flexDirection="column"
            as="form"
            onSubmit={handleSubmit(() => setHasAcceptedTOS(true))}
          >
            <Heading size="subtitle.md">
              Welcome to the thirdweb dashboard
            </Heading>
            <Flex mt={1}>
              <Checkbox autoFocus={true} isRequired {...register("accepted")} />
              <Text ml={3}>
                I have read and agree to the{" "}
                <TrackedLink
                  href="/privacy"
                  isExternal
                  category="notice"
                  label="privacy"
                  textDecoration="underline"
                  _hover={{
                    opacity: 0.8,
                  }}
                >
                  Privacy Policy
                </TrackedLink>{" "}
                and{" "}
                <TrackedLink
                  href="/tos"
                  isExternal
                  category="notice"
                  label="terms"
                  textDecoration="underline"
                  _hover={{
                    opacity: 0.8,
                  }}
                >
                  Terms of Service
                </TrackedLink>
                .
              </Text>
            </Flex>
            <Divider my={4} />
            <Button
              width="100%"
              type="submit"
              borderRadius="md"
              colorScheme="primary"
              isDisabled={!watch("accepted")}
            >
              Continue
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
