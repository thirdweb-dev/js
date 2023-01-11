import { Box } from "@chakra-ui/react";

interface AuroraProps {
  size: { width: string; height: string };
  pos: { top: string; left: string };
  color: string;
}

export const Aurora: React.FC<AuroraProps> = ({ color, pos, size }) => {
  return (
    <Box
      pointerEvents={"none"}
      width={size.width}
      height={size.height}
      position="absolute"
      zIndex={-1}
      top={pos.top}
      left={pos.left}
      transform="translate(-50%, -50%)"
      backgroundImage={`radial-gradient(ellipse at center, ${color}, transparent 60%)`}
    ></Box>
  );
};
