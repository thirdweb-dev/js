import { Flex, Icon, SimpleGrid } from "@chakra-ui/react";
import { GuideCard } from "components/product-pages/common/GuideCard";
import { FiArrowRight } from "react-icons/fi";
import { Heading, TrackedLink, TrackedLinkProps } from "tw-components";

type BlogPost = {
  title: string;
  description?: string;
  image: string;
  link: string;
};

interface LandingGuidesShowcaseProps {
  title: string;
  description: string;
  solution?: string;
  category: TrackedLinkProps["category"];
  guides: BlogPost[];
  caseStudies?: true;
  py?: number;
  customSolution?: string;
  customSolutionHref?: string;
}

export const LandingGuidesShowcase: React.FC<LandingGuidesShowcaseProps> = ({
  title,
  description,
  solution,
  guides,
  caseStudies,
  category,
  customSolution,
  customSolutionHref,
  py = 16,
}) => {
  return (
    <Flex flexDir="column" py={py} align="center" gap={{ base: 6, lg: 8 }}>
      <Flex flexDir="column" gap={2} alignItems="center">
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
      </Flex>
      <Flex direction="column" gap={3}>
        <SimpleGrid
          columns={{ base: 1, md: 3 }}
          gap={6}
          justifyContent={guides.length <= 2 ? "center" : undefined}
        >
          {guides.map(
            (
              { title: guideTitle, description: guideDescription, image, link },
              idx,
            ) => (
              <GuideCard
                category={category}
                label="guide"
                trackingProps={{
                  guide: guideTitle.replaceAll(" ", "_").toLowerCase(),
                }}
                index={idx}
                key={guideTitle}
                image={image}
                title={guideTitle}
                description={guideDescription || ""}
                link={link}
              />
            ),
          )}
        </SimpleGrid>
      </Flex>
      {customSolution && customSolutionHref && (
        <TrackedLink
          href={customSolutionHref}
          category={category}
          label="see-all-guides"
          isExternal
        >
          <Flex align="center" gap={2}>
            <Heading
              fontSize="20px"
              fontWeight="medium"
              as="p"
              lineHeight={{ base: 1.5, md: undefined }}
              position="relative"
            >
              {customSolution}
            </Heading>
            <Icon as={FiArrowRight} />
          </Flex>
        </TrackedLink>
      )}

      {solution && (
        <TrackedLink
          href={`https://blog.thirdweb.com/tag/${
            caseStudies
              ? "case-study"
              : solution.toLowerCase().replace(" ", "-")
          }/`}
          category={category}
          label="see-all-guides"
          isExternal
        >
          <Flex align="center" gap={2}>
            <Heading
              fontSize="20px"
              fontWeight="medium"
              as="p"
              lineHeight={{ base: 1.5, md: undefined }}
              position="relative"
            >
              See all of our {solution.replace("-", " ")}{" "}
              {caseStudies ? "case studies" : "guides"}
            </Heading>
            <Icon as={FiArrowRight} />
          </Flex>
        </TrackedLink>
      )}
    </Flex>
  );
};
