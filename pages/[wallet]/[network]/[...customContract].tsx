import type { ConsolePage } from "../../_app";
import {
  Box,
  Container,
  Flex,
  Image,
  Skeleton,
  useBreakpointValue,
  usePrevious,
} from "@chakra-ui/react";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { useContractMetadata, useContractType } from "@thirdweb-dev/react";
import { ChakraNextImage } from "components/Image";
import { AppLayout } from "components/app-layouts/app";
import { CustomContractOverviewPage } from "components/custom-contract/overview";
import { CustomContractCodeTab } from "components/custom-contract/tabs/code";
import { Logo } from "components/logo";
import { FeatureIconMap } from "constants/mappings";
import { useIsomorphicLayoutEffect } from "framer-motion";
import { useTrack } from "hooks/analytics/useTrack";
import { LinkProps } from "next/link";
import { useRouter } from "next/router";
import { useCallback, useRef, useState } from "react";
import {
  AddressCopyButton,
  Button,
  Card,
  Heading,
  LinkButton,
  Text,
} from "tw-components";
import { isBrowser } from "utils/isBrowser";

const CustomContractPage: ConsolePage = () => {
  const router = useRouter();
  const query = router.query.customContract || [];
  const contractAddress = query[0];
  const activeTab = query[1] || "";

  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef<any>(null);
  const scrollContainerRef = useRef<HTMLElement>();

  useIsomorphicLayoutEffect(() => {
    const el = document.getElementById("tw-scroll-container");

    if (el) {
      scrollContainerRef.current = el;
    }
  }, []);

  useScrollPosition(
    ({ currPos }) => {
      if (currPos.y < -5) {
        setIsScrolled(false);
      } else if (currPos.y >= -5) {
        setIsScrolled(true);
      }
    },
    [isMobile],
    scrollRef,
    false,
    16,
    scrollContainerRef,
  );

  const { Track: RootTrack } = useTrack({
    page: "custom-contract",
  });

  const { Track: PageTrack } = useTrack({
    page: activeTab ? activeTab : "overview",
  });

  return (
    <RootTrack>
      <Flex direction="column" ref={scrollRef}>
        {/* sub-header-nav */}
        <Box
          position="sticky"
          top={0}
          borderBottomColor="borderColor"
          borderBottomWidth={1}
          bg="backgroundHighlight"
          flexShrink={0}
          w="full"
          as="nav"
          zIndex={1}
        >
          <Container maxW="container.page">
            <Flex direction="row" align="center">
              <Button
                borderRadius="none"
                variant="unstyled"
                transition="all .25s ease"
                transform={
                  isScrolled ? "translateZ(0px)" : "translate3d(0,-20px,0)"
                }
                opacity={isScrolled ? 1 : 0}
                visibility={isScrolled ? "visible" : "hidden"}
                onClick={() =>
                  scrollContainerRef.current?.scrollTo({
                    top: 0,
                    behavior: "smooth",
                  })
                }
              >
                <Logo hideWordmark />
              </Button>
              <Box
                transition="all .25s ease"
                transform={
                  isScrolled
                    ? "translate3d(18px,0,0)"
                    : `translate3d(calc(var(--chakra-sizes-${
                        isMobile ? "9" : "10"
                      }) * -1),0,0)`
                }
              >
                <ContractSubnav
                  contractAddress={contractAddress}
                  activeTab={activeTab}
                />
              </Box>
            </Flex>
          </Container>
        </Box>
        {/* sub-header */}
        <Box
          borderBottomColor="borderColor"
          borderBottomWidth={1}
          bg="backgroundHighlight"
          w="full"
          as="aside"
          py={6}
        >
          <Container maxW="container.page">
            <Flex justify="space-between" align="center" direction="row">
              <ContractMetadata contractAddress={contractAddress} />
              <AddressCopyButton colorScheme="gray" address={contractAddress} />
            </Flex>
          </Container>
        </Box>
        {/* main content */}
        <Container maxW="container.page">
          <PageTrack>
            <Box py={8}>
              {activeTab === "" ? (
                <CustomContractOverviewPage contractAddress={contractAddress} />
              ) : activeTab === "code" ? (
                <CustomContractCodeTab contractAddress={contractAddress} />
              ) : (
                <Card as={Flex} flexDirection="column" gap={2}>
                  <Heading size="subtitle.md">Contract settings</Heading>
                  <Text>coming soon</Text>
                </Card>
              )}
            </Box>
          </PageTrack>
        </Container>
      </Flex>
    </RootTrack>
  );
};

export default CustomContractPage;

CustomContractPage.Layout = AppLayout;

interface ContractMetadataProps {
  contractAddress: string;
}

const ContractMetadata: React.VFC<ContractMetadataProps> = ({
  contractAddress,
}) => {
  const metadataQuery = useContractMetadata(contractAddress);
  const contractType = useContractType(contractAddress);

  const contractTypeImage =
    (contractType.data &&
      contractType.data !== "custom" &&
      FeatureIconMap[contractType.data]) ||
    FeatureIconMap["vote"];

  if (metadataQuery.isError) {
    return <Box>Failed to load contract metadata</Box>;
  }

  return (
    <Flex align="center" gap={2}>
      <Skeleton isLoaded={metadataQuery.isSuccess}>
        {metadataQuery.data?.image ? (
          <Image
            objectFit="contain"
            boxSize="64px"
            src={metadataQuery.data.image}
            alt={metadataQuery.data?.name}
          />
        ) : contractTypeImage ? (
          <ChakraNextImage
            boxSize="64px"
            src={contractTypeImage}
            alt={metadataQuery.data?.name || ""}
          />
        ) : null}
      </Skeleton>
      <Flex direction="column" gap={1}>
        <Skeleton isLoaded={metadataQuery.isSuccess}>
          <Heading size="title.md">
            {metadataQuery.isSuccess
              ? metadataQuery.data?.name
              : "testing testing testing"}
          </Heading>
        </Skeleton>
        <Skeleton isLoaded={metadataQuery.isSuccess}>
          <Text size="body.md">
            {metadataQuery.isSuccess
              ? metadataQuery.data?.description
              : "foo bar baz"}
          </Text>
        </Skeleton>
      </Flex>
    </Flex>
  );
};

interface ContractSubnavProps {
  activeTab: string;
  contractAddress?: string;
}
const ContractSubnav: React.VFC<ContractSubnavProps> = ({
  activeTab,
  contractAddress,
}) => {
  const [hoveredEl, setHoveredEl] = useState<EventTarget & HTMLButtonElement>();
  const previousEl = usePrevious(hoveredEl);
  const isMouseOver = useRef(false);
  const router = useRouter();
  return (
    <Flex
      direction="row"
      gap={0}
      position="relative"
      align="center"
      role="group"
      ml={-3}
      onMouseOver={() => {
        isMouseOver.current = true;
      }}
      onMouseOut={() => {
        isMouseOver.current = false;
        setTimeout(() => {
          if (!isMouseOver.current) {
            setHoveredEl(undefined);
          }
        }, 10);
      }}
    >
      <Box
        position="absolute"
        transitionDuration={previousEl && hoveredEl ? "150ms" : "0ms"}
        w={hoveredEl?.clientWidth || 0}
        h="66%"
        transform={`translate3d(${hoveredEl?.offsetLeft || 0}px,0,0)`}
        bg="inputBgHover"
        borderRadius="md"
      />
      <ContractSubNavLinkButton
        label="Overview"
        onHover={setHoveredEl}
        isActive={activeTab === ""}
        href={{
          pathname: router.pathname,
          query: {
            ...router.query,
            customContract: [contractAddress || "", ""],
          },
        }}
      />

      <ContractSubNavLinkButton
        label="Code"
        onHover={setHoveredEl}
        isActive={activeTab === "code"}
        href={{
          pathname: router.pathname,
          query: {
            ...router.query,
            customContract: [contractAddress || "", "code"],
          },
        }}
      />
      <ContractSubNavLinkButton
        label="Settings"
        onHover={setHoveredEl}
        isActive={activeTab === "settings"}
        href={{
          pathname: router.pathname,
          query: {
            ...router.query,
            customContract: [contractAddress || "", "settings"],
          },
        }}
      />
    </Flex>
  );
};

interface ContractSubNavLinkButton {
  href: LinkProps["href"];
  onHover: (event: EventTarget & HTMLButtonElement) => void;
  isActive: boolean;
  label: string;
}

const ContractSubNavLinkButton: React.VFC<ContractSubNavLinkButton> = (
  props,
) => {
  const { trackEvent } = useTrack();
  const onClick = useCallback(() => {
    trackEvent({
      category: "subnav-link",
      action: "click",
      label: props.label,
    });
    if (isBrowser()) {
      document.getElementById("tw-scroll-container")?.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.label]);
  return (
    <LinkButton
      _focus={{
        boxShadow: "none",
      }}
      variant="unstyled"
      onMouseOverCapture={(e) => props.onHover(e.currentTarget)}
      // size="sm"
      height="auto"
      p={3}
      color="heading"
      borderRadius="none"
      _after={
        props.isActive
          ? {
              content: `""`,
              position: "absolute",
              bottom: "0",
              left: 3,
              right: 3,
              height: "2px",
              bg: "heading",
            }
          : undefined
      }
      href={props.href}
      onClick={onClick}
    >
      {props.label}
    </LinkButton>
  );
};
