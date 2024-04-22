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
import { useSupportedChain } from "hooks/chains/configureChains";
import { useSingleQueryParam } from "hooks/useQueryParam";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";
import { Button, Card, Heading, Link, Text, TrackedLink } from "tw-components";

interface CodeOverviewProps {
  abi?: Abi;
  contractAddress?: string;
  onlyInstall?: boolean;
  chainId?: number;
  noSidebar?: boolean;
}

// TODO replace `resolveMethod` with the fn actual signatures

export const COMMANDS = {
  install: {
    javascript: "npm i thirdweb",
    react: "npm i thirdweb",
    "react-native": "npm i thirdweb",
    unity: `// Download the .unitypackage from the latest release:
// https://github.com/thirdweb-dev/unity-sdk/releases
// and drag it into your project`,
  },
  setup: {
    javascript: `import { createThirdwebClient, getContract } from "thirdweb";
import { defineChain } from "thirdweb/chains";

// create the client with your clientId, or secretKey if in a server environment
const client = createThirdwebClient({ 
  clientId: "YOUR_CLIENT_ID"
 });

// connect to your contract
const contract = getContract({ 
  client, 
  chain: defineChain({{chainId}}), 
  address: "{{contract_address}}"
});`,
    react: `import { createThirdwebClient, getContract, resolveMethod } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { ThirdwebProvider } from "thirdweb/react";

// create the client with your clientId, or secretKey if in a server environment
export const client = createThirdwebClient({ 
  clientId: "YOUR_CLIENT_ID" 
});

// connect to your contract
export const contract = getContract({ 
  client, 
  chain: defineChain({{chainId}}), 
  address: "{{contract_address}}"
});

function App() {
  return (
    <ThirdwebProvider>
      <Component />
    </ThirdwebProvider>
  )
}`,
    "react-native": `import { createThirdwebClient, getContract, resolveMethod } from "thirdweb";
import { defineChain } from "thirdweb/chains";
import { ThirdwebProvider } from "thirdweb/react";

// create the client with your clientId, or secretKey if in a server environment
export const client = createThirdwebClient({ 
  clientId: "YOUR_CLIENT_ID" 
});

// connect to your contract
export const contract = getContract({ 
  client, 
  chain: defineChain({{chainId}}), 
  address: "{{contract_address}}",
});

function App() {
  return (
    <ThirdwebProvider>
      <Component />
    </ThirdwebProvider>
  )
}
`,
    unity: `using Thirdweb;

// Reference the SDK
var sdk = ThirdwebManager.Instance.SDK;

// Get your contract
var contract = sdk.GetContract("{{contract_address}}");`,
  },
  read: {
    javascript: `import { readContract, resolveMethod } from "thirdweb";

const data = await readContract({ 
  contract, 
  method: resolveMethod("{{function}}"), 
  params: [{{args}}] 
})`,
    react: `import { resolveMethod } from "thirdweb";
    import { useReadContract } from "thirdweb/react";

export default function Component() {
  const { data, isLoading } = useReadContract({ 
    contract, 
    method: resolveMethod("{{function}}"), 
    params: [{{args}}] 
  });
}`,
    "react-native": `import { useReadContract } from "thirdweb/react";

export default function Component() {
  const { data, isLoading } = useReadContract({ 
    contract, 
    method: resolveMethod("{{function}}"), 
    params: [{{args}}] 
  });
}`,
  },
  write: {
    javascript: `import { prepareContractCall, sendTransaction, resolveMethod } from "thirdweb";

const transaction = await prepareContractCall({ 
  contract, 
  method: resolveMethod("{{function}}"), 
  params: [{{args}}] 
});
const { transactionHash } = await sendTransaction({ 
  transaction, 
  account 
})`,
    react: `import { prepareContractCall, resolveMethod } from "thirdweb"
import { useSendTransaction } from "thirdweb/react";

export default function Component() {
  const { mutate: sendTransaction, isLoading, isError } = useSendTransaction();

  const call = async () => {
    const transaction = await prepareContractCall({ 
      contract, 
      method: resolveMethod("{{function}}"), 
      params: [{{args}}] 
    });
    const { transactionHash } = await sendTransaction(transaction);
  }
}`,
    "react-native": `import { prepareContractCall } from "thirdweb"
import { useSendTransaction } from "thirdweb/react";
    
export default function Component() {
  const { mutate: sendTransaction, isLoading, isError } = useSendTransaction();
    
  const call = async () => {
    const transaction = await prepareContractCall({ 
      contract, 
      method: resolveMethod("{{function}}"), 
      params: [{{args}}] 
    });
    const { transactionHash } = await sendTransaction(transaction);
  }
}`,
    //     web3button: `import { TransactionButton } from "thirdweb/react";

    // export default function Component() {
    //   return (
    //     <TransactionButton
    //       transaction={() => prepareContractCall({
    //         contract,
    //         method: resolveMethod("{{function}}"),
    //         params: [{{args}}]
    //       })}
    //     >
    //       {{function}}
    //     </TransactionButton>
    //   )
    // }`,
  },
  events: {
    javascript: `import { prepareEvent, getContractEvents } from "thirdweb";

const preparedEvent = prepareEvent({ 
  contract, 
  signature: "{{function}}" 
});
const events = await getContractEvents({ 
  contract, 
  events: [preparedEvent] 
});`,
    react: `import { prepareEvent } from "thirdweb";
import { useContractEvents } from "thirdweb/react";

const preparedEvent = prepareEvent({ 
  contract, 
  signature: "{{function}}" 
});

export default function Component() {
  const { data: event } = useContractEvents({ 
    contract, 
    events: [preparedEvent] 
  });
}`,
    "react-native": `import { prepareEvent } from "thirdweb";
    import { useContractEvents } from "thirdweb/react";
    
    const preparedEvent = prepareEvent({ 
      contract, 
      signature: "{{function}}" 
    });
    
    export default function Component() {
      const { data: event } = useContractEvents({ 
        contract, 
        events: [preparedEvent] 
      });
    }`,
  },
};

const WALLETS_SNIPPETS = [
  {
    id: "smart-wallet",
    name: "Account Abstraction",
    description: "Deploy accounts for your users",
    iconUrl:
      "ipfs://QmeAJVqn17aDNQhjEU3kcWVZCFBrfta8LzaDGkS8Egdiyk/smart-wallet.svg",
    link: "https://portal.thirdweb.com/references/wallets/latest/SmartWallet",
    supportedLanguages: {
      javascript: `import { defineChain } from "thirdweb";
import { embeddedWallet, smartWallet } from "thirdweb/wallets";

const chain = defineChain({{chainId}});

// First, connect the personal wallet, which can be any wallet (metamask, embedded, etc.)
const personalWallet = embeddedWallet();
const peronalAccount = await personalWallet.connect({
  client,
  chain,
  strategy: "google",
});

// Then, connect the Smart Account
const wallet = smartWallet({
  chain, // the chain where your account will be or is deployed
  factoryAddress: "{{factory_address}}", // your own deployed account factory address
  gasless: true, // enable or disable gasless transactions
});
const smartAccount = await wallet.connect({
  client,
  personalWallet,
});`,
      react: `import { defineChain } from "thirdweb";
import { ThirdwebProvider, ConnectButton } from "thirdweb/react";

export default function App() {
return (
    <ThirdwebProvider>
      <ConnectWallet 
        client={client}
        accountAbstraction={{
          chain: defineChain({{chainId}}),
          factoryAddress: "{{factory_address}}",
          gasless: true,
        }}
      />
    </ThirdwebProvider>
  );
}`,
      unity: `using Thirdweb;

public async void ConnectWallet()
{
    // Reference to your Thirdweb SDK
    var sdk = ThirdwebManager.Instance.SDK;

    // Configure the connection
    var connection = new WalletConnection(
      provider: WalletProvider.SmartWallet,        // The wallet provider you want to connect to (Required)
      chainId: 1,                                  // The chain you want to connect to (Required)
      password: "myEpicPassword",                  // If using a local wallet as personal wallet (Optional)
      email: "email@email.com",                    // If using an email wallet as personal wallet (Optional)
      personalWallet: WalletProvider.LocalWallet   // The personal wallet you want to use with your Account (Optional)
    );

    // Connect the wallet
    string address = await sdk.wallet.Connect(connection);
}`,
    },
  },
];

interface SnippetOptions {
  contractAddress?: string;
  fn?: string;
  args?: string[];
  address?: string;
  clientId?: string;
  chainId?: number;
}

export function formatSnippet(
  snippet: Record<CodeEnvironment, any>,
  { contractAddress, fn, args, chainId, address, clientId }: SnippetOptions,
) {
  const code = { ...snippet };

  for (const key of Object.keys(code)) {
    const env = key as CodeEnvironment;

    code[env] = code[env]
      ?.replace(/{{contract_address}}/gm, contractAddress || "0x...")
      ?.replace(/{{factory_address}}/gm, contractAddress || "0x...")
      ?.replace(/{{wallet_address}}/gm, address)
      ?.replace("YOUR_CLIENT_ID", clientId || "YOUR_CLIENT_ID")
      ?.replace(/{{function}}/gm, fn || "")
      ?.replace(/{{chainId}}/gm, chainId || 1);

    if (args && args?.some((arg) => arg)) {
      code[env] = code[env]?.replace(/{{args}}/gm, args?.join(", ") || "");
    } else {
      code[env] = code[env]?.replace(/{{args}}/gm, "");
    }
  }

  return code;
}

export const CodeOverview: React.FC<CodeOverviewProps> = ({
  abi,
  contractAddress = "0x...",
  onlyInstall = false,
  noSidebar = false,
  chainId: chainIdProp,
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

  const chainId = useDashboardEVMChainId() || chainIdProp || 1;
  const chainInfo = useSupportedChain(chainId || -1);

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
              <Heading size="title.md">Integrate your account factory</Heading>
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
                  <AlertTitle>Account Factory</AlertTitle>
                </Flex>
                <AlertDescription>
                  The recommended way to use account factories is to integrate
                  the{" "}
                  <TrackedLink
                    isExternal
                    href="https://portal.thirdweb.com/references/wallets/latest/SmartWallet"
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
                      address,
                      chainId,
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
                : chainInfo
                  ? `Getting Started with ${chainInfo.name}`
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

                chainId,
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
                                        address,
                                        chainId,
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

                        chainId,
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
                const val = e.target.value;
                if (isValidEnvironment(val)) {
                  router.push(
                    `/${chainInfo?.slug || chainId}/${contractAddress}/code?environment=${val}`,
                  );
                  setEnvironment(val);
                }
              }}
              value={environment}
            >
              <option value="javascript">JavaScript</option>
              <option value="react">React</option>
              <option value="react-native">React Native</option>
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

function isValidEnvironment(env: string): env is CodeEnvironment {
  return ["javascript", "react", "react-native", "unity"].includes(env);
}

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
