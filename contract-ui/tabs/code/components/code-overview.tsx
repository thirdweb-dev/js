import { useDashboardEVMChainId } from "@3rdweb-sdk/react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Divider,
  Flex,
  GridItem,
  Image,
  List,
  ListItem,
  Select,
  SimpleGrid,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Chain, defaultChains } from "@thirdweb-dev/chains";
import { useAddress } from "@thirdweb-dev/react";
import {
  Abi,
  AbiEvent,
  AbiFunction,
  FeatureWithEnabled,
} from "@thirdweb-dev/sdk";
import {
  useContractEnabledExtensions,
  useContractEvents,
  useContractFunctions,
  useFeatureContractCodeSnippetQuery,
} from "components/contract-components/hooks";
import { CodeSegment } from "components/contract-tabs/code/CodeSegment";
import {
  CodeEnvironment,
  SnippetApiResponse,
} from "components/contract-tabs/code/types";
import { DASHBOARD_THIRDWEB_CLIENT_ID } from "constants/rpc";
import { constants } from "ethers";
import { useSupportedChain } from "hooks/chains/configureChains";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { useRouter } from "next/router";
import { WALLETS_SNIPPETS } from "pages/dashboard/wallets/wallet-sdk";
import { useMemo, useState } from "react";
import { Button, Card, Heading, Link, Text, TrackedLink } from "tw-components";

interface CodeOverviewProps {
  abi?: Abi;
  contractAddress?: string;
  onlyInstall?: boolean;
  chain?: Chain;
  noSidebar?: boolean;
}

const COMMANDS = {
  install: {
    javascript: "npm install @thirdweb-dev/sdk ethers@5",
    react: "npm install @thirdweb-dev/react @thirdweb-dev/sdk ethers@5",
    "react-native": "React Native",
    web3button: "",
    python: "pip install thirdweb-sdk",
    go: "go get github.com/thirdweb-dev/go-sdk/thirdweb",
    unity: `// Download the .unitypackage from the latest release:
// https://github.com/thirdweb-dev/unity-sdk/releases
// and drag it into your project`,
  },
  setup: {
    javascript: `import {{chainName}} from "@thirdweb-dev/chains";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

// If used on the FRONTEND pass your 'clientId'
const sdk = new ThirdwebSDK({{chainName}}, {
  clientId: "YOUR_CLIENT_ID",
});
// --- OR ---
// If used on the BACKEND pass your 'secretKey'
const sdk = new ThirdwebSDK({{chainName}}, {
  secretKey: "YOUR_SECRET_KEY",
});

const contract = await sdk.getContract("{{contract_address}}");`,
    react: `import {{chainName}} from "@thirdweb-dev/chains";
import { ThirdwebProvider, useContract } from "@thirdweb-dev/react";

function App() {
  return (
    <ThirdwebProvider 
      activeChain={{chainName}} 
      clientId="YOUR_CLIENT_ID" // You can get a client id from dashboard settings
    >
      <Component />
    </ThirdwebProvider>
  )
}

function Component() {
  const { contract, isLoading } = useContract("{{contract_address}}");
}`,
    "react-native": `import {{chainName}} from "@thirdweb-dev/chains";
import { ThirdwebProvider, useContract } from "@thirdweb-dev/react-native";

function App() {
  return (
    <ThirdwebProvider 
      activeChain={{chainName}}
      clientId="YOUR_CLIENT_ID" // You can get a client id from dashboard settings
    >
      <Component />
    </ThirdwebProvider>
  )
}

function Component() {
  const { contract, isLoading } = useContract("{{contract_address}}");
}`,
    web3button: ``,
    python: `from thirdweb import ThirdwebSDK

sdk = ThirdwebSDK("{{chainNameOrRpc}}", options=SDKOptions(secret_key="YOUR_SECRET_KEY"))
contract = sdk.get_contract("{{contract_address}}")`,
    go: `import "github.com/thirdweb-dev/go-sdk/thirdweb"

sdk, err := thirdweb.NewThirdwebSDK("{{chainNameOrRpc}}", &thirdweb.SDKOptions{
  SecretKey: "YOUR_SECRET_KEY",
})
contract, err := sdk.GetContract("{{contract_address}}")
`,
    unity: `using Thirdweb;

// Reference the SDK
var sdk = ThirdwebManager.Instance.SDK;

// Get your contract
var contract = sdk.GetContract("{{contract_address}}");`,
  },
  read: {
    javascript: `const data = await contract.call("{{function}}", [{{args}}])`,
    react: `import { useContract, useContractRead } from "@thirdweb-dev/react";

export default function Component() {
  const { contract } = useContract("{{contract_address}}");
  const { data, isLoading } = useContractRead(contract, "{{function}}", [{{args}}])
}`,
    "react-native": `import { useContract, useContractRead } from "@thirdweb-dev/react-native";

export default function Component() {
  const { contract } = useContract("{{contract_address}}");
  const { data, isLoading } = useContractRead(contract, "{{function}}", [{{args}}])
}`,
    python: `data = contract.call("{{function}}", {{args}})`,
    go: `data, err := contract.Call("{{function}}", {{args}})`,
  },
  write: {
    javascript: `const data = await contract.call("{{function}}", [{{args}}])`,
    react: `import { useContract, useContractWrite } from "@thirdweb-dev/react";

export default function Component() {
  const { contract } = useContract("{{contract_address}}");
  const { mutateAsync: {{function}}, isLoading } = useContractWrite(contract, "{{function}}")

  const call = async () => {
    try {
      const data = await {{function}}({ args: [{{args}}] });
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  }
}`,
    "react-native": `import { useContract, useContractWrite } from "@thirdweb-dev/react-native";

export default function Component() {
  const { contract } = useContract("{{contract_address}}");
  const { mutateAsync: {{function}}, isLoading } = useContractWrite(contract, "{{function}}")

  const call = async () => {
    try {
      const data = await {{function}}({ args: [{{args}}] });
      console.info("contract call successs", data);
    } catch (err) {
      console.error("contract call failure", err);
    }
  }
}`,
    web3button: `import { Web3Button } from "@thirdweb-dev/react";

export default function Component() {
  return (
    <Web3Button
      contractAddress="{{contract_address}}"
      action={(contract) => {
        contract.call("{{function}}", [{{args}}])
      }}
    >
      {{function}}
    </Web3Button>
  )
}`,
    python: `data = contract.call("{{function}}", {{args}})`,
    go: `data, err := contract.Call("{{function}}", {{args}})`,
  },
  events: {
    javascript: `// You can get a specific event
const events = await contract.events.getEvents("{{function}}")
// All events
const allEvents = await contract.events.getAllEvents();
// Or set up a listener for all events
const listener = await contract.events.listenToAllEvents();`,
    react: `import { useContract, useContractEvents } from "@thirdweb-dev/react";

export default function Component() {
  const { contract } = useContract("{{contract_address}}");
  // You can get a specific event
  const { data: event } = useContractEvents(contract, "{{function}}")
  // All events
  const { data: allEvents } = useContractEvents(contract)
  // By default, you set up a listener for all events, but you can disable it
  const { data: eventWithoutListener } = useContractEvents(contract, undefined, { subscribe: false })
}`,
    "react-native": `import { useContract, useContractEvents } from "@thirdweb-dev/react-native";

export default function Component() {
  const { contract } = useContract("{{contract_address}}");
  // You can get a specific event
  const { data: event } = useContractEvents(contract, "{{function}}")
  // All events
  const { data: allEvents } = useContractEvents(contract)
  // By default, you set up a listener for all events, but you can disable it
  const { data: eventWithoutListener } = useContractEvents(contract, undefined, { subscribe: false })
}`,
    python: `events = contract.get_events("{{function}}", {{args}})`,
    go: `events, err := contract.GetEvents("{{function}}", {{args}})`,
  },
};

function getExportName(slug: string) {
  let exportName = slug
    .split("-")
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join("");

  // if chainName starts with a number, prepend an underscore
  if (exportName.match(/^[0-9]/)) {
    exportName = `_${exportName}`;
  }
  return exportName;
}

interface SnippetOptions {
  contractAddress?: string;
  fn?: string;
  args?: string[];
  chainName?: string;
  rpcUrl?: string;
  address?: string;
  clientId?: string;
}

export function formatSnippet(
  snippet: Record<CodeEnvironment, any>,
  {
    contractAddress,
    fn,
    args,
    chainName,
    rpcUrl,
    address,
    clientId,
  }: SnippetOptions,
) {
  const code = { ...snippet };
  const preSupportedSlugs = defaultChains.map((chain) => chain.slug);
  for (const key of Object.keys(code)) {
    const env = key as CodeEnvironment;

    code[env] = code[env]
      ?.replace(/{{contract_address}}/gm, contractAddress || "0x...")
      ?.replace(/{{factory_address}}/gm, contractAddress || "0x...")
      ?.replace(/{{wallet_address}}/gm, address)
      ?.replace("YOUR_CLIENT_ID", clientId || "YOUR_CLIENT_ID")

      ?.replace(
        'import {{chainName}} from "@thirdweb-dev/chains";',
        preSupportedSlugs.includes(chainName as any)
          ? ""
          : `import ${
              env === "javascript" ? "{ {{chainName}} }" : "{{chainName}}"
            } from "@thirdweb-dev/chains";`,
      )
      ?.replace(
        /{{chainName}}/gm,
        !chainName || chainName?.startsWith("0x") || chainName?.endsWith(".eth")
          ? '"ethereum"'
          : preSupportedSlugs.includes(chainName as any)
          ? `"${chainName}"`
          : env === "javascript"
          ? getExportName(chainName)
          : `{ ${getExportName(chainName)} }`,
      )
      ?.replace(/{{function}}/gm, fn || "")
      ?.replace(
        /{{chainNameOrRpc}}/gm,
        preSupportedSlugs.includes(chainName as any)
          ? chainName
          : rpcUrl?.replace(
              // eslint-disable-next-line no-template-curly-in-string
              "${THIRDWEB_API_KEY}",
              DASHBOARD_THIRDWEB_CLIENT_ID,
            ) || "",
      );

    if (args && args?.some((arg) => arg)) {
      code[env] = code[env]?.replace(/{{args}}/gm, args?.join(", ") || "");
    } else {
      code[env] = code[env]
        ?.replace(", {{args}}", "")
        ?.replace("{{args}}, ", "");
    }
  }

  return code;
}

export const CodeOverview: React.FC<CodeOverviewProps> = ({
  abi,
  contractAddress = constants.AddressZero,
  onlyInstall = false,
  chain,
  noSidebar = false,
}) => {
  const defaultEnvironment = useSingleQueryParam(
    "environment",
  ) as CodeEnvironment;
  const [environment, setEnvironment] = useState<CodeEnvironment>(
    defaultEnvironment || "javascript",
  );
  const router = useRouter();

  const [tab, setTab] = useState("write");
  const { data } = useFeatureContractCodeSnippetQuery(environment);
  const enabledExtensions = useContractEnabledExtensions(abi);
  const address = useAddress();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const isAccountFactory = enabledExtensions.some(
    (extension) => extension.name === "AccountFactory",
  );

  const filteredData = useMemo(() => {
    if (!data) {
      return {};
    }
    return filterData(data, enabledExtensions);
  }, [data, enabledExtensions]);

  const foundExtensions = useMemo(() => {
    return Object.keys(filteredData || {}).sort();
  }, [filteredData]);

  const chainId = useDashboardEVMChainId();
  const chainInfo = useSupportedChain(chainId || -1);
  const chainName = chain?.slug || chainInfo?.slug;
  const rpc = chain?.rpc[0] || chainInfo?.rpc[0];

  const functions = useContractFunctions(abi as Abi);
  const events = useContractEvents(abi as Abi);
  const { readFunctions, writeFunctions } = useMemo(() => {
    return {
      readFunctions: functions?.filter(
        (f) => f.stateMutability === "view" || f.stateMutability === "pure",
      ),
      writeFunctions: functions?.filter(
        (f) => f.stateMutability !== "view" && f.stateMutability !== "pure",
      ),
    };
  }, [functions]);

  const [read, setRead] = useState(
    readFunctions && readFunctions.length > 0 ? readFunctions[0] : undefined,
  );
  const [write, setWrite] = useState(
    writeFunctions && writeFunctions.length > 0 ? writeFunctions[0] : undefined,
  );
  const [event, setEvent] = useState(
    events && events.length > 0 ? events[0] : undefined,
  );

  return (
    <SimpleGrid
      columns={12}
      gap={16}
      justifyContent="space-between"
      maxW="full"
      overflowX={{ base: "scroll", md: "hidden" }}
      display={{ base: "block", md: "grid" }}
    >
      <GridItem
        as={Flex}
        colSpan={{ base: 12, md: noSidebar ? 12 : 9 }}
        flexDir="column"
        gap={12}
      >
        {isAccountFactory && (
          <Flex flexDirection="column" gap={4}>
            <Flex flexDir="column" gap={6} id="integrate-smart-wallet">
              <Heading size="title.md">
                Integrate your smart wallet factory
              </Heading>
              <Alert
                status="info"
                borderRadius="md"
                as={Flex}
                flexDir="column"
                alignItems="start"
                gap={2}
              >
                <Flex justifyContent="start">
                  <AlertIcon />
                  <AlertTitle>Smart Wallet Factory</AlertTitle>
                </Flex>
                <AlertDescription>
                  The recommended way to use account factories is to integrate
                  the{" "}
                  <TrackedLink
                    isExternal
                    href="https://portal.thirdweb.com/wallet/smart-wallet"
                    category="accounts-page"
                    label="wallet-sdk"
                    color="primary.500"
                  >
                    Wallet SDK
                  </TrackedLink>{" "}
                  in your applications. This will ensure account contracts are
                  deployed for your users only when they need it.
                </AlertDescription>
              </Alert>
              <Flex flexDir="column" gap={2}>
                <CodeSegment
                  environment={environment}
                  setEnvironment={setEnvironment}
                  snippet={formatSnippet(
                    (WALLETS_SNIPPETS.find((w) => w.id === "smart-wallet")
                      ?.supportedLanguages || {}) as any,
                    {
                      contractAddress,
                      chainName,
                      address,
                    },
                  )}
                  hideTabs
                />
              </Flex>
            </Flex>
          </Flex>
        )}
        <Flex flexDirection="column" gap={4}>
          <Flex flexDir="column" gap={2} id="getting-started">
            <Heading size="title.md">
              {isAccountFactory
                ? "Direct contract interaction (advanced)"
                : chain
                ? `Getting Started with ${chain.name}`
                : "Getting Started"}
            </Heading>
          </Flex>
          {(noSidebar || isMobile) && (
            <Flex flexDir="column" gap={2}>
              <Text>Choose a language:</Text>
              <CodeSegment
                onlyTabs
                environment={environment}
                setEnvironment={setEnvironment}
                snippet={COMMANDS.install}
              />
            </Flex>
          )}
          <Flex flexDir="column" gap={2}>
            {environment === "react-native" || environment === "unity" ? (
              <Text>
                Install the latest version of the SDK. <br />
                <TrackedLink
                  color={"primary.500"}
                  href={`https://portal.thirdweb.com/${environment}`}
                  isExternal
                  category="code-tab"
                  label={environment}
                >
                  Learn how in the{" "}
                  {environment === "react-native" ? "React Native" : "Unity"}{" "}
                  documentation
                </TrackedLink>
                .
              </Text>
            ) : (
              <>
                <Text>Install the latest version of the SDK:</Text>
                <CodeSegment
                  hideTabs
                  isInstallCommand
                  environment={environment}
                  setEnvironment={setEnvironment}
                  snippet={COMMANDS.install}
                />
              </>
            )}
          </Flex>
          <Flex flexDir="column" gap={2}>
            <Text>Initialize the SDK and contract on your project:</Text>
            <CodeSegment
              environment={environment}
              setEnvironment={setEnvironment}
              snippet={formatSnippet(COMMANDS.setup as any, {
                contractAddress,
                chainName,
                rpcUrl: rpc,
              })}
              hideTabs
            />
            <Text>
              You will need to pass a client ID/secret key to use
              thirdweb&apos;s infrastructure services. If you don&apos;t have
              any API keys yet you can create one for free from the{" "}
              <Link href="/dashboard/settings/api-keys" color="primary.500">
                dashboard settings
              </Link>
              .
            </Text>
          </Flex>
        </Flex>
        {!onlyInstall ? (
          <>
            {foundExtensions.length > 0 ? (
              <SimpleGrid columns={1} gap={12}>
                {foundExtensions.map((extension) => {
                  const extensionData: any[] = filteredData[
                    extension
                  ] as unknown as any[];
                  return (
                    <Flex
                      key={extension}
                      flexDirection="column"
                      gap={3}
                      id={extension}
                    >
                      <Flex flexDir="column" gap={2}>
                        <Flex gap={1} alignItems="center">
                          <Image
                            src="/assets/dashboard/extension-check.svg"
                            alt="Extension detected"
                            objectFit="contain"
                            mb="2px"
                          />
                          <Text
                            textTransform="uppercase"
                            size="label.sm"
                            letterSpacing={0.1}
                          >
                            Extension
                          </Text>
                        </Flex>
                        <Heading size="title.md">{extension}</Heading>
                      </Flex>

                      <Accordion allowMultiple>
                        {extensionData?.map((ext) => {
                          return (
                            <Box key={ext.name}>
                              <AccordionItem
                                borderColor="gray.900"
                                borderBottom="none"
                              >
                                <AccordionButton
                                  justifyContent="space-between"
                                  py={2}
                                  px={0}
                                >
                                  <Text size="label.md" opacity="0.9">
                                    {ext.summary}
                                  </Text>
                                  <AccordionIcon />
                                </AccordionButton>
                                <AccordionPanel px={0}>
                                  <Flex flexDir="column" gap={4}>
                                    <CodeSegment
                                      hideTabs
                                      environment={environment}
                                      setEnvironment={setEnvironment}
                                      snippet={formatSnippet(ext.examples, {
                                        contractAddress,
                                        chainName,
                                        address,
                                      })}
                                    />
                                  </Flex>
                                </AccordionPanel>
                              </AccordionItem>
                            </Box>
                          );
                        })}
                      </Accordion>
                    </Flex>
                  );
                })}
              </SimpleGrid>
            ) : null}
            <Flex flexDirection="column" gap={6} id="functions-and-events">
              <Heading size="title.md">All Functions & Events</Heading>
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
                    {((writeFunctions || []).length > 0 ||
                      (readFunctions || []).length > 0) && (
                      <Tabs
                        colorScheme="gray"
                        h="100%"
                        position="relative"
                        display="flex"
                        flexDir="column"
                      >
                        <TabList as={Flex}>
                          {(writeFunctions || []).length > 0 && (
                            <Tab gap={2} flex={"1 1 0"}>
                              <Heading color="inherit" my={1} size="label.md">
                                Write
                              </Heading>
                            </Tab>
                          )}
                          {(readFunctions || []).length > 0 && (
                            <Tab gap={2} flex={"1 1 0"}>
                              <Heading color="inherit" my={1} size="label.md">
                                Read
                              </Heading>
                            </Tab>
                          )}
                          {(events || []).length > 0 && (
                            <Tab gap={2} flex={"1 1 0"}>
                              <Heading color="inherit" my={1} size="label.md">
                                Events
                              </Heading>
                            </Tab>
                          )}
                        </TabList>
                        <TabPanels h="auto" overflow="auto">
                          <TabPanel>
                            {writeFunctions?.map((fn) => (
                              <ListItem my={0.5} key={fn.signature}>
                                <Button
                                  size="sm"
                                  fontWeight={
                                    tab === "write" &&
                                    (write as AbiFunction).signature ===
                                      (fn as AbiFunction).signature
                                      ? 600
                                      : 400
                                  }
                                  opacity={
                                    tab === "write" &&
                                    (write as AbiFunction).signature ===
                                      (fn as AbiFunction).signature
                                      ? 1
                                      : 0.65
                                  }
                                  onClick={() => {
                                    setTab("write");
                                    setWrite(fn);
                                  }}
                                  color="heading"
                                  _hover={{
                                    opacity: 1,
                                    textDecor: "underline",
                                  }}
                                  variant="link"
                                  fontFamily="mono"
                                >
                                  {fn.name}
                                </Button>
                              </ListItem>
                            ))}
                          </TabPanel>
                          <TabPanel>
                            {readFunctions?.map((fn) => (
                              <ListItem my={0.5} key={fn.signature}>
                                <Button
                                  size="sm"
                                  fontWeight={
                                    tab === "read" &&
                                    (read as AbiFunction).signature ===
                                      (fn as AbiFunction).signature
                                      ? 600
                                      : 400
                                  }
                                  opacity={
                                    tab === "read" &&
                                    (read as AbiFunction).signature ===
                                      (fn as AbiFunction).signature
                                      ? 1
                                      : 0.65
                                  }
                                  onClick={() => {
                                    setTab("read");
                                    setRead(fn);
                                  }}
                                  color="heading"
                                  _hover={{
                                    opacity: 1,
                                    textDecor: "underline",
                                  }}
                                  variant="link"
                                  fontFamily="mono"
                                >
                                  {fn.name}
                                </Button>
                              </ListItem>
                            ))}
                          </TabPanel>
                          <TabPanel>
                            {events?.map((ev) => (
                              <ListItem my={0.5} key={ev.name}>
                                <Button
                                  size="sm"
                                  fontWeight={
                                    tab === "events" &&
                                    (event as AbiEvent).name ===
                                      (ev as AbiEvent).name
                                      ? 600
                                      : 400
                                  }
                                  opacity={
                                    tab === "events" &&
                                    (event as AbiEvent).name ===
                                      (ev as AbiEvent).name
                                      ? 1
                                      : 0.65
                                  }
                                  onClick={() => {
                                    setTab("events");
                                    setEvent(ev);
                                  }}
                                  color="heading"
                                  _hover={{
                                    opacity: 1,
                                    textDecor: "underline",
                                  }}
                                  variant="link"
                                  fontFamily="mono"
                                >
                                  {ev.name}
                                </Button>
                              </ListItem>
                            ))}
                          </TabPanel>
                        </TabPanels>
                      </Tabs>
                    )}
                  </List>
                </GridItem>
                <GridItem
                  as={Card}
                  height="100%"
                  overflow="auto"
                  colSpan={{ base: 12, md: 8 }}
                >
                  <CodeSegment
                    environment={environment}
                    setEnvironment={setEnvironment}
                    snippet={formatSnippet(
                      COMMANDS[tab as keyof typeof COMMANDS] as any,
                      {
                        contractAddress,
                        fn:
                          tab === "read"
                            ? read?.name
                            : tab === "write"
                            ? write?.name
                            : event?.name,
                        args: (tab === "read"
                          ? readFunctions
                          : tab === "write"
                          ? writeFunctions
                          : events
                        )
                          ?.find(
                            (f) =>
                              f.name ===
                              (tab === "read"
                                ? read?.name
                                : tab === "write"
                                ? write?.name
                                : event?.name),
                          )
                          ?.inputs?.map((i) => i.name),
                        chainName,
                      },
                    )}
                  />
                </GridItem>
              </SimpleGrid>
            </Flex>
          </>
        ) : null}
      </GridItem>
      {noSidebar || isMobile ? null : (
        <GridItem
          as={Flex}
          colSpan={{ base: 12, md: 3 }}
          flexDir="column"
          gap={3}
        >
          <Flex flexDir="column" gap={2}>
            <Text>Choose a language:</Text>
            <Select
              onChange={(e) => {
                router.push(
                  `/${chainName}/${contractAddress}/code?environment=${e.target.value}`,
                );
                setEnvironment(e.target.value as CodeEnvironment);
              }}
              value={environment}
            >
              <option value="javascript">JavaScript</option>
              <option value="react">React</option>
              <option value="react-native">React Native</option>
              <option value="python">Python</option>
              <option value="go">Go</option>
              <option value="unity">Unity</option>
            </Select>
          </Flex>
          <Divider my={2} />
          <Link href="#getting-started">
            <Text size="body.md">Getting Started</Text>
          </Link>

          {foundExtensions.map((ext) => (
            <Link key={ext} href={`#${ext}`}>
              <Flex gap={2}>
                <Image
                  src="/assets/dashboard/extension-check.svg"
                  alt="Extension detected"
                  objectFit="contain"
                  mb="1px"
                />
                <Text size="body.md">{ext}</Text>
              </Flex>
            </Link>
          ))}

          <Link href="#functions-and-events">
            <Text size="body.md">All Functions & Events</Text>
          </Link>
        </GridItem>
      )}
    </SimpleGrid>
  );
};

function filterData(
  data: SnippetApiResponse,
  enabledExtensions: FeatureWithEnabled[],
) {
  const allowedKeys = enabledExtensions
    .filter((extension) => extension.enabled)
    .map((extension) => extension.name as keyof SnippetApiResponse);
  const filteredData: Partial<SnippetApiResponse> = {};

  for (const key in data) {
    if (allowedKeys.includes(key as keyof SnippetApiResponse)) {
      filteredData[key as keyof SnippetApiResponse] = data[key];
    }
  }

  return filteredData;
}
