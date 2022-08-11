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
import { AbiEvent, AbiFunction, SmartContract } from "@thirdweb-dev/sdk";
import { MarkdownRenderer } from "components/contract-components/released-contract/markdown-renderer";
import { useMemo, useState } from "react";
import { BsLightningCharge } from "react-icons/bs";
import { FiEdit2, FiEye } from "react-icons/fi";
import { Badge, Button, Card, Heading, Text } from "tw-components";

interface ContractFunctionProps {
  fn?: AbiFunction | AbiEvent;
  contract?: SmartContract;
}

export const ContractFunction: React.FC<ContractFunctionProps> = ({
  fn,
  contract,
}) => {
  if (!fn) {
    return null;
  }

  const isFunction = "stateMutability" in fn;

  return (
    <Flex direction="column" gap={1.5}>
      <Flex alignItems="center" gap={2}>
        <Heading size="subtitle.md">{fn.name}</Heading>
        {isFunction && (
          <Badge size="label.sm" variant="subtle" colorScheme="green">
            {fn.stateMutability}
          </Badge>
        )}
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

      {contract && isFunction && (
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
  fnsOrEvents: (AbiFunction | AbiEvent)[];
  contract?: SmartContract;
}

export const ContractFunctionsPanel: React.FC<ContractFunctionsPanelProps> = ({
  fnsOrEvents,
  contract,
}) => {
  const isFunction = "stateMutability" in fnsOrEvents[0];

  const fnsOrEventsSorted: AbiFunction[] | AbiEvent[] = useMemo(() => {
    if (isFunction) {
      return fnsOrEvents.sort((a, b) => {
        if (
          (b as AbiFunction).stateMutability === "view" ||
          (b as AbiFunction).stateMutability === "pure"
        ) {
          return -1;
        }
        if (
          (a as AbiFunction).stateMutability === "view" ||
          (a as AbiFunction).stateMutability === "pure"
        ) {
          return 1;
        }
        return 0;
      });
    }
    return fnsOrEvents;
  }, [fnsOrEvents, isFunction]);

  const [selectedFunction, setSelectedFunction] = useState<
    AbiFunction | AbiEvent
  >(fnsOrEvents[0]);

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
          overflowX="hidden"
        >
          {fnsOrEventsSorted.map((fn) => (
            <ListItem
              key={isFunction ? (fn as AbiFunction).signature : fn.name}
              my={0.5}
            >
              <Button
                size="sm"
                fontWeight={selectedFunction.name === fn.name ? 600 : 400}
                leftIcon={
                  <Icon
                    boxSize={3}
                    as={
                      isFunction
                        ? (fn as AbiFunction).stateMutability === "view" ||
                          (fn as AbiFunction).stateMutability === "pure"
                          ? FiEye
                          : FiEdit2
                        : BsLightningCharge
                    }
                  />
                }
                opacity={selectedFunction.name === fn.name ? 1 : 0.65}
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
