import { ButtonGroup, Flex } from "@chakra-ui/react";
import type { Abi } from "@thirdweb-dev/sdk";
import type { Dispatch, SetStateAction } from "react";
import { useFormContext } from "react-hook-form";
import { Button, Heading } from "tw-components";
import { CustomFactory } from "./custom-factory";
import { DefaultFactory } from "./default-factory";
import {
  useConstructorParamsFromABI,
  useFunctionParamsFromABI,
} from "../hooks";


interface FactoryFieldsetProps {
  abi: Abi;
  setCustomFactoryAbi: Dispatch<SetStateAction<Abi>>;
  shouldShowDynamicFactoryInput: boolean;
  shouldShowExtensionsParamInput: boolean;
  deployParams:
    | ReturnType<typeof useFunctionParamsFromABI>
    | ReturnType<typeof useConstructorParamsFromABI>;

}

export const FactoryFieldset: React.FC<FactoryFieldsetProps> = ({
  abi,
  setCustomFactoryAbi,
  shouldShowDynamicFactoryInput,
  shouldShowExtensionsParamInput,
  deployParams
}) => {
  const form = useFormContext();

  return (
    <Flex gap={12} direction="column" as="fieldset">
      <Flex gap={6} direction="column">
        <Heading size="title.lg">Factory deploy settings</Heading>
        <ButtonGroup size="sm" variant="ghost" spacing={{ base: 0.5, md: 2 }}>
          <Button
            type="button"
            isActive={form.watch("deployType") === "autoFactory"}
            _active={{
              bg: "bgBlack",
              color: "bgWhite",
            }}
            rounded="lg"
            onClick={() => form.setValue("deployType", "autoFactory")}
          >
            Default Factory
          </Button>
          <Button
            type="button"
            isActive={form.watch("deployType") === "customFactory"}
            _active={{
              bg: "bgBlack",
              color: "bgWhite",
            }}
            rounded="lg"
            onClick={() => form.setValue("deployType", "customFactory")}
          >
            Custom Factory (Advanced)
          </Button>
        </ButtonGroup>
        {form.watch("deployType") === "autoFactory" && (
          <DefaultFactory
            abi={abi}
            shouldShowDynamicFactoryInput={shouldShowDynamicFactoryInput}
            shouldShowExtensionsParamInput={shouldShowExtensionsParamInput}
            deployParams={deployParams}

          />
        )}
        {form.watch("deployType") === "customFactory" && (
          <CustomFactory setCustomFactoryAbi={setCustomFactoryAbi} />
        )}
      </Flex>
    </Flex>
  );
};
