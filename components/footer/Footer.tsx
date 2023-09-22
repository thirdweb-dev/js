import {
  COMMUNITY,
  COMPANY,
  FooterLinkInfo,
  NETWORKS,
  SDKs,
  SOLUTIONS,
} from "./footerLinks";
import { SOCIALS } from "./socialLinks";
import {
  Box,
  ButtonGroup,
  Container,
  Flex,
  SimpleGrid,
} from "@chakra-ui/react";
import { Logo } from "components/logo";
import {
  DEVELOPER_RESOURCES,
  PRODUCTS,
} from "components/product-pages/common/nav/data";
import {
  Heading,
  LinkButton,
  TrackedIconButton,
  TrackedLink,
} from "tw-components";

interface FooterLinkGroupProps {
  heading: string;
  links: FooterLinkInfo[];
}

const FooterLinkGroup: React.FC<FooterLinkGroupProps> = (props) => {
  return (
    <Flex
      direction="column"
      gap={4}
      minW={36}
      flex={1}
      mb={{ md: 12, base: 14 }}
    >
      <Heading as="h5" size="label.lg">
        {props.heading}
      </Heading>
      <Flex gap={3} direction="column">
        {props.links.map((linkData) => (
          <TrackedLink
            isExternal={linkData.link.startsWith("http")}
            key={linkData.label}
            href={linkData.link}
            category="footer"
            label={linkData.label}
          >
            {linkData.name}
          </TrackedLink>
        ))}
      </Flex>
    </Flex>
  );
};

const FooterLinksGrid: React.FC = () => {
  return (
    <SimpleGrid columns={{ base: 2, lg: 4 }} spacing={8}>
      <FooterLinkGroup heading="Products" links={PRODUCTS} />
      <FooterLinkGroup heading="Developer" links={DEVELOPER_RESOURCES} />
      <div>
        <FooterLinkGroup heading="SDKs" links={SDKs} />
        <FooterLinkGroup heading="Solutions" links={SOLUTIONS} />
        <FooterLinkGroup heading="Networks" links={NETWORKS} />
      </div>
      <div>
        <FooterLinkGroup heading="Community" links={COMMUNITY} />
        <FooterLinkGroup heading="Company" links={COMPANY} />
      </div>
    </SimpleGrid>
  );
};

const SocialIcons: React.FC = () => {
  return (
    <ButtonGroup variant="ghost">
      {SOCIALS.map((data) => (
        <TrackedIconButton
          key={data.link}
          as={LinkButton}
          isExternal
          noIcon
          href={data.link}
          icon={data.icon}
          category="footer"
          aria-label={data.ariaLabel}
          label={data.label}
        />
      ))}
    </ButtonGroup>
  );
};

export const HomepageFooter: React.FC = () => {
  return (
    <Box bgColor="#111315" zIndex={100}>
      <Container as="footer" maxW="container.page" color="gray.500">
        <Flex
          gap={8}
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          py={{ base: 12, md: 16 }}
        >
          {/* logo + social icons */}
          <Flex
            direction="column"
            gap={{ base: 6, md: 8 }}
            align={{ base: "center", md: "start" }}
            mb={12}
          >
            <Logo color="#fff" />
            <SocialIcons />
          </Flex>

          <FooterLinksGrid />
        </Flex>
      </Container>
    </Box>
  );
};
