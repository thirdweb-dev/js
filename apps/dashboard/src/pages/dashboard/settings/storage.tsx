import { Divider, Flex, GridItem, SimpleGrid, Tooltip } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { CodeSegment } from "components/contract-tabs/code/CodeSegment";
import type { CodeEnvironment } from "components/contract-tabs/code/types";
import { RelevantDataSection } from "components/dashboard/RelevantDataSection";
import { IpfsUploadDropzone } from "components/ipfs-upload/dropzone";
import { YourFilesSection } from "components/storage/your-files";
import { SettingsSidebar } from "core-ui/sidebar/settings";
import { NextSeo } from "next-seo";
import { PageId } from "page-id";
import { useState } from "react";
import { Card, Heading, Link, Text, TrackedCopyButton } from "tw-components";
import type { ThirdwebNextPage } from "utils/types";

const TRACKING_CATEGORY = "storage";

const links = [
  {
    title: "Documentation",
    url: "https://docs.thirdweb.com/storage",
  },
  {
    title: "How To Upload And Pin Files to IPFS",
    url: "https://blog.thirdweb.com/guides/how-to-upload-and-pin-files-to-ipfs-using-storage/",
  },
];

const videos = [
  {
    title: "How To Easily Add IPFS Into Your Web3 App",
    url: "https://www.youtube.com/watch?v=4Nnu9Cy7SKc",
  },
  {
    title: "How to Upload Files to IPFS (Step by Step Guide)",
    url: "https://www.youtube.com/watch?v=wyYkpMgEVxE",
  },
];

const DashboardSettingsStorage: ThirdwebNextPage = () => {
  const [codeEnvironment, setCodeEnvironment] =
    useState<CodeEnvironment>("javascript");

  const title = "IPFS Upload & Pinning Service | Pin Files to IPFS for Free";
  const description =
    "Upload, pin, and host NFT metadata, images, or any type of file on IPFS—using thirdweb's IPFS pinning service. Store files on IPFS for free.";

  return (
    <SimpleGrid columns={{ base: 1, xl: 4 }} gap={8}>
      <NextSeo
        title={title}
        description={description}
        openGraph={{
          title,
          description,
        }}
      />
      <GridItem as={Flex} colSpan={{ xl: 3 }} direction="column" gap={8}>
        <Flex flexDir="column" gap={{ base: 4, md: 16 }}>
          <Flex flexDir="column" gap={2}>
            <Heading size="title.lg" as="h1">
              Storage
            </Heading>
            <Flex flexDir="column" gap={4}>
              <Text>
                Everything uploaded using thirdweb is automatically uploaded and
                pinned to IPFS.
              </Text>
              <IpfsUploadDropzone />
            </Flex>
          </Flex>

          <YourFilesSection />
          <Flex flexDir="column" w="full" gap={4}>
            <Heading size="title.md" as="h2">
              Gateway
            </Heading>
            <Text>This is the structure of your unique gateway URL:</Text>
            <Card
              as={Flex}
              w="full"
              alignItems="center"
              py={2}
              justifyContent="space-between"
            >
              <Text
                fontFamily="mono"
                overflow={{ base: "scroll", md: "inherit" }}
              >
                {"https://{client-id}.ipfscdn.io/ipfs/"}
              </Text>
              <Flex>
                <Tooltip
                  p={0}
                  label={
                    <Card py={2} px={4} bgColor="backgroundHighlight">
                      <Text>Copy code</Text>
                    </Card>
                  }
                  bgColor="backgroundCardHighlight"
                  borderRadius="xl"
                  placement="top"
                  shouldWrapChildren
                >
                  <TrackedCopyButton
                    value="https://{client-id}.ipfscdn.io/ipfs/"
                    category="storage"
                    label="copy-cli-file-upload"
                    aria-label="Copy code"
                  />
                </Tooltip>
              </Flex>
            </Card>
            <Text>
              Gateway requests need to be authenticated using a client ID. You
              can get it by creating an API key from the{" "}
              <Link href="/dashboard/settings/api-keys" color="primary.500">
                dashboard settings
              </Link>
              .
            </Text>
          </Flex>
          <Flex flexDir="column" w="full" gap={4}>
            <Heading size="title.md" as="h2">
              CLI
            </Heading>
            <Flex flexDir="column" gap={4}>
              <Text>
                Using thirdweb CLI, you can easily upload files and folders to
                IPFS from your terminal:
              </Text>
              <Card
                as={Flex}
                w="full"
                alignItems="center"
                py={2}
                justifyContent="space-between"
              >
                <Text
                  fontFamily="mono"
                  overflow={{ base: "scroll", md: "inherit" }}
                >
                  npx thirdweb upload ./path/to/file-or-folder
                </Text>
                <Flex>
                  <Tooltip
                    p={0}
                    label={
                      <Card py={2} px={4} bgColor="backgroundHighlight">
                        <Text>Copy code</Text>
                      </Card>
                    }
                    bgColor="backgroundCardHighlight"
                    borderRadius="xl"
                    placement="top"
                    shouldWrapChildren
                  >
                    <TrackedCopyButton
                      value="npx thirdweb upload ./path/to/file-or-folder"
                      category="storage"
                      label="copy-gateway-url"
                      aria-label="Copy code"
                    />
                  </Tooltip>
                </Flex>
              </Card>
              <Text>
                If this is the first time that you are running this command, you
                may have to first login using your secret key.{" "}
                <Link
                  href="https://portal.thirdweb.com/cli/upload"
                  color="primary.500"
                  isExternal
                >
                  Learn more here
                </Link>
                .
              </Text>
            </Flex>
          </Flex>
          <Flex flexDir="column" w="full" gap={4}>
            <Heading size="title.md" as="h2">
              Integrate into your app
            </Heading>
            <CodeSegment
              snippet={storageSnippets}
              environment={codeEnvironment}
              setEnvironment={setCodeEnvironment}
            />
          </Flex>
        </Flex>
      </GridItem>
      <GridItem as={Flex} direction="column" gap={6}>
        <RelevantDataSection
          data={links}
          title="link"
          TRACKING_CATEGORY={TRACKING_CATEGORY}
        />
        <Divider />
        <RelevantDataSection
          data={videos}
          title="video"
          TRACKING_CATEGORY={TRACKING_CATEGORY}
        />
      </GridItem>
    </SimpleGrid>
  );
};

const storageSnippets = {
  react: `// Check out the latest docs here: https://portal.thirdweb.com/typescript/v5/storage

// Initialize your provider
import { ThirdwebProvider } from "thirdweb/react";

function Provider() {
  return (
    <ThirdwebProvider
      >
      ...
    </ThirdwebProvider>
  );
}

// Upload files to IPFS
import { upload } from "thirdweb/storage";

function App() {
  const uploadData = () => {
    // And upload the data with the upload function
    const uri = await upload({
      client, // thirdweb client
      files: [
        new File(["hello world"], "hello.txt"),
      ],
    });
  }
  ...
}

// Render files from IPFS
import { MediaRenderer } from "thirdweb/react";

function App() {
  return (
    // Supported types: image, video, audio, 3d model, html
    <MediaRenderer src="ipfs://QmamvVM5kvsYjQJYs7x8LXKYGFkwtGvuRvqZsuzvpHmQq9/0" />
  );
}`,
  javascript: `// Check out the latest docs here: https://portal.thirdweb.com/typescript/v5/storage
  
import { upload } from "thirdweb/storage";

// Here we get the IPFS URI of where our metadata has been uploaded
const uri = await upload({
  client,
  files: [
    new File(["hello world"], "hello.txt"),
  ],
});

// This will log a URL like ipfs://QmWgbcjKWCXhaLzMz4gNBxQpAHktQK6MkLvBkKXbsoWEEy/0
console.info(uri);

// Here we a URL with a gateway that we can look at in the browser
const url = await download({
  client,
  uri,
}).url;

// This will log a URL like https://ipfs.thirdwebstorage.com/ipfs/QmWgbcjKWCXhaLzMz4gNBxQpAHktQK6MkLvBkKXbsoWEEy/0
console.info(url);`,

  unity: `using Thirdweb;

// Reference the SDK
var sdk = ThirdwebManager.Instance.SDK;

// Create data
NFTMetadata meta = new NFTMetadata()
{
    name = "Unity NFT",
    description = "Minted From Unity",
    image = "ipfs://QmbpciV7R5SSPb6aT9kEBAxoYoXBUsStJkMpxzymV4ZcVc",
};
string metaJson = Newtonsoft.Json.JsonConvert.SerializeObject(meta);

// Upload raw text or from a file path
var response = await ThirdwebManager.Instance.SDK.storage.UploadText(metaJson);`,
};

DashboardSettingsStorage.getLayout = (page, props) => (
  <AppLayout {...props} hasSidebar={true}>
    <SettingsSidebar activePage="storage" />
    {page}
  </AppLayout>
);
DashboardSettingsStorage.pageId = PageId.DashboardSettingsStorage;

export default DashboardSettingsStorage;
