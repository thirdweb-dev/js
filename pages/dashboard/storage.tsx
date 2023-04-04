import { Divider, Flex, GridItem, SimpleGrid, Tooltip } from "@chakra-ui/react";
import { AppLayout } from "components/app-layouts/app";
import { CodeSegment } from "components/contract-tabs/code/CodeSegment";
import { CodeEnvironment } from "components/contract-tabs/code/types";
import { RelevantDataSection } from "components/dashboard/RelevantDataSection";
import { IpfsUploadDropzone } from "components/ipfs-upload/dropzone";
import { NextSeo } from "next-seo";
import { PageId } from "page-id";
import { useState } from "react";
import { Card, Heading, Text, TrackedCopyButton } from "tw-components";
import { ThirdwebNextPage } from "utils/types";

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

const DashboardStorage: ThirdwebNextPage = () => {
  const [codeEnvironment, setCodeEnvironment] =
    useState<CodeEnvironment>("javascript");

  const title = "IPFS Upload & Pinning Service | Pin Files to IPFS for Free";
  const description =
    "Upload, pin, and host NFT metadata, images, or any type of file on IPFS—using thirdweb's IPFS pinning service. Store files on IPFS for free.";

  return (
    <SimpleGrid columns={{ base: 1, xl: 4 }} gap={8} mt={{ base: 2, md: 6 }}>
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
          <Flex flexDir="column" w="full" gap={4}>
            <Heading size="title.md" as="h2">
              Gateway
            </Heading>
            <Text>Use our public IPFS gateway in your applications:</Text>
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
                https://ipfs.thirdwebcdn.com/ipfs/
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
                    value="https://ipfs.thirdwebcdn.com/ipfs/"
                    category="storage"
                    label="copy-cli-file-upload"
                    aria-label="Copy code"
                  />
                </Tooltip>
              </Flex>
            </Card>
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
  react: `// Upload files to IPFS
import { useStorageUpload } from "@thirdweb-dev/react";

function App() {
  const { mutateAsync: upload } = useStorageUpload();

  const uploadData = () => {
    // Get any data that you want to upload
    const dataToUpload = [...];

    // And upload the data with the upload function
    const uris = await upload({ data: dataToUpload });
  }
  ...
}

// Render files from IPFS
import { MediaRenderer } from "@thirdweb-dev/react";

function App() {
  return (
    // Supported types: image, video, audio, 3d model, html
    <MediaRenderer src="ipfs://QmamvVM5kvsYjQJYs7x8LXKYGFkwtGvuRvqZsuzvpHmQq9/0" />
  );
}`,
  javascript: `import { ThirdwebStorage } from "@thirdweb-dev/storage";

// First, instantiate the thirdweb IPFS storage
const storage = new ThirdwebStorage();

// Here we get the IPFS URI of where our metadata has been uploaded
const uri = await storage.upload(metadata);
// This will log a URL like ipfs://QmWgbcjKWCXhaLzMz4gNBxQpAHktQK6MkLvBkKXbsoWEEy/0
console.info(uri);

// Here we a URL with a gateway that we can look at in the browser
const url = await storage.resolveScheme(uri);
// This will log a URL like https://ipfs.thirdwebcdn.com/ipfs/QmWgbcjKWCXhaLzMz4gNBxQpAHktQK6MkLvBkKXbsoWEEy/0
console.info(url);

// You can also download the data from the uri
const data = await storage.downloadJSON(uri);`,
  python: `from thirdweb import ThirdwebSDK

sdk = ThirdwebSDK("goerli")
metadata = {
  "name": "NFT",
  "image": "ipfs://..."
}
uri = sdk.storage.upload(metadata)`,
  go: `package main

import (
    "context"
    "github.com/thirdweb-dev/go-sdk/v2/thirdweb"
)

func main() {
    sdk, _ := thirdweb.NewThirdwebSDK("goerli", nil)

    metadata := map[string]interface{}{
      "name": "NFT",
      "image": "ipfs://..."
    }
    uri, _ := sdk.Storage.Upload(context.Background(), metadata, "", "")
}`,
  unity: ``,
};

DashboardStorage.getLayout = (page, props) => (
  <AppLayout {...props}>{page}</AppLayout>
);
DashboardStorage.pageId = PageId.DashboardStorage;

export default DashboardStorage;
