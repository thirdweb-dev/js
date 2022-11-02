import { Flex, VStack } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { Heading, Link } from "tw-components";

export const Resources: React.FC = () => {
  const resources = [
    {
      label: "thirdweb sdk",
      link: "/",
      image: "/assets/hackathon/resources/resource1.png",
    },
    {
      label: "portal",
      link: "/",
      image: "/assets/hackathon/resources/resource1.png",
    },
    {
      label: "dashboard",
      link: "/",
      image: "/assets/hackathon/resources/resource1.png",
    },
    {
      label: "sdk",
      link: "/",
      image: "/assets/hackathon/resources/resource1.png",
    },
  ];

  return (
    <VStack mt={20}>
      <Heading fontSize={{ base: "32px", md: "48px" }}>
        Useful Resources
      </Heading>

      <Flex flexWrap="wrap" justify="space-between" align="center">
        {resources.map(({ label, link, image }) => (
          <Flex
            key={label}
            flexDir="column"
            align="center"
            justify="center"
            w={{ base: "40%", md: "25%" }}
            maxW="200px"
            h="200px"
            bg="#0000004D"
            borderRadius="10px"
            border="1px solid #FFFFFF12"
            m={4}
            p={4}
          >
            <ChakraNextImage width={175} height={135} src={image} alt={label} />
            <Link href={link} fontSize="20px" mt={4}>
              {label}
            </Link>
          </Flex>
        ))}
      </Flex>
    </VStack>
  );
};
