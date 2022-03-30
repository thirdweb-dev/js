import { BatchTable } from "./BatchTable";
import { UploadStep } from "./UploadStep";
import { useBundleDropBatchMint } from "@3rdweb-sdk/react";
import {
  Box,
  Container,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { EditionDrop } from "@thirdweb-dev/sdk";
import { Button } from "components/buttons/Button";
import { TransactionButton } from "components/buttons/TransactionButton";
import { Logo } from "components/logo";
import Papa from "papaparse";
import { useCallback, useRef, useState } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
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
  const [csvData, setCSVData] = useState<Papa.ParseResult<CSVData>>();
  const [jsonData, setJsonData] = useState<any>();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [noFile, setNoFile] = useState(false);

  const mintBatch = useBundleDropBatchMint(contract);

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

  const onReaderLoad = (event: any) => {
    const obj = JSON.parse(event.target.result);
    setJsonData(obj);
  };

  const onDrop = useCallback<Required<DropzoneOptions>["onDrop"]>(
    async (acceptedFiles) => {
      setNoFile(false);

      const { csv, json, images, videos } = getAcceptedFiles(acceptedFiles);

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
      } else if (json) {
        const reader = new FileReader();
        reader.onload = onReaderLoad;
        reader.readAsText(json);
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
      <DrawerOverlay />
      <DrawerContent>
        <Flex direction="column" gap={6} h="100%">
          <Flex shadow="sm">
            <Container maxW="container.page">
              <Flex align="center" justify="space-between" p={4}>
                <Flex gap={2}>
                  <Logo hideWordmark />
                  <Heading size="title.md">Batch upload</Heading>
                </Flex>
                <DrawerCloseButton position="relative" right={0} top={0} />
              </Flex>
            </Container>
          </Flex>

          {csvData || jsonData ? (
            <BatchTable portalRef={paginationPortalRef} data={mergedData} />
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

          <Flex boxShadow="rgba(0,0,0,.1) 0px -2px 4px 0px">
            <Container maxW="container.page">
              <Flex align="center" justify="space-between" p={4}>
                <Box ref={paginationPortalRef} />
                <Flex gap={2} align="center">
                  <Button
                    borderRadius="md"
                    size="md"
                    isDisabled={mintBatch.isLoading}
                    onClick={() => {
                      reset();
                    }}
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
      </DrawerContent>
    </Drawer>
  );
};
