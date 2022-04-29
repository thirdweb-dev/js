import { Flex, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { Button, Text } from "tw-components";

interface INoticeProps {
  color?: string;
  action: string;
  message: string;
  onClick: () => void;
}

export const ContractPageNotice: React.FC<INoticeProps> = ({
  color,
  action,
  message,
  onClick,
}) => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  return (
    <Flex
      padding="20px"
      borderRadius="md"
      bg={`${color || "orange"}.500`}
      opacity={0.8}
      direction="column"
    >
      <Text color="white">{message}</Text>
      <Stack direction="row" mt="8px">
        <Button
          size="sm"
          bg="white"
          color={`${color || "orange"}.800`}
          onClick={() => {
            setDismissed(true);
            onClick();
          }}
        >
          {action}
        </Button>
        <Button
          size="sm"
          bg="white"
          color={`${color || "orange"}.800`}
          onClick={() => setDismissed(true)}
        >
          Dismiss
        </Button>
      </Stack>
    </Flex>
  );
};
