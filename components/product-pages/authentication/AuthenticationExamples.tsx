import {
  DAOs,
  Marketplaces,
  NFTDrops,
  TokenGated,
} from "../homepage/examples/example-svgs";
import { Flex, LinkBox, LinkOverlay, SimpleGrid } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { Badge, Heading } from "tw-components";

const EXAMPLES = [
  {
    title: "Sign-in With Wallet",
    label: "sign-in-with-wallet",
    href: "https://github.com/thirdweb-example/sign-in-with-ethereum",
    svg: NFTDrops,
  },
  {
    title: "Stripe Subscriptions For Wallets",
    label: "stripe-subscriptions-for-wallets",
    href: "https://github.com/thirdweb-example/thirdweb-stripe",
    svg: Marketplaces,
  },
  {
    title: "Link Existing Accounts to Wallets",
    label: "link-existing-accounts-to-wallets",
    href: "",
    svg: TokenGated,
  },
  {
    title: "Authenticate With Discord Bot",
    label: "authenticate-with-discord-bot",
    href: "",
    svg: DAOs,
  },
];

interface ExampleItemProps {
  title: string;
  label: string;
  href: string;
  svg: React.FC;
}

const ExampleItem: React.FC<ExampleItemProps> = ({
  title,
  label,
  href,
  svg: RenderSVG,
}) => {
  const { trackEvent } = useTrack();

  if (!href) {
    return (
      <Flex flexDir="column" position="relative" gap={4} flexGrow={0}>
        <RenderSVG />
        <Badge
          alignSelf="center"
          borderRadius="md"
          position="absolute"
          top="-36px"
        >
          Example Coming Soon
        </Badge>
        <Heading textAlign="center" size="subtitle.md" maxW="100%">
          {title}
        </Heading>
      </Flex>
    );
  }

  return (
    <Flex as={LinkBox} role="group" flexDir="column" gap={4} flexGrow={0}>
      <RenderSVG />
      <LinkOverlay
        href={href}
        isExternal
        onClick={() => {
          trackEvent({
            category: "example",
            action: "click",
            label,
          });
        }}
      >
        <Heading
          _groupHover={{ fontWeight: "bold" }}
          textAlign="center"
          size="subtitle.md"
          maxW="100%"
        >
          {title}
        </Heading>
      </LinkOverlay>
    </Flex>
  );
};

export const AuthenticationExamples: React.FC = () => {
  return (
    <SimpleGrid
      w="100%"
      columns={{ base: 2, md: 4 }}
      spacing={{ base: 6, md: 24 }}
    >
      {EXAMPLES.map((data, index) => (
        <ExampleItem key={index} {...data} />
      ))}
    </SimpleGrid>
  );
};
