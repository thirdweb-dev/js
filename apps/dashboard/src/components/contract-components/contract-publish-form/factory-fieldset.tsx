import { ButtonGroup, Flex } from "@chakra-ui/react";
import type { Abi } from "abitype";
import type { Dispatch, SetStateAction } from "react";
import { useFormContext } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import { Button, Heading } from "tw-components";
import { CustomFactory } from "./custom-factory";
import { DefaultFactory } from "./default-factory";

interface FactoryFieldsetProps {
  abi: Abi;
  setCustomFactoryAbi: Dispatch<SetStateAction<Abi>>;
  client: ThirdwebClient;
}

export const FactoryFieldset: React.FC<FactoryFieldsetProps> = ({
  abi,
  setCustomFactoryAbi,
  client,
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
          <DefaultFactory abi={abi} client={client} />
        )}
        {form.watch("deployType") === "customFactory" && (
          <CustomFactory
            setCustomFactoryAbi={setCustomFactoryAbi}
            client={client}
          />
        )}
      </Flex>
    </Flex>
  );
};
