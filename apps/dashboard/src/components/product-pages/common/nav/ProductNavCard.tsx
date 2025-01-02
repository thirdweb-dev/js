import { Box } from "@chakra-ui/react";
import type { StaticImageData } from "next/image";
import { Text } from "tw-components";

interface ProductSectionItemProps {
  name: string;
  description: string;
  href?: string;
  icon?: StaticImageData;
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
      <div className="flex flex-row items-center gap-3">
        <div className="flex flex-col">
          <Text
            fontWeight="bold"
            color={comingSoon ? "whiteAlpha.400" : "white"}
          >
            {name} {comingSoon && "(coming soon)"}
          </Text>
          <Text color="whiteAlpha.500">{description}</Text>
        </div>
      </div>
    </Box>
  );
};
