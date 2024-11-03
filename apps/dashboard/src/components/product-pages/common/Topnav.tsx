import { Box, Container, Flex } from "@chakra-ui/react";
import { Logo } from "components/logo";
import { TrackedLink } from "tw-components";
import { DesktopMenu } from "./nav/DesktopMenu";
import { MobileMenu } from "./nav/MobileMenu";

export const HomepageTopNav: React.FC = () => {
  return (
    <Box
      position="sticky"
      top={0}
      left={0}
      w="100%"
      zIndex="overlay"
      as="header"
      bgColor="rgba(0,0,0,0)"
      backdropFilter="saturate(100%) blur(20px)"
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
          <Logo forceShowWordMark color="#fff" />
        </TrackedLink>
        <DesktopMenu />
        <MobileMenu />
      </Container>
    </Box>
  );
};
