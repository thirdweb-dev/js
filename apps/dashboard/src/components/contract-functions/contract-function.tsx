import { useResolveContractAbi } from "@3rdweb-sdk/react/hooks/useResolveContractAbi";
import {
  Box,
  Divider,
  Flex,
  GridItem,
  Image,
  List,
  ListItem,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  Tabs,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import {
  type AbiEvent,
  type AbiFunction,
  extractFunctionsFromAbi,
  joinABIs,
} from "@thirdweb-dev/sdk";
import { useContractEnabledExtensions } from "components/contract-components/hooks";
import { MarkdownRenderer } from "components/contract-components/published-contract/markdown-renderer";
import { camelToTitle } from "contract-ui/components/solidity-inputs/helpers";
import { useRouter } from "next/router";
import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import type { ThirdwebContract } from "thirdweb";
import { Badge, Button, Card, Heading, Text } from "tw-components";
import {
  COMMANDS,
  formatSnippet,
} from "../../contract-ui/tabs/code/components/code-overview";
import { CodeSegment } from "../contract-tabs/code/CodeSegment";
import type { CodeEnvironment } from "../contract-tabs/code/types";
import { InteractiveAbiFunction } from "./interactive-abi-function";

interface ContractFunctionProps {
  fn?: AbiFunction | AbiEvent;
  contract?: ThirdwebContract;
}

const ContractFunction: React.FC<ContractFunctionProps> = ({
  fn,
  contract,
}) => {
  const [environment, setEnvironment] = useState<CodeEnvironment>("javascript");
  const abiQuery = useResolveContractAbi(contract);
  const enabledExtensions = useContractEnabledExtensions(abiQuery.data);

  const extensionNamespace = useMemo(() => {
    if (enabledExtensions.some((e) => e.name === "ERC20")) {
      return "erc20";
    }
    if (enabledExtensions.some((e) => e.name === "ERC721")) {
      return "erc721";
    }
    if (enabledExtensions.some((e) => e.name === "ERC1155")) {
      return "erc1155";
    }
    return undefined;
  }, [enabledExtensions]);

  if (!fn) {
    return null;
  }

  const isFunction = "stateMutability" in fn;

  const isRead =
    isFunction &&
    (fn.stateMutability === "view" || fn.stateMutability === "pure");

  return (
    <Flex direction="column" gap={1.5}>
      <Flex
        alignItems={{ base: "start", md: "center" }}
        gap={2}
        direction={{ base: "column", md: "row" }}
      >
        <Flex alignItems="baseline" gap={1} flexWrap="wrap">
          <Heading size="subtitle.md">{camelToTitle(fn.name)}</Heading>
          <Heading size="subtitle.sm" className="text-muted-foreground">
            ({fn.name}){" "}
          </Heading>
        </Flex>
        {isFunction && (
          <Badge size="label.sm" variant="subtle" colorScheme="green">
            {fn.stateMutability}
          </Badge>
        )}
      </Flex>
      {fn.comment && (
        <MarkdownRenderer
          markdownText={fn.comment
            ?.replaceAll(/See \{(.+)\}(\.)?/gm, "")
            .replaceAll("{", '"')
            .replaceAll("}", '"')
            .replaceAll("'", '"')}
        />
      )}
      {fn.inputs?.length && !contract ? (
        <>
          <Divider my={2} />
          <Flex flexDir="column" gap={3}>
            <Heading size="label.lg">Inputs</Heading>
            <Box
              borderTopRadius="lg"
              p={0}
              overflowX="auto"
              position="relative"
            >
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th border="none">
                      <Heading as="label" size="label.sm" color="faded">
                        Name
                      </Heading>
                    </Th>
                    <Th border="none">
                      <Heading as="label" size="label.sm" color="faded">
                        Type
                      </Heading>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {fn.inputs.map((input, idx) => (
                    <Tr
                      borderBottomWidth={1}
                      _last={{ borderBottomWidth: 0 }}
                      key={`${input.name}+${idx}}`}
                    >
                      <Td
                        borderBottomWidth="inherit"
                        borderBottomColor="borderColor"
                      >
                        {input?.name ? (
                          <Text fontFamily="mono">{input.name}</Text>
                        ) : (
                          <Text
                            fontStyle="italic"
                            className="text-muted-foreground"
                          >
                            No name defined
                          </Text>
                        )}
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
            </Box>
          </Flex>
        </>
      ) : null}

      {isFunction && contract && (
        <InteractiveAbiFunction
          key={JSON.stringify(fn)}
          contract={contract}
          abiFunction={fn}
        />
      )}

      <Heading size="subtitle.md" mt={6}>
        Use this function in your app
      </Heading>
      <Divider mb={2} />
      {contract && (
        <CodeSegment
          environment={environment}
          setEnvironment={setEnvironment}
          snippet={formatSnippet(
            COMMANDS[
              isFunction ? (isRead ? "read" : "write") : "events"
              // biome-ignore lint/suspicious/noExplicitAny: FIXME
            ] as any,
            {
              contractAddress: contract.address,
              fn,
              args: fn.inputs?.map((i) => i.name),
              chainId: contract.chain.id,
              extensionNamespace,
            },
          )}
        />
      )}
    </Flex>
  );
};

interface ContractFunctionsPanelProps {
  fnsOrEvents: (AbiFunction | AbiEvent)[];
  contract?: ThirdwebContract;
}

type ExtensionFunctions = {
  extension: string;
  functions: AbiFunction[];
};

export const ContractFunctionsPanel: React.FC<ContractFunctionsPanelProps> = ({
  fnsOrEvents,
  contract,
}) => {
  const abiQuery = useResolveContractAbi(contract);
  const extensions = useContractEnabledExtensions(abiQuery.data);
  const isFunction = "stateMutability" in fnsOrEvents[0];
  const functionsWithExtension = useMemo(() => {
    let allFunctions = fnsOrEvents as AbiFunction[];
    const results: ExtensionFunctions[] = [];
    const processedFunctions: string[] = [];
    // biome-ignore lint/complexity/noForEach: FIXME
    extensions.forEach((ext) => {
      // biome-ignore lint/suspicious/noExplicitAny: FIXME
      let functions = extractFunctionsFromAbi(joinABIs(ext.abis as any));
      allFunctions = allFunctions.filter(
        (fn) => !functions.map((f) => f.name).includes(fn.name),
      );
      functions = functions.filter(
        (fn) => !processedFunctions.includes(fn.name),
      );
      processedFunctions.push(...functions.map((fn) => fn.name));
      results.push({
        extension: ext.name as string,
        functions,
      });
    });
    results.push({
      extension: "",
      functions: allFunctions,
    });
    return results;
  }, [fnsOrEvents, extensions]);
  const writeFunctions: ExtensionFunctions[] = useMemo(() => {
    return functionsWithExtension
      .map((e) => {
        const filteredFunctions = e.functions.filter(
          (fn) =>
            (fn as AbiFunction).stateMutability !== "pure" &&
            (fn as AbiFunction).stateMutability !== "view",
        );
        if (filteredFunctions.length === 0) {
          return undefined;
        }
        return {
          extension: e.extension,
          functions: filteredFunctions,
        };
      })
      .filter((e) => e !== undefined) as ExtensionFunctions[];
  }, [functionsWithExtension]);
  const viewFunctions: ExtensionFunctions[] = useMemo(() => {
    return functionsWithExtension
      .map((e) => {
        const filteredFunctions = e.functions.filter(
          (fn) =>
            (fn as AbiFunction).stateMutability === "pure" ||
            (fn as AbiFunction).stateMutability === "view",
        );
        if (filteredFunctions.length === 0) {
          return undefined;
        }
        return {
          extension: e.extension,
          functions: filteredFunctions,
        };
      })
      .filter((e) => e !== undefined) as ExtensionFunctions[];
  }, [functionsWithExtension]);

  const events = useMemo(() => {
    return fnsOrEvents.filter((fn) => !("stateMutability" in fn)) as AbiEvent[];
  }, [fnsOrEvents]);

  // Load state from the URL
  const router = useRouter();
  const _itemName = router.query.name;
  const _item = fnsOrEvents.find((o) => o.name === _itemName);
  const [selectedFunction, setSelectedFunction] = useState<
    AbiFunction | AbiEvent
  >(_item ?? fnsOrEvents[0]);

  // Set the active tab to Write or Read depends on the `_item`
  const _defaultTabIndex =
    _item &&
    "stateMutability" in _item &&
    (_item.stateMutability === "view" || _item.stateMutability === "pure")
      ? 1
      : 0;

  const functionSection = (e: ExtensionFunctions) => (
    <Flex key={e.extension} flexDir={"column"} mb={6}>
      {e.extension ? (
        <>
          <Flex alignItems="center" alignContent={"center"} gap={2}>
            <Image
              src="/assets/dashboard/extension-check.svg"
              alt="Extension detected"
              objectFit="contain"
              mb="2px"
            />
            <Heading as="label" size="label.md">
              {e.extension}
            </Heading>
          </Flex>
          <Divider my={2} />
        </>
      ) : (
        <>
          <Flex alignItems="center" alignContent={"center"} gap={2}>
            <Heading as="label" size="label.md">
              Other Functions
            </Heading>
          </Flex>
          <Divider my={2} />
        </>
      )}
      {e.functions.map((fn) => (
        <FunctionsOrEventsListItem
          key={fn.signature}
          fn={fn}
          isFunction={isFunction}
          selectedFunction={selectedFunction}
          setSelectedFunction={setSelectedFunction}
        />
      ))}
    </Flex>
  );

  return (
    <SimpleGrid height="100%" columns={12} gap={3}>
      <GridItem
        as={Card}
        px={0}
        pt={0}
        height="100%"
        overflow="auto"
        colSpan={{ base: 12, md: 4 }}
        overflowY="auto"
      >
        <List height="100%" overflowX="hidden">
          {(writeFunctions.length > 0 || viewFunctions.length > 0) && (
            <Tabs
              defaultIndex={_defaultTabIndex}
              colorScheme="gray"
              h="100%"
              position="relative"
              display="flex"
              flexDir="column"
            >
              <TabList as={Flex}>
                {writeFunctions.length > 0 && (
                  <Tab gap={2} flex={"1 1 0"}>
                    <Heading color="inherit" my={1} size="label.md">
                      Write
                    </Heading>
                  </Tab>
                )}
                {viewFunctions.length > 0 && (
                  <Tab gap={2} flex={"1 1 0"}>
                    <Heading color="inherit" my={1} size="label.md">
                      Read
                    </Heading>
                  </Tab>
                )}
              </TabList>
              <TabPanels h="auto" overflow="auto">
                {writeFunctions.length > 0 && (
                  <TabPanel>
                    {writeFunctions.map((e) => functionSection(e))}
                  </TabPanel>
                )}
                {viewFunctions.length > 0 && (
                  <TabPanel>
                    {viewFunctions.map((e) => functionSection(e))}
                  </TabPanel>
                )}
              </TabPanels>
            </Tabs>
          )}

          {events.length > 0 && (
            <Box px={4} pt={2} overflowX="hidden">
              {events.map((fn) => (
                <FunctionsOrEventsListItem
                  key={isFunction ? (fn as AbiFunction).signature : fn.name}
                  fn={fn}
                  isFunction={isFunction}
                  selectedFunction={selectedFunction}
                  setSelectedFunction={setSelectedFunction}
                />
              ))}
            </Box>
          )}
        </List>
      </GridItem>
      <GridItem
        as={Card}
        height="100%"
        overflow="auto"
        colSpan={{ base: 12, md: 8 }}
      >
        <ContractFunction fn={selectedFunction} contract={contract} />
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
  const router = useRouter();
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
        onClick={() => {
          setSelectedFunction(fn);
          const { name } = fn;
          const path = router.asPath.split("?")[0];
          // Only apply to the Explorer page
          if (path.endsWith("/explorer")) {
            router.push({ pathname: path, query: { name } }, undefined, {
              shallow: true,
            });
          }
        }}
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
