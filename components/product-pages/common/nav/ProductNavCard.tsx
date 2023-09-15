import { Box, Flex, Stack } from "@chakra-ui/react";
import { IconType } from "@react-icons/all-files";
import { StaticImageData } from "next/image";
import { Text } from "tw-components";

export interface ProductSectionItemProps {
  name: string;
  description: string;
  href?: string;
  icon?: StaticImageData;
  iconType?: IconType;
  comingSoon?: boolean;
  selected: boolean;
}

export const ProductNavCard: React.FC<ProductSectionItemProps> = ({
  name,
  description,
  comingSoon,
  selected,
}) => {
  return (
    <Box
      bgColor={selected ? "#0E0F11" : "inherit"}
      _hover={{ bg: "#0E0F11" }}
      p={6}
      cursor="default"
    >
      <Stack direction="row" align="center" spacing={3}>
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
