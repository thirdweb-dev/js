import { Box } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";
import { Text, TrackedLink } from "tw-components";
import type { SectionItemProps, SectionProps } from "./types";

export const NavCard: React.FC<SectionItemProps | SectionProps> = ({
  name,
  description,
  label,
  link,
  icon,
  comingSoon,
}) => {
  return (
    <TrackedLink
      href={link ?? "/"}
      category="topnav"
      label={label}
      textDecor="none !important"
      isExternal={typeof link === "string" && link.startsWith("http")}
      pointerEvents={comingSoon ? "none" : "auto"}
    >
      <Box _hover={{ bg: "whiteAlpha.50" }} p="8px" borderRadius="md">
        <div className="flex flex-row items-center gap-4">
          {icon && (
            <ChakraNextImage boxSize={7} mb="-4px" src={icon} alt="icon" />
          )}
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
    </TrackedLink>
  );
};
