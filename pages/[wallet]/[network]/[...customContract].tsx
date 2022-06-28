import {
  Box,
  Container,
  Flex,
  Icon,
  Spinner,
  useBreakpointValue,
  usePrevious,
} from "@chakra-ui/react";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import {
  Outlet,
  ReactLocation,
  Router,
  useMatchRoute,
} from "@tanstack/react-location";
import { AppLayout } from "components/app-layouts/app";
import { ContractHeader } from "components/custom-contract/contract-header";
import { Logo } from "components/logo";
import {
  EnhancedRoute,
  useContractRouteConfig,
} from "contract-ui/hooks/useContractRouteConfig";
import { useIsomorphicLayoutEffect } from "framer-motion";
import { useTrack } from "hooks/analytics/useTrack";
import { useRouter } from "next/router";
import { ReactElement, useCallback, useRef, useState } from "react";
import { FiCheckCircle, FiXCircle } from "react-icons/fi";
import { Button, LinkButton } from "tw-components";
import { isBrowser } from "utils/isBrowser";

export default function CustomContractPage() {
  const router = useRouter();
  const query = router.query.customContract || [];
  const contractAddress = query[0];

  const [location] = useState(() => new ReactLocation());

  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollRef = useRef<any>(null);
  const scrollContainerRef = useRef<HTMLElement>();

  const routes = useContractRouteConfig(contractAddress);
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

  // we can currently *only* client side render this
  // TODO @jonas we should start the router on the root level that way we can leverage it client side there?
  if (!router.query.wallet) {
    return null;
  }

  return (
    <Router
      basepath={`${router.query.wallet}/${router.query.network}/${contractAddress}`}
      location={location}
      routes={routes}
      defaultElement="Foo"
    >
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
              <Flex direction="row" align="center" w="100%" position="relative">
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
                  position="absolute"
                  transition="all .25s ease"
                  willChange="transform width"
                  transform={
                    isScrolled
                      ? "translate3d(40px,0,0)"
                      : `translate3d(0, 0, 0)`
                  }
                  w={isScrolled ? "calc(100% - 40px)" : "100%"}
                >
                  <ContractSubnav routes={routes} />
                </Box>
              </Flex>
            </Container>
          </Box>
          {/* sub-header */}
          <ContractHeader contractAddress={contractAddress} />
          {/* main content */}
          <Container maxW="container.page">
            <Box py={8}>
              <Outlet />
            </Box>
          </Container>
        </Flex>
      </RootTrack>
    </Router>
  );
}

CustomContractPage.getLayout = (page: ReactElement) => (
  <AppLayout>{page}</AppLayout>
);

interface ContractSubnavProps {
  routes: EnhancedRoute[];
}
const ContractSubnav: React.FC<ContractSubnavProps> = ({ routes }) => {
  const [hoveredEl, setHoveredEl] = useState<EventTarget & HTMLButtonElement>();
  const previousEl = usePrevious(hoveredEl);
  const isMouseOver = useRef(false);

  return (
    <Flex
      direction="row"
      gap={0}
      position="relative"
      align="center"
      role="group"
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

      {routes
        .filter(
          (route) =>
            route.isEnabled === undefined || route.isEnabled !== "disabled",
        )
        .map((route) => (
          <ContractSubNavLinkButton
            icon={
              route.isEnabled !== undefined ? (
                route.isEnabled === "enabled" ? (
                  <Icon as={FiCheckCircle} color="green.500" />
                ) : route.isEnabled === "loading" ? (
                  <Spinner color="purple.500" size="xs" />
                ) : (
                  <Icon as={FiXCircle} color="red.500" />
                )
              ) : undefined
            }
            key={route.path}
            label={route.title}
            onHover={setHoveredEl}
            href={route.path}
          />
        ))}
    </Flex>
  );
};

interface ContractSubNavLinkButton {
  href: string;
  onHover: (event: EventTarget & HTMLButtonElement) => void;
  label: string;
  icon?: JSX.Element;
}

const ContractSubNavLinkButton: React.FC<ContractSubNavLinkButton> = (
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

  const matchRoute = useMatchRoute();

  return (
    <LinkButton
      _focus={{
        boxShadow: "none",
      }}
      display="flex"
      leftIcon={props.icon}
      variant="unstyled"
      onMouseOverCapture={(e) => props.onHover(e.currentTarget)}
      height="auto"
      p={3}
      color="heading"
      borderRadius="none"
      _after={
        matchRoute({ to: props.href, fuzzy: props.href !== "./" })
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
