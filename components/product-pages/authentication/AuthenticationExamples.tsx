import { Box, Flex, LinkBox, LinkOverlay, SimpleGrid } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { useTrack } from "hooks/analytics/useTrack";
import { StaticImageData } from "next/image";
import { Badge, Heading } from "tw-components";

const EXAMPLES = [
  {
    title: "Sign-in With Wallet",
    label: "sign-in-with-wallet",
    href: "https://github.com/thirdweb-example/login-with-wallet",
    image: require("/public/assets/product-pages/authentication/login-with-wallet.png"),
  },
  {
    title: "Stripe Subscriptions For Wallets",
    label: "stripe-subscriptions-for-wallets",
    href: "https://github.com/thirdweb-example/thirdweb-stripe",
    image: require("/public/assets/product-pages/authentication/stripe-subscriptions.png"),
  },
  {
    title: "Link Existing Accounts to Wallets",
    label: "link-existing-accounts-to-wallets",
    href: "",
    image: require("/public/assets/product-pages/authentication/link-accounts.png"),
  },
  {
    title: "Authenticate With Discord Bot",
    label: "authenticate-with-discord-bot",
    href: "",
    image: require("/public/assets/product-pages/authentication/discord-authentication.png"),
  },
];

interface ExampleItemProps {
  title: string;
  label: string;
  href: string;
  image: StaticImageData;
}

const ExampleItem: React.FC<ExampleItemProps> = ({
  title,
  label,
  href,
  image,
}) => {
  const { trackEvent } = useTrack();

  if (!href) {
    return (
      <Flex
        flexDir="column"
        position="relative"
        gap={4}
        flexGrow={0}
        mt={{ base: "36px", md: 0 }}
      >
        <ChakraNextImage alt={label} src={image} />
        <Badge
          alignSelf="center"
          borderRadius="md"
          position="absolute"
          top="-36px"
        >
          Coming Soon
        </Badge>
        <Heading textAlign="center" size="subtitle.md" maxW="100%">
          {title}
        </Heading>
      </Flex>
    );
  }

  return (
    <Flex as={LinkBox} role="group" flexDir="column" gap={4} flexGrow={0}>
      <ChakraNextImage
        alt={label}
        src={image}
        borderRadius="21px"
        _groupHover={{
          border: "1px solid #C5D8FF",
        }}
      />
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
