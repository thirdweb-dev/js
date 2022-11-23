import { Icon, IconButton, useColorMode } from "@chakra-ui/react";
import { FiMoon, FiSun } from "react-icons/fi";

export const ColorModeToggle: React.FC = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <IconButton
      bg="transparent"
      size="sm"
      aria-label="toggle-color"
      icon={<Icon as={colorMode === "light" ? FiMoon : FiSun} />}
      onClick={() => toggleColorMode()}
    />
  );
};
