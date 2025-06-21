"use client";

import {
  Box,
  Divider,
  Flex,
  GridItem,
  Image,
  List,
  SimpleGrid,
  Tab,
  TabList,
  Table,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import type { AbiEvent, AbiFunction } from "abitype";
import { camelToTitle } from "contract-ui/components/solidity-inputs/helpers";
import { SearchIcon } from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  type Dispatch,
  lazy,
  type SetStateAction,
  useMemo,
  useState,
} from "react";
import type { ThirdwebContract } from "thirdweb";
import * as ERC20Ext from "thirdweb/extensions/erc20";
import * as ERC721Ext from "thirdweb/extensions/erc721";
import * as ERC1155Ext from "thirdweb/extensions/erc1155";
import { useReadContract } from "thirdweb/react";
import { toFunctionSelector } from "thirdweb/utils";
import { Button, Card, Heading, Text } from "tw-components";
import { useDebounce } from "use-debounce";
import {
  type CodeEnvironment,
  CodeSegment,
} from "@/components/blocks/code-segment.client";
import { Badge } from "@/components/ui/badge";
import { CopyTextButton } from "@/components/ui/CopyTextButton";
import { Input } from "@/components/ui/input";
import { useDashboardRouter } from "@/lib/DashboardRouter";
import { cn } from "@/lib/utils";
import { useContractFunctionSelectors } from "../../contract-ui/hooks/useContractFunctionSelectors";
import {
  COMMANDS,
  formatSnippet,
} from "../../contract-ui/tabs/code/components/code-overview";
import { InteractiveAbiFunction } from "./interactive-abi-function";

const ContractFunctionComment = lazy(
  () => import("./contract-function-comment"),
);
interface ContractFunctionProps {
  fn: AbiFunction | AbiEvent;
  contract: ThirdwebContract;
  isLoggedIn: boolean;
}

const ContractFunction: React.FC<{
  fn: AbiFunction | AbiEvent;
  contract?: ThirdwebContract;
  isLoggedIn: boolean;
}> = ({ fn, contract, isLoggedIn }) => {
  if (!contract) {
    return <ContractFunctionInputs fn={fn} />;
  }

  return (
    <ContractFunctionInner
      contract={contract}
      fn={fn}
      isLoggedIn={isLoggedIn}
    />
  );
};

function ContractFunctionInner(props: ContractFunctionProps) {
  const { contract, fn } = props;
  const [environment, setEnvironment] = useState<CodeEnvironment>("javascript");
  const functionSelectorQuery = useContractFunctionSelectors(contract);
  const functionSelectors = functionSelectorQuery.data || [];
  const isERC721Query = useReadContract(ERC721Ext.isERC721, { contract });
  const isERC1155Query = useReadContract(ERC1155Ext.isERC1155, { contract });
  const isERC20 = useMemo(
    () => ERC20Ext.isERC20(functionSelectors),
    [functionSelectors],
  );

  const extensionNamespace = useMemo(() => {
    if (isERC20) {
      return "erc20";
    }
    if (isERC721Query.data) {
      return "erc721";
    }
    if (isERC1155Query.data) {
      return "erc1155";
    }
    return undefined;
  }, [isERC20, isERC721Query.data, isERC1155Query.data]);

  const functionSelector = useMemo(
    () => (fn?.type === "function" ? toFunctionSelector(fn) : undefined),
    [fn],
  );

  if (!fn) {
    return null;
  }

  const isFunction = "stateMutability" in fn;

  const isRead =
    isFunction &&
    (fn.stateMutability === "view" || fn.stateMutability === "pure");

  const commandsKey = isFunction
    ? isRead
      ? "read"
      : "write"
    : ("events" as const);

  const codeSnippet = formatSnippet(COMMANDS[commandsKey], {
    args: fn.inputs?.map((i) => i.name || ""),
    chainId: contract.chain.id,
    contractAddress: contract.address,
    extensionNamespace,
    fn,
  });

  return (
    <Flex direction="column" gap={1.5}>
      <Flex alignItems="center" direction="row" flexWrap="wrap" gap={2}>
        <Flex alignItems="baseline" flexWrap="wrap" gap={1}>
          <Heading size="subtitle.md">{camelToTitle(fn.name)}</Heading>
          <Heading className="text-muted-foreground" size="subtitle.sm">
            ({fn.name})
          </Heading>
        </Flex>
        {isFunction && <Badge variant="success">{fn.stateMutability}</Badge>}
        {functionSelector && (
          <CopyTextButton
            className="ml-auto text-xs"
            copyIconPosition="right"
            textToCopy={functionSelector}
            textToShow={functionSelector}
            tooltip="The selector of this function"
          />
        )}
      </Flex>
      {isFunction && (
        <InteractiveAbiFunction
          abiFunction={fn}
          contract={contract}
          isLoggedIn={props.isLoggedIn}
          key={JSON.stringify(fn)}
        />
      )}

      {codeSnippet && (
        <>
          <Heading mt={6} size="subtitle.md">
            Use this function in your app
          </Heading>
          <Divider mb={2} />
          <CodeSegment
            environment={environment}
            setEnvironment={setEnvironment}
            snippet={codeSnippet}
          />
        </>
      )}
      <ContractFunctionComment contract={contract} functionName={fn.name} />
    </Flex>
  );
}

function ContractFunctionInputs(props: { fn: AbiFunction | AbiEvent }) {
  const { fn } = props;
  const isFunction = "stateMutability" in fn;

  return (
    <Flex direction="column" gap={1.5}>
      <Flex
        alignItems={{ base: "start", md: "center" }}
        direction={{ base: "column", md: "row" }}
        gap={2}
      >
        <Flex alignItems="baseline" flexWrap="wrap" gap={1}>
          <Heading size="subtitle.md">{camelToTitle(fn.name)}</Heading>
          <Heading className="text-muted-foreground" size="subtitle.sm">
            ({fn.name})
          </Heading>
        </Flex>
        {isFunction && <Badge variant="success">{fn.stateMutability}</Badge>}
      </Flex>

      {fn.inputs?.length ? (
        <>
          <Divider my={2} />
          <Flex flexDir="column" gap={3}>
            <Heading size="label.lg">Inputs</Heading>
            <Box
              borderTopRadius="lg"
              overflowX="auto"
              p={0}
              position="relative"
            >
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th border="none">
                      <Heading as="label" color="faded" size="label.sm">
                        Name
                      </Heading>
                    </Th>
                    <Th border="none">
                      <Heading as="label" color="faded" size="label.sm">
                        Type
                      </Heading>
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {fn.inputs.map((input, idx) => (
                    <Tr
                      _last={{ borderBottomWidth: 0 }}
                      borderBottomWidth={1}
                      key={`${input.name}+${idx}}`}
                    >
                      <Td
                        borderBottomColor="borderColor"
                        borderBottomWidth="inherit"
                      >
                        {input?.name ? (
                          <Text fontFamily="mono">{input.name}</Text>
                        ) : (
                          <Text
                            className="text-muted-foreground"
                            fontStyle="italic"
                          >
                            No name defined
                          </Text>
                        )}
                      </Td>
                      <Td
                        borderBottomColor="borderColor"
                        borderBottomWidth="inherit"
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
    </Flex>
  );
}

interface ContractFunctionsPanelProps {
  fnsOrEvents: (AbiFunction | AbiEvent)[];
  contract?: ThirdwebContract;
  isLoggedIn: boolean;
}

type ExtensionFunctions = {
  extension: string;
  functions: AbiFunction[];
};

export const ContractFunctionsPanel: React.FC<ContractFunctionsPanelProps> = ({
  fnsOrEvents,
  contract,
  isLoggedIn,
}) => {
  // TODO: clean this up

  const functionsWithExtension = useMemo(() => {
    const allFunctions = fnsOrEvents.filter((f) => f.type === "function");
    const results: ExtensionFunctions[] = [];
    results.push({
      extension: "",
      functions: allFunctions,
    });
    return results;
  }, [fnsOrEvents]);
  const writeFunctions: ExtensionFunctions[] = useMemo(() => {
    return functionsWithExtension
      .map((e) => {
        const filteredFunctions = e.functions.filter(
          (fn) =>
            fn.stateMutability !== "pure" && fn.stateMutability !== "view",
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
  const searchParams = useSearchParams();
  const _selector = searchParams?.get("selector");
  const _item = _selector
    ? fnsOrEvents.find((o) => {
        if (o.type === "function") {
          const selector = toFunctionSelector(o as AbiFunction);
          return selector === _selector;
        }
        return null;
      })
    : undefined;

  const [selectedFunction, setSelectedFunction] = useState<
    AbiFunction | AbiEvent | undefined
  >(_item ?? fnsOrEvents[0]);
  // Set the active tab to Write or Read depends on the `_item`
  const _defaultTabIndex =
    _item &&
    "stateMutability" in _item &&
    (_item.stateMutability === "view" || _item.stateMutability === "pure")
      ? 1
      : 0;

  const [_keywordSearch, setKeywordSearch] = useState<string>("");
  const [keywordSearch] = useDebounce(_keywordSearch, 150);

  const functionSection = (e: ExtensionFunctions) => {
    const filteredFunctions = keywordSearch
      ? e.functions.filter((o) =>
          o.name.toLowerCase().includes(keywordSearch.toLowerCase()),
        )
      : e.functions;
    return (
      <Flex flexDir="column" key={e.extension} mb={6}>
        {e.extension ? (
          <>
            <Flex alignContent="center" alignItems="center" gap={2}>
              <Image
                alt="Extension detected"
                mb="2px"
                objectFit="contain"
                src="/assets/dashboard/extension-check.svg"
              />
              <Heading as="label" size="label.md">
                {e.extension}
              </Heading>
            </Flex>
            <Divider my={2} />
          </>
        ) : (
          <>
            <Flex alignContent="center" alignItems="center" gap={2}>
              <Heading as="label" size="label.md">
                Other Functions
              </Heading>
            </Flex>
            <Divider my={2} />
          </>
        )}
        {selectedFunction &&
          filteredFunctions.map((fn) => (
            <FunctionsOrEventsListItem
              fn={fn}
              key={`${fn.name}_${fn.type}_${fn.inputs.length}`}
              selectedFunction={selectedFunction}
              setSelectedFunction={setSelectedFunction}
            />
          ))}
      </Flex>
    );
  };

  return (
    <SimpleGrid columns={12} gap={5} height="100%">
      <GridItem
        as={Card}
        className="bg-card"
        colSpan={{ base: 12, md: 4 }}
        height="100%"
        overflow="auto"
        overflowY="auto"
        pt={0}
        px={0}
      >
        <List height="100%" overflowX="hidden">
          {(writeFunctions.length > 0 || viewFunctions.length > 0) && (
            <Tabs
              colorScheme="gray"
              defaultIndex={_defaultTabIndex}
              display="flex"
              flexDir="column"
              h="100%"
              position="relative"
            >
              <TabList as={Flex}>
                {writeFunctions.length > 0 && (
                  <Tab flex="1 1 0" gap={2}>
                    <Heading color="inherit" my={1} size="label.md">
                      Write
                    </Heading>
                  </Tab>
                )}
                {viewFunctions.length > 0 && (
                  <Tab flex="1 1 0" gap={2}>
                    <Heading color="inherit" my={1} size="label.md">
                      Read
                    </Heading>
                  </Tab>
                )}
              </TabList>

              <div className="sticky top-0 z-[1]">
                <div className="relative w-full">
                  <SearchIcon className="-translate-y-1/2 absolute top-[50%] left-3 size-4 text-muted-foreground" />
                  <Input
                    className="h-auto rounded-none border-x-0 bg-card py-3 pl-9 focus-visible:ring-0 focus-visible:ring-offset-0"
                    onChange={(e) => setKeywordSearch(e.target.value)}
                    placeholder="Search"
                    value={_keywordSearch}
                  />
                </div>
              </div>

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

          {events.length > 0 && selectedFunction && (
            <Box overflowX="hidden" pt={2} px={4}>
              {events.map((fn) => (
                <FunctionsOrEventsListItem
                  fn={fn}
                  key={`${fn.name}_${fn.type}_${fn.inputs.length}`}
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
        className="bg-card"
        colSpan={{ base: 12, md: 8 }}
        height="100%"
        overflow="auto"
      >
        {selectedFunction && (
          <ContractFunction
            contract={contract}
            fn={selectedFunction}
            isLoggedIn={isLoggedIn}
          />
        )}
      </GridItem>
    </SimpleGrid>
  );
};

interface FunctionsOrEventsListItemProps {
  fn: AbiFunction | AbiEvent;
  selectedFunction: AbiFunction | AbiEvent;
  setSelectedFunction: Dispatch<
    SetStateAction<AbiFunction | AbiEvent | undefined>
  >;
}

const FunctionsOrEventsListItem: React.FC<FunctionsOrEventsListItemProps> = ({
  fn,
  selectedFunction,
  setSelectedFunction,
}) => {
  const isActive =
    selectedFunction?.name === fn.name &&
    selectedFunction.inputs?.length === fn.inputs?.length;
  const pathname = usePathname();
  const router = useDashboardRouter();
  return (
    <li className="my-1">
      <Button
        className={cn(
          "!font-medium !text-muted-foreground hover:!text-foreground font-mono",
          {
            "!text-foreground": isActive,
          },
        )}
        onClick={() => {
          setSelectedFunction(fn);

          // Only apply to the Explorer page
          if (pathname?.endsWith("/explorer") && fn.type === "function") {
            const selector = toFunctionSelector(fn);
            router.push(`${pathname}?selector=${selector}`);
          }
        }}
        size="sm"
        variant="link"
      >
        {fn.name}
      </Button>
    </li>
  );
};
