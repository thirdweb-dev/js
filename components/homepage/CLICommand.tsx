import { Flex, Icon, IconButton, useClipboard } from "@chakra-ui/react";
import { IoMdCheckmark } from "@react-icons/all-files/io/IoMdCheckmark";
import { useTrack } from "hooks/analytics/useTrack";
import { FiCopy } from "react-icons/fi";
import { Text } from "tw-components";

interface CLICommandProps {
  text: string;
}

/**
 * Component to display a CLI command which can be copied to the clipboard
 */
export const CLICommand: React.FC<CLICommandProps> = ({ text }) => {
  const { onCopy, hasCopied } = useClipboard(text);
  const trackEvent = useTrack();

  return (
    <Flex
      background="rgba(255, 255, 255, 0.08)"
      border="1px solid rgba(255, 255, 255, 0.2)"
      pl="28px"
      pr="14px"
      borderRadius="md"
      h="68px"
      minW={{ base: "100%", lg: "240px" }}
      gap={4}
      align="center"
      alignSelf="start"
    >
      <Text
        color="white"
        fontFamily="mono"
        fontSize="18px"
        fontWeight="500"
        whiteSpace="nowrap"
      >
        $ {text}
      </Text>
      <IconButton
        ml="auto"
        borderRadius="md"
        variant="ghost"
        colorScheme="whiteAlpha"
        size="sm"
        aria-label="Copy npx command"
        onClick={() => {
          onCopy();
          trackEvent({
            category: "hero-section",
            action: "copy",
            label: "npx command",
          });
        }}
        icon={
          <Icon
            as={hasCopied ? IoMdCheckmark : FiCopy}
            fill={hasCopied ? "green.500" : undefined}
          />
        }
      />
    </Flex>
  );
};
