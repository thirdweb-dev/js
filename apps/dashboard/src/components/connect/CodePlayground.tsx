import type { CodeEnvironment } from "@/components/blocks/code-segment.client";
import { CodeClient } from "@/components/ui/code/code.client";
import {
  Flex,
  List,
  ListItem,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ChakraNextImage } from "components/Image";
import { Aurora } from "components/homepage/Aurora";
import { connectPlaygroundData } from "components/product-pages/common/connect/data";
import { useState } from "react";
import { Button, Card } from "tw-components";
import {
  COMMANDS,
  formatSnippet,
} from "../../contract-ui/tabs/code/components/code-overview";
import ConnectPlaygroundButton, {
  type CodeOptions,
} from "./ConnectPlaygroundButton";
import ConnectPlaygroundTab from "./ConnectPlaygroundTab";

const queryClient = new QueryClient();

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

  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  const snippet = formatSnippet(COMMANDS[tab as keyof typeof COMMANDS] as any, {
    contractAddress: "0x6fb2A6C41B44076bc491cC285BA629c0715a6a1b",
    // biome-ignore lint/suspicious/noExplicitAny: FIXME
    fn: (tab === "read" ? read : tab === "write" ? write : event) as any,
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
        src={require("../../../public/assets/product-pages/connect/membership-overlay.svg")}
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
        color="hsl(280deg 78% 30% / 30%)"
        zIndex={3}
      />

      <List
        overflowX="hidden"
        width="100%"
        maxW={{ base: "full", lg: "310px" }}
        position="relative"
        zIndex={3}
        mt="-2px"
        flexShrink={0}
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
            justify="center"
            transform={{ base: "translateY(20px)", md: "translateY(50%)" }}
            zIndex={100}
            backdropFilter="blur(10px)"
            borderRadius="8px"
            padding="2px"
            gap="2px"
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
                        tab === "write" && write?.signature === fn.signature
                          ? 600
                          : 400
                      }
                      opacity={
                        tab === "write" && write?.signature === fn.signature
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
                        tab === "read" && read?.signature === fn.signature
                          ? 600
                          : 400
                      }
                      opacity={
                        tab === "read" && read?.signature === fn.signature
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
                        tab === "events" && event?.name === ev.name ? 600 : 400
                      }
                      opacity={
                        tab === "events" && event?.name === ev.name ? 1 : 0.65
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
        minW={0}
      >
        <Flex
          background="rgba(0,0,0,0.6)"
          boxShadow="0 0 1px 1px hsl(0deg 0% 100% / 15%)"
          justify="center"
          margin="0 auto"
          transform={{ base: "translateY(20px)", lg: "translateY(50%)" }}
          zIndex={100}
          backdropFilter="blur(10px)"
          borderRadius="8px"
          gap="2px"
          flexWrap="wrap"
          maxW={{ base: "calc(100% - 40px)", sm: "calc(100% - 60px)" }}
        >
          {languages.map((language) => (
            <ConnectPlaygroundButton
              key={language}
              language={language}
              activeLanguage={activeEnvironment}
              setActiveLanguage={setEnvironment}
            >
              {computeLanguage(language)}
            </ConnectPlaygroundButton>
          ))}
        </Flex>

        <QueryClientProvider client={queryClient}>
          <CodeClient
            code={code}
            lang={
              environment === "react" || environment === "react-native"
                ? "jsx"
                : environment === "unity"
                  ? "cpp"
                  : environment
            }
            scrollableClassName="h-full pt-6 pb-12 md:pb-6"
            className="h-full"
          />
        </QueryClientProvider>
      </Flex>
    </Flex>
  );
};

export default CodePlayground;
