import {
  ButtonGroup,
  Popover,
  PopoverArrow,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverTrigger,
  useDisclosure,
} from "@chakra-ui/react";
import { Button, Card, Heading } from "tw-components";

export const RemoveButton: React.FC<{ onRemove: () => void }> = ({
  onRemove,
}) => {
  const deletePopover = useDisclosure();

  return (
    <Popover
      isOpen={deletePopover.isOpen}
      onOpen={deletePopover.onOpen}
      onClose={deletePopover.onClose}
    >
      <PopoverTrigger>
        <Button variant="outline">Remove Network</Button>
      </PopoverTrigger>
      <Card
        maxW="sm"
        w="auto"
        as={PopoverContent}
        bg="backgroundCardHighlight"
        mx={4}
        py={3}
        px={4}
        boxShadow="0px 0px 2px 0px var(--popper-arrow-shadow-color)"
      >
        <PopoverArrow bg="backgroundBody" />

        <PopoverHeader border="none">
          <Heading size="label.lg">Are you sure?</Heading>
        </PopoverHeader>
        <PopoverFooter border="none" display="flex">
          <ButtonGroup size="sm">
            <Button onClick={deletePopover.onClose} variant="ghost">
              Cancel
            </Button>
            <Button colorScheme="red" onClick={onRemove}>
              Remove Network
            </Button>
          </ButtonGroup>
        </PopoverFooter>
      </Card>
    </Popover>
  );
};
