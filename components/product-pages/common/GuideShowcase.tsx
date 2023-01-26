import { GuideCard } from "./GuideCard";
import { ProductSection } from "./ProductSection";
import { Flex, Icon, LightMode, SimpleGrid, Switch } from "@chakra-ui/react";
import { AnimatePresence } from "framer-motion";
import { useMemo, useState } from "react";
import { FiArrowRight } from "react-icons/fi";
import { Heading, TrackedLink } from "tw-components";

type BlogPost = {
  title: string;
  image: string;
  link: string;
};

interface GuidesShowcaseProps {
  title: string;
  description: string;
  solution?: string;
  guides: BlogPost[];
  caseStudies?: BlogPost[];
}

export const GuidesShowcase: React.FC<GuidesShowcaseProps> = ({
  title,
  description,
  solution,
  guides,
  caseStudies,
}) => {
  const [mode, setMode] = useState<"guides" | "case-studies">("guides");

  const renderData = useMemo(() => {
    if (mode === "case-studies" && caseStudies) {
      return caseStudies;
    }
    return guides;
  }, [caseStudies, guides, mode]);

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
          {caseStudies?.length ? (
            <Flex align="center" ml="auto" gap={2}>
              <Heading size="label.md" as="label">
                Guides
              </Heading>
              <LightMode>
                <Switch
                  isChecked={mode === "case-studies"}
                  onChange={() => {
                    setMode((prevMode) =>
                      prevMode === "case-studies" ? "guides" : "case-studies",
                    );
                  }}
                  colorScheme="purple"
                />
              </LightMode>
              <Heading size="label.md" as="label">
                Case Studies
              </Heading>
            </Flex>
          ) : null}
          <AnimatePresence initial>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={6}>
              {renderData.map(({ title: guideTitle, image, link }, idx) => (
                <GuideCard
                  index={idx}
                  key={guideTitle}
                  image={image}
                  title={guideTitle}
                  link={link}
                />
              ))}
            </SimpleGrid>
          </AnimatePresence>
        </Flex>
        {solution && (
          <TrackedLink
            href={`https://blog.thirdweb.com/tag/${
              mode === "case-studies" ? "case-study" : solution.toLowerCase()
            }/`}
            category={solution.toLowerCase()}
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
                {mode === "case-studies" ? "case studies" : "guides"}
              </Heading>
              <Icon as={FiArrowRight} />
            </Flex>
          </TrackedLink>
        )}
      </Flex>
    </ProductSection>
  );
};
