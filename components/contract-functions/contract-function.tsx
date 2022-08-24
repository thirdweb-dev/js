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
import { Dispatch, SetStateAction, useMemo, useState } from "react";
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

  const writeFunctions: AbiFunction[] = useMemo(() => {
    return fnsOrEvents.filter(
      (fn) =>
        (fn as AbiFunction).stateMutability !== "pure" &&
        (fn as AbiFunction).stateMutability !== "view" &&
        "stateMutability" in fn,
    ) as AbiFunction[];
  }, [fnsOrEvents]);
  const viewFunctions: AbiFunction[] = useMemo(() => {
    return fnsOrEvents.filter(
      (fn) =>
        (fn as AbiFunction).stateMutability === "pure" ||
        (fn as AbiFunction).stateMutability === "view",
    ) as AbiFunction[];
  }, [fnsOrEvents]);
  const events = useMemo(() => {
    return fnsOrEvents.filter((fn) => !("stateMutability" in fn)) as AbiEvent[];
  }, [fnsOrEvents]);

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
          minH="100%"
          pr={{ base: 0, md: 3 }}
          mb={{ base: 3, md: 0 }}
          overflowX="hidden"
        >
          {writeFunctions.length ? (
            <Flex mt={3} mb={3} gap={2}>
              <Icon boxSize={3} as={FiEdit2} />
              <Text size="label.sm">WRITE</Text>
            </Flex>
          ) : null}
          {writeFunctions.map((fn) => (
            <FunctionsOrEventsListItem
              key={fn.signature}
              fn={fn}
              isFunction={isFunction}
              selectedFunction={selectedFunction}
              setSelectedFunction={setSelectedFunction}
            />
          ))}
          {viewFunctions.length ? (
            <>
              <Divider my={3} />
              <Flex mt={5} mb={3} gap={2}>
                <Icon boxSize={3} as={FiEye} />
                <Text size="label.sm">READ</Text>
              </Flex>
            </>
          ) : null}
          {viewFunctions.map((fn) => (
            <FunctionsOrEventsListItem
              key={fn.name}
              fn={fn}
              isFunction={isFunction}
              selectedFunction={selectedFunction}
              setSelectedFunction={setSelectedFunction}
            />
          ))}
          {events.map((fn) => (
            <FunctionsOrEventsListItem
              key={isFunction ? (fn as AbiFunction).signature : fn.name}
              fn={fn}
              isFunction={isFunction}
              selectedFunction={selectedFunction}
              setSelectedFunction={setSelectedFunction}
            />
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

interface FunctionsOrEventsListItemProps {
  fn: AbiFunction | AbiEvent;
  isFunction: boolean;
  selectedFunction: AbiFunction | AbiEvent;
  setSelectedFunction: Dispatch<SetStateAction<AbiFunction | AbiEvent>>;
}

const FunctionsOrEventsListItem: React.FC<FunctionsOrEventsListItemProps> = ({
  fn,
  isFunction,
  selectedFunction,
  setSelectedFunction,
}) => {
  return (
    <ListItem my={0.5}>
      <Button
        size="sm"
        fontWeight={
          (isFunction &&
            (selectedFunction as AbiFunction).signature ===
              (fn as AbiFunction).signature) ||
          (!isFunction &&
            (selectedFunction as AbiEvent).name === (fn as AbiEvent).name)
            ? 600
            : 400
        }
        opacity={
          (isFunction &&
            (selectedFunction as AbiFunction).signature ===
              (fn as AbiFunction).signature) ||
          (!isFunction &&
            (selectedFunction as AbiEvent).name === (fn as AbiEvent).name)
            ? 1
            : 0.65
        }
        onClick={() => setSelectedFunction(fn)}
        color="heading"
        _hover={{ opacity: 1, textDecor: "underline" }}
        variant="link"
        fontFamily="mono"
      >
        {fn.name}
      </Button>
    </ListItem>
  );
};
