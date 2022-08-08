import { InteractiveAbiFunction } from "./interactive-abi-function";
import {
  Divider,
  Flex,
  GridItem,
  Icon,
  List,
  ListItem,
  SimpleGrid,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { AbiFunction, SmartContract } from "@thirdweb-dev/sdk";
import { MarkdownRenderer } from "components/contract-components/released-contract/markdown-renderer";
import { useState } from "react";
import { FiEdit2, FiEye } from "react-icons/fi";
import { Badge, Button, Card, Heading, Text } from "tw-components";

interface ContractFunctionProps {
  fn?: AbiFunction;
  contract?: SmartContract;
}

export const ContractFunction: React.FC<ContractFunctionProps> = ({
  fn,
  contract,
}) => {
  if (!fn) {
    return null;
  }

  return (
    <Flex direction="column" gap={1.5}>
      <Flex alignItems="center" gap={2}>
        <Heading size="subtitle.md">{fn.name}</Heading>
        <Badge size="label.sm" variant="subtle" colorScheme="green">
          {fn.stateMutability}
        </Badge>
      </Flex>
      {fn.comment && (
        <MarkdownRenderer
          markdownText={fn.comment
            .replaceAll(/See \{(.+)\}(\.)?/gm, "")
            .replaceAll("{", '"')
            .replaceAll("}", '"')
            .replaceAll("'", '"')}
        />
      )}
      {fn.inputs && fn.inputs.length && !contract ? (
        <>
          <Divider my={2} />
          <Flex flexDir="column" gap={3}>
            <Heading size="label.lg">Inputs</Heading>
            <Card borderRadius="md" p={0} overflowX="auto" position="relative">
              <Table size="sm">
                <Thead bg="blackAlpha.50" _dark={{ bg: "whiteAlpha.50" }}>
                  <Tr>
                    <Th py={2} borderBottomColor="borderColor">
                      <Heading as="label" size="label.sm">
                        Name
                      </Heading>
                    </Th>
                    <Th py={2} borderBottomColor="borderColor">
                      <Heading as="label" size="label.sm">
                        Type
                      </Heading>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {fn.inputs.map((input) => (
                    <Tr
                      borderBottomWidth={1}
                      _last={{ borderBottomWidth: 0 }}
                      key={input.name}
                    >
                      <Td
                        borderBottomWidth="inherit"
                        borderBottomColor="borderColor"
                      >
                        <Text fontFamily="mono">{input.name}</Text>
                      </Td>
                      <Td
                        borderBottomWidth="inherit"
                        borderBottomColor="borderColor"
                      >
                        <Text fontFamily="mono">{input.type}</Text>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Card>
          </Flex>
        </>
      ) : null}

      {contract && (
        <InteractiveAbiFunction
          key={JSON.stringify(fn)}
          contract={contract}
          abiFunction={fn}
        />
      )}
    </Flex>
  );
};

interface ContractFunctionsPanelProps {
  functions: AbiFunction[];
  contract?: SmartContract;
}

export const ContractFunctionsPanel: React.FC<ContractFunctionsPanelProps> = ({
  functions,
  contract,
}) => {
  const [selectedFunction, setSelectedFunction] = useState<AbiFunction>(
    functions[0],
  );
  return (
    <SimpleGrid columns={12}>
      <GridItem
        colSpan={{ base: 12, md: 3 }}
        borderRightWidth={{ base: "0px", md: "1px" }}
        borderBottomWidth={{ base: "1px", md: "0px" }}
        borderColor="borderColor"
      >
        <List
          overflow="auto"
          h={{ base: "300px", md: "500px" }}
          pr={{ base: 0, md: 3 }}
          mb={{ base: 3, md: 0 }}
        >
          {functions.map((fn) => (
            <ListItem key={fn.signature} my={0.5}>
              <Button
                size="sm"
                fontWeight={
                  selectedFunction.signature === fn.signature ? 600 : 400
                }
                leftIcon={
                  <Icon
                    boxSize={3}
                    as={
                      fn.stateMutability === "view" ||
                      fn.stateMutability === "pure"
                        ? FiEye
                        : FiEdit2
                    }
                  />
                }
                opacity={selectedFunction.signature === fn.signature ? 1 : 0.65}
                onClick={() => setSelectedFunction(fn)}
                color="heading"
                _hover={{ opacity: 1, textDecor: "underline" }}
                variant="link"
                fontFamily="mono"
              >
                {fn.name}
              </Button>
            </ListItem>
          ))}
        </List>
      </GridItem>
      <GridItem colSpan={{ base: 12, md: 9 }}>
        <Card ml={{ base: 0, md: 3 }} mt={{ base: 3, md: 0 }} flexGrow={1}>
          <ContractFunction fn={selectedFunction} contract={contract} />
        </Card>
      </GridItem>
    </SimpleGrid>
  );
};
