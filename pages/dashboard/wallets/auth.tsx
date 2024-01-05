import { Flex, ListItem, SimpleGrid, UnorderedList } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { WalletsSidebar } from "core-ui/sidebar/wallets";
import { PageId } from "page-id";
import { ThirdwebNextPage } from "utils/types";
import { Card, Heading, Text, TrackedLink } from "tw-components";
import React, { useState } from "react";
import { CodeSegment } from "components/contract-tabs/code/CodeSegment";
import { CodeEnvironment } from "components/contract-tabs/code/types";

const TRACKING_CATEGORY = "auth";

const authSnippets = {
  javascript: `import { ThirdwebSDK } from "@thirdweb-dev/sdk";

const sdk = new ThirdwebSDK("goerli");

// Login with a single line of code
const payload = await sdk.auth.login();

// And verify the address of the logged in wallet
const address = await sdk.auth.verify(payload);`,
  react: `import { useSDK } from "@thirdweb-dev/react";

export default function App() {
 const sdk = useSDK();

 async function login() {
  // Login with a single line of code
  const payload = await sdk.auth.login();

  // And verify the address of the logged in wallet
  const address = await sdk.auth.verify(payload);
 }
}`,
  "react-native": "",
  python: `from thirdweb import ThirdwebSDK

sdk = ThirdwebSDK("goerli")

# Login with a single line of code
payload = sdk.auth.login();

# And verify the address of the logged in wallet
address = sdk.auth.verify(payload);`,
  go: `import "github.com/thirdweb-dev/go-sdk/thirdweb"

func main() {
  sdk, err := thirdweb.NewThirdwebSDK("goerli", nil)

  // Login with a single line of code
  payload, err := sdk.Auth.Login()

  // And verify the address of the logged in wallet
  address, err := sdk.Auth.Verify(payload)
}`,
  unity: `using Thirdweb;

// Reference the SDK
var sdk = ThirdwebManager.Instance.SDK;

// Generate and sign
LoginPayload data = await ThirdwebManager.Instance.SDK.wallet.Authenticate("example.com");

// Verify
string result = await ThirdwebManager.Instance.SDK.wallet.Verify(data);`,
};

const DashboardWalletsAuth: ThirdwebNextPage = () => {
  const [environment, setEnvironment] = useState<CodeEnvironment>("javascript");

  return (
    <Flex flexDir="column" gap={10}>
      <Flex flexDir="column" gap={4}>
        <SimpleGrid columns={{ base: 1, lg: 2 }} gap={12}>
          <Flex flexDir="column" gap={8}>
            <Heading size="title.lg" as="h1">
              Auth
            </Heading>
            <Text>
              A developer SDK that lets you integrate passwordless web3-native
              authentication and authorization into your applications.
            </Text>

            <TrackedLink
              category={TRACKING_CATEGORY}
              label="learn-more"
              href="https://portal.thirdweb.com/auth"
              color="blue.500"
              isExternal
            >
              Learn more about Auth
            </TrackedLink>
          </Flex>
        </SimpleGrid>
      </Flex>

      <Flex flexDir="column" gap={4}>
        <Heading size="title.sm" as="h2">
          Integrate into your app
        </Heading>

        <CodeSegment
          environment={environment}
          setEnvironment={setEnvironment}
          snippet={authSnippets}
        />
      </Flex>

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={4}>
        <Card
          as={Flex}
          gap={4}
          flex={1}
          bg="linear-gradient(158.84deg, rgba(255, 255, 255, 0.05) 13.95%, rgba(255, 255, 255, 0) 38.68%)"
          p={6}
        >
          <Flex flexDir={"column"} gap={2}>
            <Heading size="title.sm" as="h1">
              Docs
            </Heading>
            <UnorderedList>
              <Text as={ListItem} color="blue.500">
                <TrackedLink
                  category={TRACKING_CATEGORY}
                  label="docs"
                  trackingProps={{ breakdown: "full-docs" }}
                  href="https://portal.thirdweb.com/auth"
                  isExternal
                  _hover={{ opacity: 0.8 }}
                  color="blue.500"
                >
                  Full Docs
                </TrackedLink>
              </Text>
            </UnorderedList>
          </Flex>
        </Card>
        <Card
          as={Flex}
          flexDir={"row"}
          gap={4}
          flex={1}
          p={6}
          overflow="hidden"
          bg="linear-gradient(158.84deg, rgba(255, 255, 255, 0.05) 13.95%, rgba(255, 255, 255, 0) 38.68%)"
        >
          <Flex flexDir={"column"} gap={2}>
            <Heading size="title.sm" as="h1">
              Auth Guides
            </Heading>
            <UnorderedList>
              <Text as={ListItem} color="blue.500">
                <TrackedLink
                  category={TRACKING_CATEGORY}
                  label="guides"
                  trackingProps={{ breakdown: "getting-started" }}
                  href="https://portal.thirdweb.com/auth/getting-started"
                  isExternal
                  _hover={{ opacity: 0.8 }}
                  color="blue.500"
                >
                  Getting started with Auth
                </TrackedLink>
              </Text>
            </UnorderedList>
          </Flex>
        </Card>
      </SimpleGrid>
    </Flex>
  );
};

DashboardWalletsAuth.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <WalletsSidebar activePage="auth" />
    {page}
  </AppLayout>
);

DashboardWalletsAuth.pageId = PageId.DashboardWalletsAuth;

export default DashboardWalletsAuth;
