import { Flex } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { StaticImageData } from "next/image";
import { Text } from "tw-components";
import { ComponentWithChildren } from "types/component-with-children";

interface AmbassadorProps {
  icon: StaticImageData;
}

export const AmbassadorCard: ComponentWithChildren<AmbassadorProps> = ({
  icon,
  children,
}) => {
  return (
    <Flex
      direction="column"
      bg="rgba(255, 255, 255, 0.05)"
      border="1px solid rgba(255, 255, 255, 0.05)"
      borderRadius={4}
      padding="24px"
      justify="center"
      align="center"
      w="100%"
      maxW={357}
      height={280}
    >
      <ChakraNextImage
        src={icon}
        alt=""
        priority
        style={{
          width: "101px",
          height: "91px",
        }}
      />
      <Flex
        direction={"column"}
        mt="16px"
        color="paragraph"
        lineHeight={1.6}
        textAlign="center"
      >
        <Text size="body.lg">{children}</Text>
      </Flex>
    </Flex>
  );
};
