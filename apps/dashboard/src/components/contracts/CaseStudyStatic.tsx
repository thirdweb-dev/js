import { Flex } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import type { StaticImageData } from "next/image";
import type { ReactNode } from "react";
import { Heading, Text, TrackedLink } from "tw-components";

export interface CaseStudyStaticProps {
  title: ReactNode;
  description: string;
  image: StaticImageData;
  label: string;
  href: string;
  TRACKING_CATEGORY: string;
}

const CaseStudyStatic = ({
  image,
  title,
  description,
  label,
  href,
  TRACKING_CATEGORY,
}: CaseStudyStaticProps) => {
  return (
    <TrackedLink
      href={href}
      category={TRACKING_CATEGORY}
      label={label}
      textDecoration="none"
      _hover={{ textDecoration: "none" }}
      userSelect="none"
    >
      <Flex
        flexDir="column"
        borderRadius="8px"
        border="1px solid #26282F"
        minW="341px"
        w="341px"
        borderColor="borderColor"
        transition="border-color 200ms ease, box-shadow 200ms ease, transform 200ms ease"
        _hover={{
          borderColor: "blue.500",
          boxShadow: "0 0 16px hsl(215deg 100% 60% / 30%)",
          transform: "scale(1.01)",
        }}
        h="full"
      >
        <ChakraNextImage
          src={image}
          borderTopLeftRadius="8px"
          borderTopRightRadius="8px"
          alt=""
        />

        <Flex gap="16px" flexDir="column" padding="36px">
          <Heading size="title.md" fontWeight={500}>
            {title}
          </Heading>

          <Text fontSize="16px" mt="8px">
            {description}
          </Text>
        </Flex>
      </Flex>
    </TrackedLink>
  );
};

export default CaseStudyStatic;
