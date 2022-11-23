import { DesktopMenu } from "./nav/DesktopMenu";
import { MobileMenu } from "./nav/MobileMenu";
import { Box, Container, Flex, useBreakpointValue } from "@chakra-ui/react";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";
import { Logo } from "components/logo";
import React, { useState } from "react";
import { TrackedLink } from "tw-components";

export const HomepageTopNav: React.FC = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [isScrolled, setIsScrolled] = useState(false);

  useScrollPosition(
    ({ currPos }) => {
      if (currPos.y < -5) {
        setIsScrolled(true);
      } else if (currPos.y >= -5) {
        setIsScrolled(false);
      }
    },
    [isMobile],
    undefined,
    false,
    100,
  );

  return (
    <>
      <Box
        transition="all 100ms"
        position="sticky"
        top={0}
        left={0}
        w="100%"
        zIndex="overlay"
        as="header"
        bgColor={isScrolled ? "rgba(0,0,0,0.8)" : "rgba(0,0,0,0)"}
        backdropFilter={
          isScrolled ? "saturate(180%) blur(20px)" : "saturate(100%) blur(0px)"
        }
      >
        <Container
          as={Flex}
          py={4}
          maxW="container.page"
          justify="space-between"
          align="center"
          flexDir="row"
        >
          <TrackedLink href="/" category="topnav" label="home">
            <Logo color="#fff" />
          </TrackedLink>
          <DesktopMenu />
          <MobileMenu
            aria-label="Homepage Menu"
            display={{ base: "inherit", md: "none" }}
          />
        </Container>
      </Box>
      <Box h="32px" w="100%" display={["block", "block", "none"]} />
    </>
  );
};
