import { Flex } from "@chakra-ui/react";
import { AbiFunction } from "@thirdweb-dev/sdk";
import { Badge, Heading, Text } from "tw-components";

interface ContractFunctionProps {
  fn: AbiFunction;
}

export const ContractFunction: React.FC<ContractFunctionProps> = ({ fn }) => {
  return (
    <Flex direction="column" gap={1.5}>
      <Flex alignItems="center" gap={2}>
        <Heading size="label.md">{fn.name}</Heading>
        {fn.stateMutability === "payable" && (
          <Badge size="label.sm" variant="subtle" colorScheme="green">
            Payable
          </Badge>
        )}
      </Flex>
      {fn.comment && (
        <Text size="body.sm">
          {fn.comment
            .replaceAll(/See \{(.+)\}(\.)?/gm, "")
            .replaceAll("{", '"')
            .replaceAll("}", '"')}
        </Text>
      )}
    </Flex>
  );
};

interface ContractFunctionsPanelProps {
  functions: AbiFunction[];
}

export const ContractFunctionsPanel: React.FC<ContractFunctionsPanelProps> = ({
  functions,
}) => {
  return (
    <Flex flexDir="column" flex="1" gap={3}>
      {functions.map((fn) => (
        <ContractFunction key={fn.signature} fn={fn} />
      ))}
    </Flex>
  );
};
