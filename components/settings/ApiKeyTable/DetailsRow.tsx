import { HStack, Icon, Tooltip, VStack } from "@chakra-ui/react";
import { FiHelpCircle } from "react-icons/fi";
import { Card, Heading, Text } from "tw-components";

interface ApiKeyDetailsRowProps {
  title: string;
  content: string | JSX.Element | undefined;
  tooltip?: string;
  description?: string;
}

export const ApiKeyDetailsRow: React.FC<ApiKeyDetailsRowProps> = ({
  title,
  content,
  tooltip,
  description,
}) => {
  if (!content) {
    return null;
  }

  const innerContent = (
    <HStack>
      <Heading as="label" size="label.md">
        {title}
      </Heading>
      {tooltip && <Icon as={FiHelpCircle} />}
    </HStack>
  );

  return (
    <VStack gap={2} alignItems="flex-start" w="full">
      {tooltip ? (
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
          {innerContent}
        </Tooltip>
      ) : (
        innerContent
      )}
      {description && <Text size="body.md">{description}</Text>}
      {typeof content === "string" ? <Text>{content}</Text> : content}
    </VStack>
  );
};
