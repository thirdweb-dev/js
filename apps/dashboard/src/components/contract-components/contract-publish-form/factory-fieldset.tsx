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
    <Flex as="fieldset" direction="column" gap={12}>
      <Flex direction="column" gap={6}>
        <Heading size="title.lg">Factory deploy settings</Heading>
        <ButtonGroup size="sm" spacing={{ base: 0.5, md: 2 }} variant="ghost">
          <Button
            _active={{
              bg: "bgBlack",
              color: "bgWhite",
            }}
            isActive={form.watch("deployType") === "autoFactory"}
            onClick={() => form.setValue("deployType", "autoFactory")}
            rounded="lg"
            type="button"
          >
            Default Factory
          </Button>
          <Button
            _active={{
              bg: "bgBlack",
              color: "bgWhite",
            }}
            isActive={form.watch("deployType") === "customFactory"}
            onClick={() => form.setValue("deployType", "customFactory")}
            rounded="lg"
            type="button"
          >
            Custom Factory (Advanced)
          </Button>
        </ButtonGroup>
        {form.watch("deployType") === "autoFactory" && (
          <DefaultFactory abi={abi} client={client} />
        )}
        {form.watch("deployType") === "customFactory" && (
          <CustomFactory
            client={client}
            setCustomFactoryAbi={setCustomFactoryAbi}
          />
        )}
      </Flex>
    </Flex>
  );
};
