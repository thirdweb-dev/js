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
  useToast,
} from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { MediaRenderer, useStorageUpload } from "@thirdweb-dev/react";
import type { UploadProgressEvent } from "@thirdweb-dev/storage";
import { PINNED_FILES_QUERY_KEY_ROOT } from "components/storage/your-files";
import { useErrorHandler } from "contexts/error-handler";
import { useTrack } from "hooks/analytics/useTrack";
import { replaceIpfsUrl } from "lib/sdk";
import { type Dispatch, type SetStateAction, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { BsFillCloudUploadFill } from "react-icons/bs";
import { FiExternalLink, FiTrash2, FiUploadCloud } from "react-icons/fi";
import { useActiveAccount } from "thirdweb/react";
import {
  Button,
  Card,
  Checkbox,
  Heading,
  Text,
  TrackedCopyButton,
  TrackedIconButton,
  TrackedLink,
} from "tw-components";
import { Label } from "../../@/components/ui/label";

const TRACKING_CATEGORY = "ipfs_uploader";

const UNACCEPTED_FILE_TYPES = ["text/html"];

export const IpfsUploadDropzone: React.FC = () => {
  const toast = useToast();
  const address = useActiveAccount()?.address;

  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => {
      const invalidFiles = files.filter((f) =>
        UNACCEPTED_FILE_TYPES.includes(f.type),
      );
      if (invalidFiles.length) {
        const description = `${invalidFiles.length} ${invalidFiles.length > 1 ? "files have" : "file has"} been removed from the list. Uploading ${UNACCEPTED_FILE_TYPES.join(", ")} files is restricted.`;
        toast({
          title: "Error",
          description,
          status: "error",
          isClosable: true,
          duration: 6000,
        });
      }
      setDroppedFiles((prev) => [
        ...prev,
        ...files.filter((f) => !UNACCEPTED_FILE_TYPES.includes(f.type)),
      ]);
    },
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
      <Flex flexDir="column" gap={{ base: 6, md: 3 }} />
    </Flex>
  );
};

interface FileUploadProps {
  files: File[];
  updateFiles: Dispatch<SetStateAction<File[]>>;
}

const filesPerPage = 20;

const FileUpload: React.FC<FileUploadProps> = ({ files, updateFiles }) => {
  const trackEvent = useTrack();
  const address = useActiveAccount()?.address;
  const [progress, setProgress] = useState<UploadProgressEvent>({
    progress: 0,
    total: 100,
  });
  const [uploadWithoutDirectory, setUploadWithoutDirectory] = useState(
    files.length === 1,
  );
  const uploadToAFolder = !uploadWithoutDirectory;
  const storageUpload = useStorageUpload({
    uploadWithoutDirectory,
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

  const [page, setPage] = useState(0);

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

  const filesToShow = useMemo(() => {
    const start = page * filesPerPage;
    return files.slice(start, start + filesPerPage);
  }, [files, page]);

  const lastPage = Math.ceil(files.length / filesPerPage);

  const showNextButton = page < lastPage - 1;
  const showPrevButton = page > 0;
  const showPagination = (showNextButton || showPrevButton) && lastPage > 1;
  return (
    <Flex direction="column" w="full" h="full" justify="space-between">
      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        p={{ base: 1.5, md: 3 }}
        gap={{ base: 1.5, md: 3 }}
        overflow="auto"
      >
        {filesToShow.map((file, index) => {
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

      {showPagination && (
        <Flex
          gap={2}
          py={5}
          justifyContent="center"
          borderTop="1px solid"
          borderColor="borderColor"
        >
          <Button
            isDisabled={!showPrevButton}
            variant="inverted"
            onClick={() => {
              setPage(page - 1);
            }}
          >
            Previous
          </Button>

          <Button
            isDisabled={!showNextButton}
            variant="inverted"
            onClick={() => {
              setPage(page + 1);
            }}
          >
            Next
          </Button>
        </Flex>
      )}

      <Flex direction="column">
        <Divider flexShrink={0} />
        <Flex
          direction={{ base: "column-reverse", md: "row" }}
          align="center"
          gap={{ base: 2, md: 8 }}
          flexShrink={0}
          p={{ base: 2, md: 2 }}
          pt={2}
          bg="bgWhite"
          justifyContent={"space-between"}
        >
          {/* If user is uploading just one file,
          we allow them to choose if they want to upload without a folder */}
          {files.length === 1 &&
            !storageUpload.isLoading &&
            ipfsHashes.length === 0 && (
              <Flex direction={"row"} gap={"2"}>
                <Checkbox
                  id="dropzone_uploadWithoutDirectory"
                  defaultChecked={uploadToAFolder}
                  onChange={(e) => setUploadWithoutDirectory(!e.target.checked)}
                />
                <Label
                  htmlFor="dropzone_uploadWithoutDirectory"
                  className="my-auto"
                >
                  Upload file to a folder
                </Label>
              </Flex>
            )}
          {storageUpload.isLoading && (
            <Flex
              w="100%"
              direction="column"
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
                      progressPercent > 50 &&
                      progress.progress !== progress.total
                        ? "black"
                        : "white",
                  }}
                  _light={{
                    color:
                      progressPercent > 50 &&
                      progress.progress !== progress.total
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
          )}
          <ButtonGroup ml={{ base: "0", md: "auto" }}>
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

export const TWMediaRenderer = chakra(MediaRenderer, {
  shouldForwardProp: (prop) =>
    ["width", "height", "mimeType", "src", "requireInteraction"].includes(prop),
});
