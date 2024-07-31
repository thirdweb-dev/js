import { Flex, Icon, Tooltip } from "@chakra-ui/react";
import { BsQuestionCircle } from "react-icons/bs";
import { Card } from "tw-components";

export const TooltipBox: React.FC<{
  content: React.ReactNode;
  iconColor?: string;
}> = ({ content, iconColor = "accent.600" }) => {
  return (
    <Tooltip
      placement="top-start"
      borderRadius="md"
      bg="transparent"
      boxShadow="none"
      p={4}
      minW={{ md: "450px" }}
      label={
        <Card py={2} px={4} bgColor="backgroundCardHighlight">
          {content}
        </Card>
      }
    >
      <Flex alignItems="center" justifyContent="center">
        <Icon
          ml={2}
          mr={1}
          as={BsQuestionCircle}
          color={iconColor}
          boxSize={4}
        />
      </Flex>
    </Tooltip>
  );
};
