import { Box, BoxProps } from "@chakra-ui/react";

interface AuroraProps {
  zIndex?: BoxProps["zIndex"];
  size: { width: string; height: string };
  pos: { top: string; left: string };
  color: string;
}

export const Aurora: React.FC<AuroraProps> = ({ zIndex, color, pos, size }) => {
  return (
    <Box
      pointerEvents={"none"}
      width={size.width}
      height={size.height}
      position="absolute"
      top={pos.top}
      left={pos.left}
      transform="translate(-50%, -50%)"
      backgroundImage={`radial-gradient(ellipse at center, ${color}, transparent 60%)`}
      zIndex={zIndex || -1}
    ></Box>
  );
};
