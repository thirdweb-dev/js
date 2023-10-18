import {
  AspectRatio,
  Box,
  ButtonGroup,
  Center,
  Divider,
  Flex,
  GridItem,
  Icon,
  Input,
  Progress,
  SimpleGrid,
  Tooltip,
  chakra,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import {
  MediaRenderer,
  useAddress,
  useStorageUpload,
} from "@thirdweb-dev/react";
import { UploadProgressEvent } from "@thirdweb-dev/storage";
import { PINNED_FILES_QUERY_KEY_ROOT } from "components/storage/your-files";
import { useErrorHandler } from "contexts/error-handler";
import { useTrack } from "hooks/analytics/useTrack";
import { replaceIpfsUrl } from "lib/sdk";
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { BsFillCloudUploadFill } from "react-icons/bs";
import { FiExternalLink, FiTrash2, FiUploadCloud } from "react-icons/fi";
import {
  Button,
  Card,
  Heading,
  Text,
  TrackedCopyButton,
  TrackedIconButton,
  TrackedLink,
} from "tw-components";

const TRACKING_CATEGORY = "ipfs_uploader";

export interface IpfsUploadDropzoneProps {}

export const IpfsUploadDropzone: React.FC<IpfsUploadDropzoneProps> = () => {
  const address = useAddress();

  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => setDroppedFiles((prev) => [...prev, ...files]),
  });
  return (
    <Flex flexDir="column" gap={4}>
      <AspectRatio
        ratio={{
          base: droppedFiles.length ? 1 : 8 / 4,
          md: droppedFiles.length ? 16 / 9 : 36 / 9,
        }}
        w="100%"
      >
        {droppedFiles.length ? (
          <Box border="2px solid" borderColor="borderColor" borderRadius="xl">
            <FileUpload files={droppedFiles} updateFiles={setDroppedFiles} />
          </Box>
        ) : !address ? (
          <Center
            border="2px solid"
            borderColor="borderColor"
            borderRadius="xl"
          >
            <Text size="label.lg" color="gray.700" textAlign="center">
              Please connect your wallet to begin uploading.
            </Text>
          </Center>
        ) : (
          <Center
            {...getRootProps()}
            bg="transparent"
            _hover={{
              _light: {
                borderColor: "blue.600",
              },
              _dark: {
                borderColor: "blue.400",
              },
            }}
            border="2px solid"
            borderColor="borderColor"
            borderRadius="xl"
            cursor={address ? "pointer" : "default"}
          >
            <input {...getInputProps()} />

            {
              <Flex direction="column" gap={2} p={6} align="center">
                {isDragActive ? (
                  <>
                    <Icon
                      as={BsFillCloudUploadFill}
                      boxSize={8}
                      mb={2}
                      color="gray.600"
                    />
                    <Text size="label.lg">Drop the files here</Text>
                  </>
                ) : (
                  <>
                    <Icon
                      as={BsFillCloudUploadFill}
                      boxSize={8}
                      mb={2}
                      color="gray.600"
                    />
                    <Text size="label.lg" textAlign="center" lineHeight="150%">
                      Drag and drop your file or folder here to upload it to
                      IPFS
                    </Text>
                  </>
                )}
              </Flex>
            }
          </Center>
        )}
      </AspectRatio>
      <Flex flexDir="column" gap={{ base: 6, md: 3 }}></Flex>
    </Flex>
  );
};

interface FileUploadProps {
  files: File[];
  updateFiles: Dispatch<SetStateAction<File[]>>;
}

const FileUpload: React.FC<FileUploadProps> = ({ files, updateFiles }) => {
  const trackEvent = useTrack();
  const address = useAddress();
  const [progress, setProgress] = useState<UploadProgressEvent>({
    progress: 0,
    total: 100,
  });
  const storageUpload = useStorageUpload({
    onProgress: setProgress,
    metadata: {
      address,
      uploadedAt: new Date().toISOString(),
      uploadedFrom: "thirdweb-dashboard",
    },
  });
  const queryClient = useQueryClient();
  const [ipfsHashes, setIpfsHashes] = useState<string[]>([]);
  const { onError } = useErrorHandler();

  const progressPercent = (progress.progress / progress.total) * 100;

  const mainIpfsUri = useMemo(() => {
    if (ipfsHashes.length === 0) {
      return "";
    }
    if (ipfsHashes.length === 1) {
      return replaceIpfsUrl(ipfsHashes[0]);
    }
    // get the folder
    // return replaceIpfsUrl(ipfsHashes[0].split("/").slice(0, -1).join("/"));
    return `https://ipfs.io/ipfs/${ipfsHashes[0].split("ipfs://")[1]}`;
  }, [ipfsHashes]);

  return (
    <Flex direction="column" w="full" h="full" justify="space-between">
      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        p={{ base: 1.5, md: 3 }}
        gap={{ base: 1.5, md: 3 }}
        overflow="auto"
      >
        {files.map((file, index) => {
          const ipfsHash = ipfsHashes[index];
          return (
            <GridItem colSpan={1} key={`${file.name}_${index}`}>
              <SimpleGrid
                as={Card}
                columns={24}
                position="relative"
                p={1}
                columnGap={{ base: 2, md: 4 }}
                rowGap={0}
                alignItems="center"
              >
                <GridItem colSpan={5} rowSpan={2}>
                  <AspectRatio ratio={1}>
                    <Box
                      rounded="lg"
                      overflow="hidden"
                      pointerEvents="none"
                      border="1px solid"
                      borderColor="borderColor"
                      bg="bgWhite"
                    >
                      <TWMediaRenderer
                        width="100%"
                        height="100%"
                        src={URL.createObjectURL(file)}
                        mimeType={file.type}
                        requireInteraction
                      />
                    </Box>
                  </AspectRatio>
                </GridItem>
                <GridItem colSpan={16} rowSpan={1}>
                  <Heading size="label.md" as="label" noOfLines={2}>
                    {file.name}
                  </Heading>
                </GridItem>

                <GridItem colSpan={2} rowSpan={1} placeItems="center">
                  {ipfsHash ? (
                    <Tooltip
                      p={0}
                      bg="transparent"
                      boxShadow="none"
                      label={
                        <Card py={2} px={4} bgColor="backgroundHighlight">
                          <Text size="label.sm">Open in gateway</Text>
                        </Card>
                      }
                      borderRadius="lg"
                      shouldWrapChildren
                      placement="right"
                    >
                      <TrackedIconButton
                        as={TrackedLink}
                        href={replaceIpfsUrl(ipfsHash)}
                        category={TRACKING_CATEGORY}
                        label="open-in-gateway"
                        aria-label="Open in gateway"
                        icon={<Icon as={FiExternalLink} />}
                        variant="ghost"
                        isExternal
                        size="sm"
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip
                      p={0}
                      bg="transparent"
                      boxShadow="none"
                      label={
                        <Card py={2} px={4} bgColor="backgroundHighlight">
                          <Text size="label.sm">Remove file</Text>
                        </Card>
                      }
                      borderRadius="lg"
                      shouldWrapChildren
                      placement="right"
                    >
                      <TrackedIconButton
                        size="sm"
                        aria-label="Remove File"
                        category={TRACKING_CATEGORY}
                        label="remove-file"
                        icon={<Icon as={FiTrash2} />}
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateFiles((prev) => prev.filter((f) => f !== file));
                        }}
                        isDisabled={storageUpload.isLoading}
                      />
                    </Tooltip>
                  )}
                </GridItem>
                <GridItem colSpan={16} rowSpan={1}>
                  <Input
                    size="sm"
                    opacity={ipfsHash ? 1 : 0}
                    pointerEvents={ipfsHash ? "auto" : "none"}
                    overflow="hidden"
                    rounded="md"
                    readOnly
                    fontSize={13}
                    value={ipfsHash || " "}
                    transition="opacity 0.2s"
                    willChange="opacity"
                  />
                </GridItem>
                <GridItem colSpan={1} rowSpan={1}>
                  <Tooltip
                    p={0}
                    bg="transparent"
                    boxShadow="none"
                    label={
                      <Card py={2} px={4} bgColor="backgroundHighlight">
                        <Text size="label.sm">Copy IPFS hash</Text>
                      </Card>
                    }
                    borderRadius="lg"
                    shouldWrapChildren
                    placement="right"
                  >
                    <TrackedCopyButton
                      pointerEvents={ipfsHash ? "auto" : "none"}
                      opacity={ipfsHash ? 1 : 0}
                      colorScheme={undefined}
                      category={TRACKING_CATEGORY}
                      label="copy-ipfs-hash"
                      aria-label="Copy IPFS hash"
                      value={ipfsHash}
                      transition="opacity 0.2s"
                      willChange="opacity"
                    />
                  </Tooltip>
                </GridItem>
              </SimpleGrid>
            </GridItem>
          );
        })}
      </SimpleGrid>
      <Flex direction="column">
        <Divider flexShrink={0} />
        <Flex
          direction={{ base: "column-reverse", md: "row" }}
          align="center"
          gap={{ base: 2, md: 8 }}
          flexShrink={0}
          p={{ base: 0, md: 2 }}
          pt={2}
          bg="bgWhite"
        >
          <Flex
            w="100%"
            direction="column"
            opacity={storageUpload.isLoading ? 1 : 0}
            align="center"
            gap={1}
            position="relative"
          >
            <Progress
              colorScheme="green"
              value={progress.progress ? progressPercent : undefined}
              size={{ base: "xs", md: "lg" }}
              w="100%"
              borderRadius="full"
              isIndeterminate={progress.progress === progress.total}
              position="relative"
            />
            <Center
              display={{ base: "none", md: "block" }}
              position="absolute"
              left={0}
              right={0}
              top={0}
              bottom={0}
            >
              <Text
                mt={0.5}
                size="label.xs"
                fontSize={11}
                lineHeight={1}
                fontFamily="mono"
                textAlign="center"
                _dark={{
                  color:
                    progressPercent > 50 && progress.progress !== progress.total
                      ? "black"
                      : "white",
                }}
                _light={{
                  color:
                    progressPercent > 50 && progress.progress !== progress.total
                      ? "white"
                      : "black",
                }}
                willChange="color"
                transition="color 0.2s"
              >
                {Math.round(progressPercent)}%
              </Text>
            </Center>
          </Flex>
          <ButtonGroup>
            <Button
              isDisabled={storageUpload.isLoading}
              onClick={() => {
                updateFiles([]);
                setIpfsHashes([]);
              }}
            >
              Reset
            </Button>
            {ipfsHashes.length ? (
              <Button
                as={TrackedLink}
                category={TRACKING_CATEGORY}
                href={mainIpfsUri}
                textDecor="none!important"
                rightIcon={<Icon as={FiExternalLink} />}
                colorScheme="green"
                isExternal
                onClick={() => {
                  trackEvent({
                    category: TRACKING_CATEGORY,
                    action: "click",
                    label: ipfsHashes.length > 1 ? "open-folder" : "open-file",
                  });
                }}
              >
                {ipfsHashes.length > 1 ? "Open Folder" : "Open File"}
              </Button>
            ) : (
              <Button
                isLoading={storageUpload.isLoading}
                loadingText="Uploading..."
                colorScheme="green"
                leftIcon={<Icon as={FiUploadCloud} />}
                onClick={() => {
                  setIpfsHashes([]);
                  trackEvent({
                    category: TRACKING_CATEGORY,
                    action: "upload",
                    label: "start",
                  });
                  storageUpload.mutate(
                    {
                      data: files,
                    },
                    {
                      onError: (error) => {
                        trackEvent({
                          category: TRACKING_CATEGORY,
                          action: "upload",
                          label: "error",
                          error,
                        });
                        onError(error, "Failed to upload file");
                        setProgress({
                          progress: 0,
                          total: 100,
                        });
                      },
                      onSuccess: (uris) => {
                        trackEvent({
                          category: TRACKING_CATEGORY,
                          action: "upload",
                          label: "success",
                          address,
                          uri:
                            uris.length === 1
                              ? uris[0]
                              : uris[0].split("/").slice(0, -1).join("/"),
                        });
                        setIpfsHashes(uris);
                        // also refetch the files list
                        queryClient.invalidateQueries([
                          PINNED_FILES_QUERY_KEY_ROOT,
                        ]);
                      },
                      onSettled: () => {
                        setProgress({
                          progress: 0,
                          total: 100,
                        });
                      },
                    },
                  );
                }}
              >
                Start Upload
              </Button>
            )}
          </ButtonGroup>
        </Flex>
      </Flex>
    </Flex>
  );
};

const TWMediaRenderer = chakra(MediaRenderer, {
  shouldForwardProp: (prop) =>
    ["width", "height", "mimeType", "src", "requireInteraction"].includes(prop),
});
