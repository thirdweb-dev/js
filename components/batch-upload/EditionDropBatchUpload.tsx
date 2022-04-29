import { BatchTable } from "./BatchTable";
import { UploadStep } from "./UploadStep";
import { useEditionDropBatchMint } from "@3rdweb-sdk/react";
import { useGetTotalCount } from "@3rdweb-sdk/react/hooks/useGetAll";
import { Box, Container, Flex } from "@chakra-ui/react";
import { EditionDrop } from "@thirdweb-dev/sdk";
import { TransactionButton } from "components/buttons/TransactionButton";
import { Logo } from "components/logo";
import Papa from "papaparse";
import { useCallback, useRef, useState } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import { Button, Drawer, Heading } from "tw-components";
import { getAcceptedFiles, transformHeader, useMergedData } from "utils/batch";

interface EditionDropBatchUploadProps {
  contract?: EditionDrop;
  isOpen: boolean;
  onClose: () => void;
}

interface CSVData extends Record<string, string | undefined> {
  name: string;
  description?: string;
  external_url?: string;
  background_color?: string;
  youtube_url?: string;
}

export const EditionDropBatchUpload: React.FC<EditionDropBatchUploadProps> = ({
  contract,
  isOpen,
  onClose,
}) => {
  const nextTokenIdToMint = useGetTotalCount(contract);
  const [csvData, setCSVData] = useState<Papa.ParseResult<CSVData>>();
  const [jsonData, setJsonData] = useState<any>();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [noFile, setNoFile] = useState(false);

  const mintBatch = useEditionDropBatchMint(contract);

  const reset = useCallback(() => {
    setCSVData(undefined);
    setJsonData(undefined);
    setImageFiles([]);
    setVideoFiles([]);
    setNoFile(false);
  }, []);

  const _onClose = useCallback(() => {
    reset();
    onClose();
  }, [onClose, reset]);

  const onDrop = useCallback<Required<DropzoneOptions>["onDrop"]>(
    async (acceptedFiles) => {
      setNoFile(false);

      const { csv, json, images, videos } = await getAcceptedFiles(
        acceptedFiles,
      );

      if (csv) {
        Papa.parse<CSVData>(csv, {
          header: true,
          transformHeader,
          complete: (results) => {
            const validResults: Papa.ParseResult<CSVData> = {
              ...results,
              data: [],
            };
            for (let i = 0; i < results.data.length; i++) {
              if (!results.errors.find((e) => e.row === i)) {
                if (results.data[i].name) {
                  validResults.data.push(results.data[i]);
                }
              }
            }
            setCSVData(validResults);
          },
        });
      } else if (json?.length > 0) {
        setJsonData(json);
      } else {
        console.error("No CSV or JSON found");
        setNoFile(true);
        return;
      }
      setImageFiles(images);
      setVideoFiles(videos);
    },
    [],
  );

  const mergedData = useMergedData(csvData, jsonData, imageFiles, videoFiles);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  const paginationPortalRef = useRef<HTMLDivElement>(null);
  return (
    <Drawer
      allowPinchZoom
      preserveScrollBarGap
      size="full"
      onClose={_onClose}
      isOpen={isOpen}
    >
      <Flex direction="column" gap={6} h="100%">
        <Flex shadow="sm">
          <Container
            maxW="container.page"
            borderRadius={{ base: 0, md: "2xl" }}
            my={{ base: 0, md: 12 }}
            p={{ base: 0, md: 4 }}
          >
            <Flex align="center" justify="space-between" p={4}>
              <Flex gap={2}>
                <Logo hideWordmark />
                <Heading size="title.md">Batch upload</Heading>
              </Flex>
            </Flex>
          </Container>
        </Flex>

        <Box overflowY="scroll">
          {csvData || jsonData ? (
            <BatchTable
              portalRef={paginationPortalRef}
              data={mergedData}
              nextTokenIdToMint={nextTokenIdToMint.data?.toNumber()}
            />
          ) : (
            <Flex flexGrow={1} align="center" overflow="auto">
              <Container maxW="container.page">
                <UploadStep
                  getRootProps={getRootProps}
                  getInputProps={getInputProps}
                  noFile={noFile}
                  isDragActive={isDragActive}
                />
              </Container>
            </Flex>
          )}
        </Box>

        <Flex borderTop="1px solid" borderTopColor="borderColor">
          <Container maxW="container.page">
            <Flex
              align="center"
              justify="space-between"
              p={{ base: 0, md: 4 }}
              flexDir={{ base: "column", md: "row" }}
              mt={{ base: 4, md: 0 }}
            >
              <Box ref={paginationPortalRef} />
              <Flex
                gap={2}
                align="center"
                mt={{ base: 4, md: 0 }}
                w={{ base: "100%", md: "auto" }}
              >
                <Button
                  borderRadius="md"
                  isDisabled={!csvData && !jsonData}
                  onClick={() => {
                    reset();
                  }}
                  w={{ base: "100%", md: "auto" }}
                >
                  Reset
                </Button>
                <TransactionButton
                  colorScheme="primary"
                  transactionCount={1}
                  isDisabled={!mergedData.length}
                  isLoading={mintBatch.isLoading}
                  loadingText={`Uploading ${mergedData.length} NFTs...`}
                  onClick={() => {
                    mintBatch.mutate(mergedData, { onSuccess: _onClose });
                  }}
                >
                  Upload {mergedData.length} NFTs
                </TransactionButton>
              </Flex>
            </Flex>
          </Container>
        </Flex>
      </Flex>
    </Drawer>
  );
};
