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
import { Button, Card, Heading, Text } from "tw-components";

export const ConfirmationPopover: React.FC<{
  onConfirm: () => void;
  children: React.ReactNode;
  prompt: string;
  description?: React.ReactNode;
  confirmationText: React.ReactNode;
}> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
      <PopoverTrigger>{props.children}</PopoverTrigger>
      <Card
        maxW="md"
        mr={4}
        mb={1}
        w="330px"
        p={2}
        as={PopoverContent}
        bg="backgroundBody"
        boxShadow="0px 0px 2px 0px var(--popper-arrow-shadow-color)"
      >
        <PopoverArrow bg="backgroundBody" />

        <PopoverHeader border="none">
          <Heading size="label.lg" mb={4}>
            {props.prompt}
          </Heading>

          <Text mb={4}> {props.description} </Text>
        </PopoverHeader>
        <PopoverFooter border="none" display="flex">
          <ButtonGroup size="sm">
            <Button colorScheme="red" onClick={props.onConfirm}>
              {props.confirmationText}
            </Button>
            <Button onClick={onClose} variant="outline">
              Cancel
            </Button>
          </ButtonGroup>
        </PopoverFooter>
      </Card>
    </Popover>
  );
};
