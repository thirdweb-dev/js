import {
  AspectRatio,
  Center,
  Code,
  Container,
  Flex,
  Icon,
  Link,
  ListItem,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";
import { BsFillCloudUploadFill } from "react-icons/bs";
import { Heading, Text } from "tw-components";

interface UploadStepProps {
  getRootProps: any;
  getInputProps: any;
  hasFailed: boolean;
  isDragActive: boolean;
}

export const UploadStep: React.FC<UploadStepProps> = ({
  getRootProps,
  hasFailed,
  isDragActive,
  getInputProps,
}) => {
  return (
    <Flex flexGrow={1} align="center" overflow="auto">
      <Container maxW="container.page">
        <Flex gap={8} flexDir={{ base: "column", md: "row" }}>
          <AspectRatio w={{ base: "100%", md: "50%" }}>
            <Center
              borderRadius="md"
              {...getRootProps()}
              cursor="pointer"
              bg={hasFailed ? "red.200" : "inputBg"}
              _hover={{
                bg: hasFailed ? "red.200" : "inputBgHover",
                borderColor: "blue.500",
              }}
              borderColor="inputBorder"
              borderWidth="1px"
            >
              <input {...getInputProps()} />
              <VStack p={6}>
                <Icon
                  as={BsFillCloudUploadFill}
                  boxSize={8}
                  mb={2}
                  color={hasFailed ? "red.500" : "gray.600"}
                />
                {isDragActive ? (
                  <Heading as={Text} size="label.md" color="gray.600">
                    Drop the files here
                  </Heading>
                ) : (
                  <Heading
                    as={Text}
                    size="label.md"
                    lineHeight={1.2}
                    color={hasFailed ? "red.500" : "gray.600"}
                  >
                    {hasFailed
                      ? `No valid CSV or JSON file found. Please make sure your NFT metadata includes at least a "name" field and try again.`
                      : "Drag & Drop files or folders here, or click to select files"}
                  </Heading>
                )}
              </VStack>
            </Center>
          </AspectRatio>
          <Flex gap={2} flexDir="column" w={{ base: "100%", md: "50%" }}>
            <Heading size="subtitle.sm">Requirements</Heading>
            <UnorderedList>
              <ListItem>
                Files <em>must</em> contain one .csv or .json file with
                metadata. -{" "}
                <Link download color="blue.500" href="/example.csv">
                  Download example.csv
                </Link>
                .{" "}
                <Link download color="blue.500" href="/example.json">
                  Download example.json
                </Link>
                .
              </ListItem>
              <ListItem>
                The csv <em>must</em> have a <Code>name</Code> column, which
                defines the name of the NFT.
              </ListItem>
              <ListItem>
                Asset names <em>must</em> be sequential 0,1,2,3...n.[extension].
                It doesn&apos;t matter at what number you begin. (Example:{" "}
                <Code>131.png</Code>, <Code>132.png</Code>).
              </ListItem>
            </UnorderedList>
            <Heading size="subtitle.sm" mt={4}>
              Options
            </Heading>
            <UnorderedList>
              <ListItem>
                Images and other file types can be used in combination.
                <br />
                <small>
                  They both have to follow the asset naming convention above.
                  (Example: <Code>0.png</Code> and <Code>0.mp4</Code>,{" "}
                  <Code>1.png</Code> and <Code>1.glb</Code>, etc.)
                </small>
              </ListItem>
              <ListItem>
                When uploading files, we will upload them and pin them to IPFS
                automatically for you. If you already have the files uploaded,
                you can add an <Code>image</Code> and/or{" "}
                <Code>animation_url</Code> column and add the IPFS hashes there.{" "}
                <Link download color="blue.500" href="/example-with-ipfs.csv">
                  Download example.csv
                </Link>
              </ListItem>
              <ListItem>
                If you want to make your media files map to your NFTs, you can
                add add the name of your files to the <Code>image</Code> and{" "}
                <Code>animation_url</Code> column.{" "}
                <Link download color="blue.500" href="/example-with-maps.csv">
                  Download example.csv
                </Link>
              </ListItem>
            </UnorderedList>
          </Flex>
        </Flex>
      </Container>
    </Flex>
  );
};
