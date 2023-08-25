import { Box, Flex, Icon, Stack } from "@chakra-ui/react";
import { IconType } from "@react-icons/all-files";
import { ChakraNextImage } from "components/Image";
import { StaticImageData } from "next/image";
import { Text } from "tw-components";

export interface ProductNavCardProps {
  name: string;
  description: string;
  href?: string;
  icon?: StaticImageData;
  iconType?: IconType;
  comingSoon?: boolean;
  selected: boolean;
}

export const ProductNavCard: React.FC<ProductNavCardProps> = ({
  name,
  description,
  icon,
  iconType,
  comingSoon,
  selected,
}) => {
  return (
    <Box
      bgColor={selected ? "whiteAlpha.50" : "inherit"}
      _hover={{ bg: "whiteAlpha.50" }}
      p={6}
      cursor="default"
    >
      <Stack direction="row" align="center" spacing={3}>
        {icon && (
          <ChakraNextImage boxSize={7} mb="-4px" src={icon} alt="icon" />
        )}
        {iconType && (
          <Icon
            as={iconType}
            color={comingSoon ? "whiteAlpha.400" : "white"}
            boxSize={6}
            mr={2}
          />
        )}
        <Flex direction="column">
          <Text
            fontWeight="bold"
            color={comingSoon ? "whiteAlpha.400" : "white"}
          >
            {name} {comingSoon && "(coming soon)"}
          </Text>
          <Text color="whiteAlpha.500">{description}</Text>
        </Flex>
      </Stack>
    </Box>
  );
};
