import { InlineCode } from "@/components/ui/inline-code";
import { cn } from "@/lib/utils";
import { Container, Flex, Link, UnorderedList } from "@chakra-ui/react";
import { UploadIcon } from "lucide-react";
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
                <UploadIcon
                  className={cn(
                    "mx-auto mb-2 size-8",
                    hasFailed ? "text-red-500" : "text-gray-600",
                  )}
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
                The csv <em>must</em> have a <InlineCode code="name" /> column,
                which defines the name of the NFT.
              </li>
              <li>
                Asset names <em>must</em> be sequential 0,1,2,3...n.[extension].
                It doesn&apos;t matter at what number you begin. (Example:{" "}
                <InlineCode code="131.png" />, <InlineCode code="132.png" />
                ).
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
                  (Example: <InlineCode code="0.png" /> and{" "}
                  <InlineCode code="0.mp4" />,<InlineCode code="1.png" /> and{" "}
                  <InlineCode code="1.glb" />, etc.)
                </small>
              </li>
              <li>
                When uploading files, we will upload them and pin them to IPFS
                automatically for you. If you already have the files uploaded,
                you can add an <InlineCode code="image" /> and/or
                <InlineCode code="animation_url" /> column and add the IPFS
                hashes there.
                <Link download color="blue.500" href="/example-with-ipfs.csv">
                  Download example.csv
                </Link>
              </li>
              <li>
                If you want to make your media files map to your NFTs, you can
                add add the name of your files to the{" "}
                <InlineCode code="image" /> and
                <InlineCode code="animation_url" /> column.
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
