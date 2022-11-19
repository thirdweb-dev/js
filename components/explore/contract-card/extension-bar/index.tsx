import { PublishedContract } from "..";
import { Box, Flex, Tooltip } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import React from "react";
import { Card, Heading } from "tw-components";

const extensionColors = {
  ERC721: "green",
  ERC20: "yellow",
  ERC1155: "purple",
  OTHER: "blue",
} as const;

function getColorForExtension(
  extension: PublishedContract["extensions"][number],
) {
  if (extension.name.startsWith("ERC721")) {
    return extensionColors.ERC721;
  }
  if (extension.name.startsWith("ERC20")) {
    return extensionColors.ERC20;
  }
  if (extension.name.startsWith("ERC1155")) {
    return extensionColors.ERC1155;
  }
  return extensionColors.OTHER;
}

interface ExtensionBarProps {
  extensions: PublishedContract["extensions"];
}
export const ExtensionBar: React.FC<ExtensionBarProps> = ({ extensions }) => {
  const track = useTrack();
  return (
    <Flex h="5px" bg="accent.100" w="100%" position="relative">
      {extensions.length ? (
        extensions.map((extension, idx) => {
          const color = getColorForExtension(extension);
          return (
            <Tooltip
              bg="transparent"
              boxShadow="none"
              p={0}
              w="auto"
              key={extension.name}
              label={
                <Card w="auto" py={2}>
                  <Heading as="label" size="label.sm">
                    {extension.name}
                  </Heading>
                </Card>
              }
            >
              <Box
                cursor="pointer"
                position="absolute"
                left={`${(idx / extensions.length) * 100}%`}
                w={`${100 / extensions.length}%`}
                flexGrow={1}
                flexShrink={1}
                h="100%"
                bottom={0}
                transition="all 0.2s"
                borderLeft="1px solid"
                borderRight="1px solid"
                _light={{
                  borderColor: "white",
                }}
                _dark={{
                  borderColor: "black",
                }}
                _hover={{
                  h: "8px",
                  borderTopRadius: "xs",
                }}
                bg={`${color}.300`}
                onClick={() => {
                  track({
                    category: "extemsion_bar",
                    action: "click",
                    label: extension.name,
                  });
                  window.open(
                    `https://portal.thirdweb.com/contracts/${extension.docLinks.contracts}`,
                    "_blank",
                  );
                }}
              />
            </Tooltip>
          );
        })
      ) : (
        <Tooltip
          bg="transparent"
          boxShadow="none"
          p={0}
          w="auto"
          label={
            <Card w="auto" py={2}>
              <Heading as="label" size="label.sm">
                No extensions detected
              </Heading>
            </Card>
          }
        >
          <Box
            cursor="pointer"
            borderRadius="md"
            position="absolute"
            w="100%"
            flexGrow={1}
            flexShrink={1}
            h="100%"
            bottom={0}
            bg="accent.100"
            transition="all 0.2s ease-in-out"
            _hover={{
              h: "10px",
            }}
          />
        </Tooltip>
      )}
    </Flex>
  );
};
