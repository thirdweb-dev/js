import {
  ButtonGroup,
  Divider,
  Flex,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  UnorderedList,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Logo } from "components/logo";
import { useLocalStorage } from "hooks/useLocalStorage";
import React from "react";
import { FiCheck } from "react-icons/fi";
import { Button, Heading, LinkButton, Text } from "tw-components";

export const NightlyNotice: React.FC = () => {
  const [hasShownWelcome, setHasShownWelcome] = useLocalStorage(
    "hasShownWelcome",
    false,
  );
  const isMobile = useBreakpointValue({ base: true, md: false });

  return hasShownWelcome ? null : (
    <Modal
      size={isMobile ? "full" : "xl"}
      closeOnEsc={false}
      allowPinchZoom
      closeOnOverlayClick={false}
      isCentered
      isOpen
      onClose={() => setHasShownWelcome(true)}
    >
      <ModalOverlay />
      <ModalContent p={{ base: 0, md: 8 }}>
        <ModalHeader mt={{ base: 8, md: 0 }}>
          <Flex align="flex-start" gap={1}>
            <Logo />
          </Flex>
        </ModalHeader>
        <ModalBody as={Flex} gap={1} flexDirection="column">
          <Heading size="subtitle.md">
            Welcome to the new thirdweb dashboard
          </Heading>
          <Text>
            This is the newest version of the thirdweb dashboard and comes with
            many <strong>new improvements</strong>.
          </Text>
          <UnorderedList spacing={0.5}>
            <Text as={ListItem}>
              We are now completely <strong>free to use</strong> during early
              access! We no longer take any fees.
            </Text>
            <Text as={ListItem}>
              Contract deployments are <strong>up to 10x cheaper</strong> -
              we&apos;re now using proxy contracts to save you gas! Deployed
              contracts are still 100% owned by you.
            </Text>
            <Text as={ListItem}>
              <strong>Projects have been removed</strong>. Instead, you can
              deploy contracts directly from your wallet, saving you even more
              gas.
            </Text>
            <Text as={ListItem}>
              Modules now are re-named to <strong>contracts</strong>.
            </Text>
            <Text as={ListItem}>
              The dashboard now has a <strong>dark mode</strong>! You can use
              the crescent icon in the top right to toggle it.
            </Text>
          </UnorderedList>

          <Divider my={4} />

          <ButtonGroup
            flexDirection={{ base: "column", md: "row" }}
            gap={2}
            spacing={0}
            w="100%"
          >
            <LinkButton
              width="100%"
              href="https://blog.thirdweb.com/thirdweb-v2"
              borderRadius="md"
              isExternal
            >
              Learn More
            </LinkButton>
            <Button
              autoFocus
              width="100%"
              onClick={() => setHasShownWelcome(true)}
              leftIcon={<FiCheck />}
              borderRadius="md"
              colorScheme="primary"
            >
              Continue
            </Button>
          </ButtonGroup>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
