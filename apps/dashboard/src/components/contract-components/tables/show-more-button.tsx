import { Center, Divider, Flex } from "@chakra-ui/react";
import { SetStateAction } from "react";
import { Button } from "tw-components";

interface ShowMoreButtonProps {
  limit: number;
  showMoreLimit: number;
  setShowMoreLimit: (value: SetStateAction<number>) => void;
}

export const ShowMoreButton: React.FC<ShowMoreButtonProps> = ({
  limit,
  showMoreLimit,
  setShowMoreLimit,
}) => {
  return (
    <Flex flexDir="column">
      <Divider color="borderColor" />
      <Center>
        <Button
          onClick={() => setShowMoreLimit(showMoreLimit + limit)}
          variant="ghost"
          my={3}
          size="sm"
        >
          Show more
        </Button>
      </Center>
    </Flex>
  );
};
