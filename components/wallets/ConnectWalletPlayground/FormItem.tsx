import { FormControl, Flex, Tooltip, Box } from "@chakra-ui/react";
import { AiOutlineInfoCircle } from "react-icons/ai";
import { FormLabel } from "tw-components";

export const FormItem: React.FC<{
  label: string;
  children: React.ReactNode;
  description?: React.ReactNode;
}> = (props) => {
  return (
    <FormControl>
      <Flex gap={2} mb={2} alignItems="center">
        <FormLabel m={0}>{props.label}</FormLabel>
        {props.description && (
          <Tooltip
            hasArrow
            shouldWrapChildren
            border="1px solid"
            borderColor="backgroundCardHighlight"
            placement="top-start"
            borderRadius="md"
            px={3}
            py={2}
            label={<Box>{props.description}</Box>}
          >
            <div>
              <AiOutlineInfoCircle color="gray.700" />
            </div>
          </Tooltip>
        )}
      </Flex>

      {props.children}
    </FormControl>
  );
};
