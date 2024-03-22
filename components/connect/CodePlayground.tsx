import {
  Flex,
  List,
  ListItem,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { defaultChains } from "@thirdweb-dev/chains";
import { CodeEnvironment } from "components/contract-tabs/code/types";
import { DASHBOARD_THIRDWEB_CLIENT_ID } from "constants/rpc";
import { themes } from "prism-react-renderer";
import React, { useState } from "react";
import { Button, Card, CodeBlock } from "tw-components";
import ConnectPlaygroundButton, {
  CodeOptions,
} from "./ConnectPlaygroundButton";
import { connectPlaygroundData } from "components/product-pages/common/connect/data";
import ConnectPlaygroundTab from "./ConnectPlaygroundTab";
import { ChakraNextImage } from "components/Image";
import { Aurora } from "components/homepage/Aurora";

const COMMANDS = {
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
  },
} as Record<"read" | "write" | "events", Record<CodeOptions, string>>;

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

function formatSnippet(
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

const CodePlayground = ({
  TRACKING_CATEGORY,
}: {
  TRACKING_CATEGORY: string;
}) => {
  const [tab, setTab] = useState("write");

  const readFunctions = connectPlaygroundData.readFunctions;
  const writeFunctions = connectPlaygroundData.writeFunctions;
  const events = connectPlaygroundData.events;

  const [event, setEvent] = useState(events[0]);

  const [read, setRead] = useState(readFunctions[0]);

  const [write, setWrite] = useState(readFunctions[0]);

  const [environment, setEnvironment] = useState<CodeOptions>("javascript");

  const snippet = formatSnippet(COMMANDS[tab as keyof typeof COMMANDS] as any, {
    contractAddress: "0x6fb2A6C41B44076bc491cC285BA629c0715a6a1b",
    fn:
      tab === "read" ? read?.name : tab === "write" ? write?.name : event?.name,
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
  });

  const activeEnvironment: CodeEnvironment = (
    snippet[environment] ? environment : Object.keys(snippet)[0]
  ) as CodeOptions;

  const activeSnippet = snippet[activeEnvironment];

  const lines = activeSnippet ? activeSnippet?.split("\n") : [];

  const languages = Object.keys(
    COMMANDS[tab as keyof typeof COMMANDS],
  ) as CodeOptions[];

  const code = lines.join("\n").trim();

  const computeLanguage = (language: CodeOptions) => {
    const withSpaces = language.replace(/-/g, " ");

    const capitalizedWords = withSpaces
      .split(" ")
      .map(
        (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(),
      );

    return capitalizedWords.join(" ");
  };

  return (
    <Flex
      alignItems="stretch"
      gap="18px"
      position="relative"
      flexDir={{ base: "column", lg: "row" }}
      mt={{ base: "60px", sm: "140px" }}
      w="full"
    >
      <ChakraNextImage
        src={require("public/assets/product-pages/connect/membership-overlay.svg")}
        alt="membership-overlay"
        position="absolute"
        top={{ base: "-40px", sm: "-80px", md: "-120px" }}
        left="50%"
        w="full"
        maxW={{ base: "calc(100% - 60px)", md: "697px" }}
        transform="translateX(-50%)"
      />
      <Aurora
        pos={{ left: "50%", top: "50%" }}
        size={{ width: "1500px", height: "1500px" }}
        color={"hsl(280deg 78% 30% / 30%)"}
        zIndex={3}
      />

      <List
        overflowX="hidden"
        width="100%"
        maxW={{ base: "full", lg: "310px" }}
        position="relative"
        zIndex={3}
        mt="-2px"
      >
        <Tabs
          colorScheme="gray"
          h="100%"
          position="relative"
          display="flex"
          flexDir="column"
        >
          <Flex
            background="rgba(0,0,0,1)"
            boxShadow="0 0 1px 1px hsl(0deg 0% 100% / 15%)"
            justify={"center"}
            transform={{ base: "translateY(20px)", md: "translateY(50%)" }}
            zIndex={100}
            backdropFilter={"blur(10px)"}
            borderRadius={"8px"}
            padding="2px"
            gap={"2px"}
            flexWrap="wrap"
            w="100%"
            margin="0 auto"
            maxW="fit-content"
          >
            <TabList as={Flex} border="none" w="100%">
              <ConnectPlaygroundTab
                TRACKING_CATEGORY={TRACKING_CATEGORY}
                label="write"
              >
                Write
              </ConnectPlaygroundTab>

              <ConnectPlaygroundTab
                TRACKING_CATEGORY={TRACKING_CATEGORY}
                label="read"
              >
                Read
              </ConnectPlaygroundTab>

              <ConnectPlaygroundTab
                TRACKING_CATEGORY={TRACKING_CATEGORY}
                label="events"
              >
                Events
              </ConnectPlaygroundTab>
            </TabList>
          </Flex>
          <Flex
            as={Card}
            w="full"
            p={0}
            background="rgba(0,0,0,1)"
            border="1px solid 0 0 1px 1px hsl(0deg 0% 100% / 15%)"
            position="relative"
            width="100%"
          >
            <TabPanels
              h="auto"
              overflow="auto"
              maxH={{ base: "252px", lg: "452px" }}
              mt={10}
              pb={6}
              height="full"
            >
              <TabPanel py={0}>
                {writeFunctions?.map((fn) => (
                  <ListItem key={fn.signature}>
                    <Button
                      size="sm"
                      fontWeight={
                        tab === "write" && write.signature === fn.signature
                          ? 600
                          : 400
                      }
                      opacity={
                        tab === "write" && write.signature === fn.signature
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
              <TabPanel py={0}>
                {readFunctions?.map((fn) => (
                  <ListItem key={fn.signature}>
                    <Button
                      size="sm"
                      fontWeight={
                        tab === "read" && read.signature === fn.signature
                          ? 600
                          : 400
                      }
                      opacity={
                        tab === "read" && read.signature === fn.signature
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
              <TabPanel py={0}>
                {events?.map((ev) => (
                  <ListItem key={ev.name}>
                    <Button
                      size="sm"
                      fontWeight={
                        tab === "events" && event.name === ev.name ? 600 : 400
                      }
                      opacity={
                        tab === "events" && event.name === ev.name ? 1 : 0.65
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
          </Flex>
        </Tabs>
      </List>

      <Flex
        as={Card}
        border="none"
        flexDir="column"
        flex={1}
        p={0}
        position="relative"
        zIndex={3}
      >
        <Flex
          background="rgba(0,0,0,0.6)"
          boxShadow="0 0 1px 1px hsl(0deg 0% 100% / 15%)"
          justify={"center"}
          margin="0 auto"
          transform={{ base: "translateY(20px)", lg: "translateY(50%)" }}
          zIndex={100}
          backdropFilter={"blur(10px)"}
          borderRadius={"8px"}
          gap={"2px"}
          flexWrap="wrap"
          maxW={{ base: "calc(100% - 40px)", sm: "calc(100% - 60px)" }}
        >
          {languages.map((language, idx) => (
            <ConnectPlaygroundButton
              key={`${language}-${idx}`}
              language={language}
              activeLanguage={activeEnvironment}
              setActiveLanguage={setEnvironment}
            >
              {computeLanguage(language)}
            </ConnectPlaygroundButton>
          ))}
        </Flex>

        <Card
          p={0}
          background="rgba(0,0,0,0.6)"
          boxShadow="0 0 1px 1px hsl(0deg 0% 100% / 15%)"
          position="relative"
          border="none"
          flex={1}
          w="full"
          margin="0 auto"
        >
          <CodeBlock
            darkTheme={themes.dracula}
            code={code}
            language={
              environment === "react" ||
              environment === "react-native" ||
              environment === "web3button"
                ? "jsx"
                : environment === "unity"
                  ? "cpp"
                  : environment
            }
            backgroundColor="transparent"
            borderWidth={0}
            pt={6}
            pb={{ base: 12, md: 6 }}
            mt={4}
          />
        </Card>
      </Flex>
    </Flex>
  );
};

export default CodePlayground;
