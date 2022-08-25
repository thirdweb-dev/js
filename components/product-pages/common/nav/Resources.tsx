import { Box, Fade, Flex, Stack, useDisclosure } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { StaticImageData } from "next/image";
import { Card, Text, TrackedLink } from "tw-components";

interface IResource {
  name: string;
  label: string;
  description: string;
  link: string;
  icon: StaticImageData;
}

export const RESOURCES: IResource[] = [
  {
    name: "About",
    label: "about",
    description: "Learn more about our company",
    link: "/about",
    icon: require("public/assets/tw-icons/general.png"),
  },
  {
    name: "Docs",
    label: "docs",
    description: "Complete thirdweb documentation",
    link: "https://portal.thirdweb.com",
    icon: require("public/assets/tw-icons/pack.png"),
  },
  {
    name: "Guides",
    label: "guides",
    description: "Learn how to build with thirdweb",
    link: "https://portal.thirdweb.com/guides",
    icon: require("public/assets/tw-icons/edition.png"),
  },
  {
    name: "Blog",
    label: "blog",
    description: "Our latest news and updates",
    link: "https://blog.thirdweb.com",
    icon: require("public/assets/tw-icons/datastore.png"),
  },
];

export const Resources: React.FC = () => {
  const { onOpen, isOpen, onClose } = useDisclosure();

  return (
    <Box onMouseEnter={onOpen} onMouseLeave={onClose}>
      <Text
        color="white"
        fontWeight="bold"
        fontSize="16px"
        cursor="pointer"
        py={3}
        opacity={isOpen ? 0.8 : 1}
        transition="opacity 0.1s"
      >
        Resources
      </Text>

      <Box position="relative">
        <Fade in={isOpen}>
          <Card
            pointerEvents={isOpen ? "all" : "none"}
            p="20px"
            onMouseEnter={onOpen}
            position="absolute"
            top={0}
            left="-124px"
            borderColor="whiteAlpha.100"
            bg="black"
            borderWidth="2px"
          >
            <Flex>
              <Stack width="300px">
                {RESOURCES.map((resource, id) => (
                  <Resource key={id} {...resource} />
                ))}
              </Stack>
            </Flex>
          </Card>
        </Fade>
      </Box>
    </Box>
  );
};

const Resource: React.FC<IResource> = ({
  name,
  description,
  label,
  link,
  icon,
}) => {
  return (
    <TrackedLink
      href={link}
      category="topnav"
      label={label}
      textDecor="none !important"
      isExternal
    >
      <Box _hover={{ bg: "whiteAlpha.50" }} p="8px" borderRadius="md">
        <Stack direction="row" align="center" spacing={3}>
          <ChakraNextImage boxSize={6} mb="-4px" src={icon} alt="icon" />
          <Flex direction="column">
            <Text fontWeight="bold" color="white">
              {name}
            </Text>
            <Text color="whiteAlpha.500">{description}</Text>
          </Flex>
        </Stack>
      </Box>
    </TrackedLink>
  );
};
