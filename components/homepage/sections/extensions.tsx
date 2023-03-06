import { KeyFeatureLayout } from "./key-features/KeyFeatureLayout";
import { AspectRatio, Box, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export const ExtensionsSection: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [mode, setMode] = useState<"erc721" | "permission">("erc721");

  useEffect(() => {
    if (isHovering) {
      return;
    }
    const int = setInterval(() => {
      setMode((prevMode) => (prevMode === "erc721" ? "permission" : "erc721"));
    }, 2500);
    return () => {
      clearInterval(int);
    };
  }, [isHovering]);

  return (
    <>
      <KeyFeatureLayout
        title="Extensions"
        titleGradient="linear-gradient(246.04deg, #3385FF 9.81%, #91B7F0 76.17%, #95BBF2 93.64%)"
        headline="Contract-driven framework."
        description="Our framework detects standards and common patterns in your
            contracts to unlock smarter SDKs, custom admin dashboards, and
            tailored data feeds."
      >
        <AspectRatio ratio={915 / 589} w="full">
          <Box
            onMouseOver={() => {
              setIsHovering(true);
            }}
            onMouseOut={() => {
              setIsHovering(false);
            }}
          >
            <Image
              opacity={mode === "erc721" ? 1 : 0}
              transition="opacity 0.5s ease-in-out"
              position="absolute"
              top={0}
              left={0}
              src="/assets/landingpage/extensions-erc721.png"
              alt="ERC721 extension"
              w="full"
              h="full"
              objectFit="contain"
            />
            <Image
              opacity={mode === "permission" ? 1 : 0}
              transition="opacity 0.5s ease-in-out"
              position="absolute"
              top={0}
              left={0}
              src="/assets/landingpage/extensions-permission.png"
              alt="ERC721 extension"
              w="full"
              h="full"
              objectFit="contain"
            />
          </Box>
        </AspectRatio>
      </KeyFeatureLayout>
    </>
  );
};
