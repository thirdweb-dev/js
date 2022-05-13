import { Icon, IconButton, useColorMode } from "@chakra-ui/react";
import { FiMoon, FiSun } from "react-icons/fi";

export const ColorModeToggle: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      bg="transparent"
      aria-label="twitter"
      icon={<Icon boxSize="1rem" as={colorMode === "light" ? FiMoon : FiSun} />}
      onClick={() => toggleColorMode()}
    />
  );
};
