import { UnorderedList } from "@/components/ui/List/List";
import { cn } from "@/lib/utils";
import { Code, Container, Flex, Icon, Link } from "@chakra-ui/react";
import { BsFillCloudUploadFill } from "react-icons/bs";
import { Heading, Text } from "tw-components";

interface UploadStepProps {
  // biome-ignore lint/suspicious/noExplicitAny: FIXME
  getRootProps: any;
  // biome-ignore lint/suspicious/noExplicitAny: FIXME
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
          <div className="relative aspect-square w-full md:w-1/2">
            <div
              className={cn(
                "flex h-full cursor-pointer rounded-md border border-border hover:border-blue-500",
                hasFailed ? "bg-red-200" : "bg-card",
              )}
              {...getRootProps()}
            >
              <input {...getInputProps()} />
              <div className="m-auto flex flex-col p-6">
                <Icon
                  as={BsFillCloudUploadFill}
                  boxSize={8}
                  mb={2}
                  color={hasFailed ? "red.500" : "gray.600"}
                  mx="auto"
                />
                {isDragActive ? (
                  <Heading
                    as={Text}
                    size="label.md"
                    color="gray.600"
                    textAlign="center"
                  >
                    Drop the files here
                  </Heading>
                ) : (
                  <Heading
                    as={Text}
                    size="label.md"
                    lineHeight={1.2}
                    color={hasFailed ? "red.500" : "gray.600"}
                    textAlign="center"
                  >
                    {hasFailed
                      ? `No valid CSV or JSON file found. Please make sure your NFT metadata includes at least a "name" field and try again.`
                      : "Drag & Drop files or folders here, or click to select files"}
                  </Heading>
                )}
              </div>
            </div>
          </div>
          <Flex gap={2} flexDir="column" w={{ base: "100%", md: "50%" }}>
            <Heading size="subtitle.sm">Requirements</Heading>
            <UnorderedList>
              <li>
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
              </li>
              <li>
                The csv <em>must</em> have a <Code>name</Code> column, which
                defines the name of the NFT.
              </li>
              <li>
                Asset names <em>must</em> be sequential 0,1,2,3...n.[extension].
                It doesn&apos;t matter at what number you begin. (Example:{" "}
                <Code>131.png</Code>, <Code>132.png</Code>).
              </li>
              <li>
                Make sure to drag and drop the CSV/JSON and the images{" "}
                <strong>at the same time</strong>.
              </li>
            </UnorderedList>
            <Heading size="subtitle.sm" mt={4}>
              Options
            </Heading>
            <UnorderedList>
              <li>
                Images and other file types can be used in combination.
                <br />
                <small>
                  They both have to follow the asset naming convention above.
                  (Example: <Code>0.png</Code> and <Code>0.mp4</Code>,{" "}
                  <Code>1.png</Code> and <Code>1.glb</Code>, etc.)
                </small>
              </li>
              <li>
                When uploading files, we will upload them and pin them to IPFS
                automatically for you. If you already have the files uploaded,
                you can add an <Code>image</Code> and/or{" "}
                <Code>animation_url</Code> column and add the IPFS hashes there.{" "}
                <Link download color="blue.500" href="/example-with-ipfs.csv">
                  Download example.csv
                </Link>
              </li>
              <li>
                If you want to make your media files map to your NFTs, you can
                add add the name of your files to the <Code>image</Code> and{" "}
                <Code>animation_url</Code> column.{" "}
                <Link download color="blue.500" href="/example-with-maps.csv">
                  Download example.csv
                </Link>
              </li>
            </UnorderedList>
          </Flex>
        </Flex>
      </Container>
    </Flex>
  );
};
