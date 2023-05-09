import { KeyFeatureLayout } from "./key-features/KeyFeatureLayout";
import { Box, SimpleGrid } from "@chakra-ui/react";
import { ReactNode } from "react";
import { Heading, Text, TrackedLink } from "tw-components";

interface FeatureCardProps {
  title: string;
  description: ReactNode;
}

const features: FeatureCardProps[] = [
  {
    title: "Permissionless.",
    description: (
      <>
        Anyone can use thirdweb tools without our permission. The code for our
        contracts, SDKs, dashboard and UI components are{" "}
        <TrackedLink
          color="white"
          fontWeight="500"
          category="values"
          label="open_source"
          isExternal
          href="https://github.com/thirdweb-dev"
        >
          open source
        </TrackedLink>{" "}
        and available to everyone.
      </>
    ),
  },

  {
    title: "Owned by you.",
    description:
      "Apps and contracts built with our tools are completely owned by you. No other parties have controls over your apps.",
  },

  {
    title: "No vendor lock-in.",
    description:
      "Our tools are fully composable. They are designed to allow developers to assemble and reassemble different parts of our tools and provide their own configurations.",
  },
];

const ValueCard: React.FC<FeatureCardProps> = ({ title, description }) => {
  return (
    <Box as="section">
      <Heading as="h3" fontSize="28px" mb={4} fontWeight={700}>
        {title}
      </Heading>

      <Text size="body.lg" lineHeight={1.7} color="#888">
        {description}
      </Text>
    </Box>
  );
};

export const ValuesSection: React.FC = () => {
  return (
    <KeyFeatureLayout
      title="Open"
      titleGradient="linear-gradient(70deg, #A3469D, #B799D5)"
      headline="True to web3."
      description=""
    >
      <SimpleGrid
        background={"rgba(0,0,0,0.2)"}
        boxShadow="0 0 0 1px hsl(0deg 0% 100% / 15%)"
        borderRadius="12px"
        columns={{ lg: 3, base: 1 }}
        gap={{ lg: 12, base: 12 }}
        p={{ base: 6, md: 8 }}
      >
        {features.map((feature) => (
          <ValueCard {...feature} key={feature.title} />
        ))}
      </SimpleGrid>
    </KeyFeatureLayout>
  );
};
