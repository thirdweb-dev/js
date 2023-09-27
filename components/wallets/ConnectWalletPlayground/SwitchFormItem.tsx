import { Box, Flex, FormControl, Switch, Spacer } from "@chakra-ui/react";
import React from "react";
import { FormLabel, Text } from "tw-components";

export const SwitchFormItem: React.FC<{
  label: string;
  description: React.ReactNode;
  isChecked: boolean;
  onCheck: (isChecked: boolean) => void;
}> = (props) => {
  return (
    <FormControl>
      <Flex gap={4} justifyContent="space-between" alignItems="center">
        <Box flex={1}>
          <FormLabel m={0}>{props.label}</FormLabel>
          <Spacer height={2} />
          <Text color="faded" fontSize={14} lineHeight={1.4}>
            {props.description}
          </Text>
        </Box>

        <Switch
          size="lg"
          isChecked={props.isChecked}
          onChange={() => {
            props.onCheck(!props.isChecked);
          }}
        />
      </Flex>
    </FormControl>
  );
};
