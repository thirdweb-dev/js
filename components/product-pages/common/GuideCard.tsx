import { Flex, Image, Link } from "@chakra-ui/react";
import { Heading } from "tw-components";

interface GuideCardProps {
  image: string;
  title: string;
  link: string;
}

export const GuideCard: React.FC<GuideCardProps> = ({ image, title, link }) => {
  return (
    <Link href={link} isExternal textDecor="none !important">
      <Flex
        direction="column"
        borderRadius="2xl"
        border="1px solid"
        borderColor="#ffffff26"
        minH="320px"
        _hover={{ opacity: 0.86 }}
      >
        <Image alt="" borderTopRadius="2xl" src={image} w="100%" />
        <Flex
          flexGrow={1}
          flexDir="column"
          justifyContent="space-between"
          p={8}
          gap={4}
          bgColor="blackAlpha.300"
          borderBottomRadius="2xl"
        >
          <Heading size="title.sm">{title}</Heading>
        </Flex>
      </Flex>
    </Link>
  );
};
