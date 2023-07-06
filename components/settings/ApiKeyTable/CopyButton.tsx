import { Flex, Icon, Tooltip, useClipboard, useToast } from "@chakra-ui/react";
import { useTrack } from "hooks/analytics/useTrack";
import { FiCopy } from "react-icons/fi";
import { Button, Card, Text } from "tw-components";

interface CopyApiKeyButtonProps {
  apiKey: string;
}

export const CopyApiKeyButton: React.FC<CopyApiKeyButtonProps> = ({
  apiKey,
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
      title: `API key copied.`,
      status: "success",
      duration: 5000,
      isClosable: true,
    });

    trackEvent({
      category: "api_key_button",
      action: "copy",
      apiKey,
    });
  };

  return (
    <Flex gap={2} align="center">
      <Text fontFamily="mono">
        {apiKey.substring(0, 12)}...{apiKey.substring(apiKey.length - 12)}
      </Text>
      <Tooltip
        p={0}
        bg="transparent"
        boxShadow={"none"}
        label={
          <Card py={2} px={4} bgColor="backgroundHighlight">
            <Text size="label.sm">Copy API key to clipboard</Text>
          </Card>
        }
      >
        <Button size="sm" p={0} variant="ghost" onClick={handleCopy}>
          <Icon boxSize={3} as={FiCopy} color="blue.500" />
        </Button>
      </Tooltip>
    </Flex>
  );
};
