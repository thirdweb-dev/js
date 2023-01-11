import { Aurora } from "../Aurora";
import { Box, Image, SimpleGrid } from "@chakra-ui/react";
import { HomepageSection } from "components/product-pages/homepage/HomepageSection";
import { ReactNode } from "react";
import { Heading, Text, TrackedLink } from "tw-components";

interface FeatureCardProps {
  title: string;
  description: ReactNode;
  img: string;
}

const features: FeatureCardProps[] = [
  {
    title: "Build.",
    description: (
      <>
        Build your own contracts with{" "}
        <TrackedLink
          category="docs"
          color="white"
          label="contractkit"
          isExternal
          href="https://portal.thirdweb.com/contractkit"
        >
          ContractKit
        </TrackedLink>{" "}
        or discover ready-to-deploy contracts in{" "}
        <TrackedLink
          color="white"
          category="dashboard"
          label="explore"
          isExternal
          href="https://thirdweb.com/explore"
        >
          Explore
        </TrackedLink>
        . Integrate web3 into your apps and games easily with our{" "}
        <TrackedLink
          color="white"
          category="docs"
          label="sdk"
          isExternal
          href="https://portal.thirdweb.com/sdk"
        >
          SDKs
        </TrackedLink>
        {"."}
      </>
    ),
    img: "/assets/landingpage/icons/Build2.svg",
  },

  {
    title: "Launch.",
    description: (
      <>
        Ship your contracts on-chain easily with{" "}
        <TrackedLink
          color="white"
          category="docs"
          label="deploy"
          isExternal
          href="https://portal.thirdweb.com/deploy"
        >
          Deploy
        </TrackedLink>
        , a deployment workflow designed for team collaboration. Publish
        contracts with{" "}
        <TrackedLink
          category="docs"
          label="release"
          color="white"
          isExternal
          href="https://portal.thirdweb.com/release"
        >
          Release
        </TrackedLink>{" "}
        and be discovered by 70k+ web3 devs.
      </>
    ),
    img: "/assets/landingpage/icons/rocket.svg",
  },

  {
    title: "Manage.",
    description: (
      <>
        Monitor, interact and configure your contracts directly from the{" "}
        <TrackedLink
          color="white"
          category="dashboard"
          label="dashboard"
          isExternal
          href="https://thirdweb.com/dashboard"
        >
          Dashboard
        </TrackedLink>
        . Invite your team to collaborate and control their access with
        permissions.
      </>
    ),
    img: "/assets/landingpage/icons/Dashboard.svg",
  },
];

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  img,
}) => {
  return (
    <Box
      zIndex={10}
      as="section"
      background="rgba(0,0,0,0.4)"
      boxShadow="0 0 1px 1px hsl(0deg 0% 100% / 15%)"
      p={8}
      borderRadius="8px"
    >
      <Box
        mb={8}
        p={3}
        background="hsl(0deg 0% 100% / 4%)"
        borderRadius={8}
        boxShadow="0 0 0px 1px hsl(0deg 0% 100% / 15%)"
        display="inline-block"
      >
        <Image src={img} alt="" width={6} />
      </Box>
      <Heading
        as="h3"
        fontSize={{ base: "24px", md: "32px" }}
        fontWeight={700}
        letterSpacing="-0.02em"
        mb={4}
        bg="linear-gradient(296deg,#ffffff,#eee)"
        bgClip={"text"}
      >
        {title}
      </Heading>

      <Text size="body.lg" lineHeight={1.7} color="whiteAlpha.600">
        {description}
      </Text>
    </Box>
  );
};

export const KeyFeatures: React.FC = () => {
  return (
    <HomepageSection my={20}>
      <Aurora
        pos={{ left: "50%", top: "20%" }}
        size={{ width: "2600px", height: "1800px" }}
        color="hsl(290deg 92% 54% / 10%)"
      />

      <Heading
        as="h3"
        fontSize={{ base: "32px", md: "48px" }}
        lineHeight={1.1}
        mb={{ base: 10, md: 16 }}
        textAlign="center"
        letterSpacing={"-0.04em"}
      >
        Building for web3
        <br />
        has never been easier.
      </Heading>
      <SimpleGrid columns={{ md: 3, base: 1 }} gap={6}>
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </SimpleGrid>
    </HomepageSection>
  );
};
