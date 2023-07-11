import { HStack, Icon, Tooltip, VStack } from "@chakra-ui/react";
import { FiHelpCircle } from "react-icons/fi";
import { Card, Text } from "tw-components";

interface ApiKeyDetailsRowProps {
  title: string;
  content: string | JSX.Element | undefined;
  tooltip?: string;
}

export const ApiKeyDetailsRow: React.FC<ApiKeyDetailsRowProps> = ({
  title,
  content,
  tooltip,
}) => {
  if (!content) {
    return null;
  }

  return (
    <VStack gap={2} alignItems="flex-start" w="full">
      <Tooltip
        label={
          <Card py={2} px={4} bgColor="backgroundHighlight">
            <Text fontSize="small" lineHeight={6}>
              {tooltip}
            </Text>
          </Card>
        }
        isDisabled={!tooltip}
        p={0}
        bg="transparent"
        boxShadow="none"
      >
        <HStack>
          <Text as="label" size="label.md" color="faded">
            {title}
          </Text>
          {tooltip && <Icon color="faded" as={FiHelpCircle} />}
        </HStack>
      </Tooltip>
      {typeof content === "string" ? <Text>{content}</Text> : content}
    </VStack>
  );
};
