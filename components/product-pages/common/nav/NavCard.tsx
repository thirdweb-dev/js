import { Box, Flex, Icon, Stack } from "@chakra-ui/react";
import { IconType } from "@react-icons/all-files";
import { ChakraNextImage } from "components/Image";
import { StaticImageData } from "next/image";
import { Text, TrackedLink } from "tw-components";

export interface NavCardProps {
  name: string;
  label: string;
  description: string;
  link: string;
  icon?: StaticImageData;
  iconType?: IconType;
  comingSoon?: boolean;
}

export const NavCard: React.FC<NavCardProps> = ({
  name,
  description,
  label,
  link,
  icon,
  iconType,
  comingSoon,
}) => {
  return (
    <TrackedLink
      href={link}
      category="topnav"
      label={label}
      textDecor="none !important"
      isExternal={link.startsWith("http")}
      pointerEvents={comingSoon ? "none" : "auto"}
    >
      <Box _hover={{ bg: "whiteAlpha.50" }} p="8px" borderRadius="md">
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
    </TrackedLink>
  );
};
