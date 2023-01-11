import { AspectRatio, useBreakpointValue } from "@chakra-ui/react";
import { ChakraNextImage } from "components/Image";

export const MultiChainSVG: React.FC = () => {
  const src =
    useBreakpointValue({
      base: "mobile",
      md: "desktop",
    }) || "desktop";
  return (
    <AspectRatio ratio={{ base: 386 / 709, md: 947 / 711 }} w="100%">
      <ChakraNextImage
        alt=""
        placeholder="empty"
        src={require(`./multi-chain/${src}-gray.svg`)}
      />
    </AspectRatio>
  );
};
