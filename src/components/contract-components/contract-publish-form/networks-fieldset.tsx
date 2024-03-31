import { NetworkDropdown } from "./NetworkDropdown";
import { Flex, FormControl, Select } from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import { Heading, Text } from "tw-components";

interface NetworksFieldsetProps {
  fromStandard?: boolean;
}

export const NetworksFieldset: React.FC<NetworksFieldsetProps> = ({
  fromStandard,
}) => {
  const form = useFormContext();
  return (
    <Flex flexDir="column" gap={fromStandard ? 6 : 4}>
      <Flex flexDir="column" gap={2}>
        <Heading size={fromStandard ? "title.lg" : "title.md"}>
          Networks that your contract can be deployed to
        </Heading>
      </Flex>
      <FormControl isRequired>
        <Select
          onChange={(e) =>
            form.setValue(
              `networksForDeployment.allNetworks`,
              e.target.value === "all",
            )
          }
          value={
            form.watch(`networksForDeployment.allNetworks`) ? "all" : "specific"
          }
        >
          <option value="all">All networks</option>
          <option value="specific">Specific networks</option>
        </Select>
      </FormControl>
      {!form.watch(`networksForDeployment.allNetworks`) && (
        <Flex flexDir="column" gap={2}>
          <Text>Please select the networks you want to enable:</Text>
          <NetworkDropdown
            onMultiChange={(networksEnabled) =>
              form.setValue(
                "networksForDeployment.networksEnabled",
                networksEnabled,
              )
            }
            value={form.watch("networksForDeployment.networksEnabled")}
          />
        </Flex>
      )}
    </Flex>
  );
};
