import { AspectRatio, AspectRatioProps, Box } from "@chakra-ui/layout";
import { useBreakpointValue } from "@chakra-ui/media-query";
import React from "react";

export const StaticGradient: React.FC<
  Omit<AspectRatioProps, "ratio"> & { hero?: true }
> = ({ ...props }) => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  return (
    <AspectRatio ratio={1298 / 468} {...props}>
      <Box
        overflow="visible!important"
        bg="linear-gradient(180deg, #0098EE 0%, #FF1CCD 140.5%)"
        opacity={[0.5, 0.5, 0.2]}
        filter={isMobile ? "blur(100px)" : "blur(200px)"}
        borderRadius="full"
      ></Box>
    </AspectRatio>
  );
};
