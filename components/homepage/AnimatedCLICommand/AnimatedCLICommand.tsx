import { Icon, IconButton, useClipboard } from "@chakra-ui/react";
import { IoMdCheckmark } from "@react-icons/all-files/io/IoMdCheckmark";
import { useTrack } from "hooks/analytics/useTrack";

import { FiCopy } from "react-icons/fi";

export const CopyButton: React.FC<{ text: string }> = ({ text }) => {
  const { onCopy, hasCopied } = useClipboard(text);
  const trackEvent = useTrack();
  return (
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
  );
};
