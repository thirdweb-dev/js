import {
  AspectRatio,
  Center,
  Divider,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import {
  useAddress,
  useDisconnect,
  useLogin,
  useUser,
  useWalletConfig,
} from "@thirdweb-dev/react";
import { ExternalApprovalNotice } from "components/buttons/TransactionButton";
import { IconLogo } from "components/logo";
import { useTrack } from "hooks/analytics/useTrack";
import { useRef } from "react";
import { Button, Card, Heading, Text, TrackedLink } from "tw-components";

const TRACKING_CATEGORY = "notice";

export const PrivacyNotice: React.FC = () => {
  const track = useTrack();
  const evmAddress = useAddress();
  const solAddress = useWallet().publicKey?.toBase58();
  const walletId = useWalletConfig()?.id;
  const { isLoading, isLoggedIn } = useUser();
  const { login, isLoading: loginLoading } = useLogin();
  const disconnect = useDisconnect();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const initialFocusRef = useRef<HTMLButtonElement>(null);

  if (!evmAddress && !solAddress) {
    // if neither solana or evm wallets are connected then don't show the notice
    return null;
  }

  // temporary
  if (!evmAddress && solAddress) {
    // don't show the notice if it's solana
    return null;
  }

  if (isLoading || isLoggedIn) {
    // if the user is logged in or we're loading the user then don't show the notice
    return null;
  }

  return (
    <Modal
      size={isMobile ? "full" : "lg"}
      closeOnEsc={false}
      allowPinchZoom
      closeOnOverlayClick={false}
      isCentered
      isOpen
      onClose={() => undefined}
      trapFocus={false}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalBody p={6} as={Flex} justify="center" gap={2} flexDir="column">
          <Center>
            <AspectRatio ratio={1} w="120px">
              <IconLogo />
            </AspectRatio>
          </Center>
          <Heading size="subtitle.md" textAlign="center">
            Welcome to the <strong>thirdweb dashboard</strong>
          </Heading>

          <Text textAlign="center">
            By connecting your wallet and using the thirdweb dashboard, you
            agree to our{" "}
            <TrackedLink
              href="/tos"
              isExternal
              category={TRACKING_CATEGORY}
              label="terms"
              textDecoration="underline"
              _hover={{
                opacity: 0.8,
              }}
            >
              Terms of Service
            </TrackedLink>{" "}
            and{" "}
            <TrackedLink
              href="/privacy"
              isExternal
              category={TRACKING_CATEGORY}
              label="privacy"
              textDecoration="underline"
              _hover={{
                opacity: 0.8,
              }}
            >
              Privacy Policy
            </TrackedLink>
            .
          </Text>
        </ModalBody>
        <Divider />
        <ModalFooter w="full" p={6}>
          <Flex
            w="full"
            gap={2}
            direction={{ base: "column-reverse", md: "row" }}
          >
            <Button
              isDisabled={loginLoading}
              w="100%"
              variant="outline"
              onClick={() => {
                track({
                  category: TRACKING_CATEGORY,
                  action: "cancel",
                });
                disconnect().catch((err) => {
                  console.error("failed to disconnect wallet", err);
                });
              }}
            >
              Cancel
            </Button>
            <Popover
              initialFocusRef={initialFocusRef}
              isLazy
              isOpen={walletId === "safe" && loginLoading}
            >
              <PopoverTrigger>
                <Button
                  isLoading={loginLoading}
                  w="100%"
                  borderRadius="md"
                  colorScheme="primary"
                  onClick={() => {
                    track({
                      category: TRACKING_CATEGORY,
                      action: "accept_sign",
                      label: "attempt",
                    });
                    login()
                      .then(() => {
                        track({
                          category: TRACKING_CATEGORY,
                          action: "accept_sign",
                          label: "success",
                        });
                      })
                      .catch((err) => {
                        console.error("failed to login", err);
                        track({
                          category: TRACKING_CATEGORY,
                          action: "accept_sign",
                          label: "error",
                          error: err,
                        });
                      });
                  }}
                  autoFocus
                >
                  Accept & Sign
                </Button>
              </PopoverTrigger>
              <Card
                maxW="sm"
                w="auto"
                as={PopoverContent}
                bg="backgroundCardHighlight"
                mx={6}
                boxShadow="0px 0px 2px 0px var(--popper-arrow-shadow-color)"
              >
                <PopoverArrow bg="backgroundCardHighlight" />
                <PopoverBody>
                  <ExternalApprovalNotice
                    walletId={walletId}
                    initialFocusRef={initialFocusRef}
                  />
                </PopoverBody>
              </Card>
            </Popover>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
