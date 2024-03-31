import { Flex, Icon, Tooltip, useClipboard, useToast } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { FiCopy } from "react-icons/fi";
import { Button, Card, Text } from "tw-components";
import { shortenString } from "utils/usedapp-external";

interface CopyApiKeyButtonProps {
  apiKey: string;
  label: string;
}

export const CopyApiKeyButton: React.FC<CopyApiKeyButtonProps> = ({
  apiKey,
  label,
}) => {
  const { onCopy } = useClipboard(apiKey);
  const trackEvent = useTrack();
  const toast = useToast();

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();

    onCopy();

    toast({
      variant: "solid",
      position: "bottom",
      title: `${label} copied.`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    trackEvent({
      category: "api_key_button",
      action: "copy",
      apiKey,
      label,
    });
  };

  return (
    <Flex gap={2} align="center">
      <Text fontFamily="mono">{shortenString(apiKey)}</Text>
      <Tooltip
        p={0}
        bg="transparent"
        boxShadow={"none"}
        label={
          <Card py={2} px={4} bgColor="backgroundHighlight">
            <Text size="label.sm">Copy Client ID to clipboard</Text>
          </Card>
        }
      >
        <Button size="sm" p={0} variant="ghost" onClick={handleCopy}>
          <Icon boxSize={3} as={FiCopy} />
        </Button>
      </Tooltip>
    </Flex>
  );
};
