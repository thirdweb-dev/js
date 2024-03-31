import { Flex, FormControl } from "@chakra-ui/react";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { camelToTitle } from "contract-ui/components/solidity-inputs/helpers";
import { useFormContext } from "react-hook-form";
import {
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Text,
} from "tw-components";

interface ParamProps {
  paramKey: string;
  extraMetadataParam: any;
  deployParam: any;
}

export const Param: React.FC<ParamProps> = ({
  paramKey,
  extraMetadataParam,
  deployParam,
}) => {
  const form = useFormContext();

  return (
    <FormControl
      isRequired
      key={paramKey}
      isInvalid={
        !!form.getFieldState(`deployParams.${paramKey}`, form.formState).error
      }
    >
      <Flex alignItems="center" my={1}>
        <FormLabel mb={0} flex="1" display="flex">
          <Flex alignItems="baseline" gap={1}>
            {extraMetadataParam?.displayName
              ? extraMetadataParam.displayName
              : paramKey === "*"
                ? "Unnamed"
                : camelToTitle(paramKey)}
            <Text size="label.sm">({paramKey})</Text>
          </Flex>
        </FormLabel>
        {deployParam && (
          <FormHelperText mt={0}>{deployParam.type}</FormHelperText>
        )}
      </Flex>
      {deployParam && (
        <SolidityInput
          defaultValue={form.watch(`deployParams.${paramKey}`)}
          solidityType={deployParam.type}
          {...form.register(`deployParams.${paramKey}`)}
        />
      )}
      <FormErrorMessage>
        {
          form.getFieldState(`deployParams.${paramKey}`, form.formState).error
            ?.message
        }
      </FormErrorMessage>
      {extraMetadataParam?.description && (
        <FormHelperText>{extraMetadataParam?.description}</FormHelperText>
      )}
    </FormControl>
  );
};
