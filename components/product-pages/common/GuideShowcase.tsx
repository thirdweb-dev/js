import { GuideCard } from "./GuideCard";
import { ProductSection } from "./ProductSection";
import { Flex, HStack, Icon, SimpleGrid } from "@chakra-ui/react";
import { FiArrowRight } from "react-icons/fi";
import { Heading, TrackedLink } from "tw-components";

interface GuidesShowcaseProps {
  title: string;
  description: string;
  solution: string;
  guides: {
    title: string;
    image: string;
    link: string;
  }[];
}

export const GuidesShowcase: React.FC<GuidesShowcaseProps> = ({
  title,
  description,
  solution,
  guides,
}) => {
  return (
    <ProductSection>
      <Flex
        flexDir="column"
        py={{ base: 24, lg: 36 }}
        align="center"
        gap={{ base: 6, lg: 8 }}
      >
        <Heading as="h2" size="display.sm" fontWeight={700} textAlign="center">
          {title}
        </Heading>
        <Heading
          as="h3"
          maxW="820px"
          textAlign="center"
          color="whiteAlpha.600"
          size="subtitle.md"
        >
          {description}
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
          {guides.map(({ title: guideTitle, image, link }) => (
            <GuideCard
              key={guideTitle}
              image={image}
              title={guideTitle}
              link={link}
            />
          ))}
        </SimpleGrid>
        <TrackedLink
          href={`https://blog.thirdweb.com/tag/${solution.toLowerCase()}/`}
          category={solution.toLowerCase()}
          label="see-all-guides"
          isExternal
        >
          <HStack>
            <Heading
              fontSize="20px"
              fontWeight="medium"
              as="p"
              lineHeight={{ base: 1.5, md: undefined }}
            >
              See all of our {solution} guides
            </Heading>
            <Icon as={FiArrowRight} />
          </HStack>
        </TrackedLink>
      </Flex>
    </ProductSection>
  );
};
