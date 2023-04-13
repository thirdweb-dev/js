import { GuideCard } from "./GuideCard";
import { ProductSection } from "./ProductSection";
import { Flex, Icon, SimpleGrid } from "@chakra-ui/react";
import { FiArrowRight } from "react-icons/fi";
import { Heading, TrackedLink, TrackedLinkProps } from "tw-components";

type BlogPost = {
  title: string;
  image: string;
  link: string;
};

interface GuidesShowcaseProps {
  title: string;
  description: string;
  solution?: string;
  category: TrackedLinkProps["category"];
  guides: BlogPost[];
  caseStudies?: true;
}

export const GuidesShowcase: React.FC<GuidesShowcaseProps> = ({
  title,
  description,
  solution,
  guides,
  caseStudies,
  category,
}) => {
  return (
    <ProductSection>
      <Flex flexDir="column" py={16} align="center" gap={{ base: 6, lg: 8 }}>
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
        <Flex direction="column" gap={3}>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
            {guides.map(({ title: guideTitle, image, link }, idx) => (
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
                link={link}
              />
            ))}
          </SimpleGrid>
        </Flex>
        {solution && (
          <TrackedLink
            href={`https://blog.thirdweb.com/tag/${
              caseStudies ? "case-study" : solution.toLowerCase()
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
    </ProductSection>
  );
};
