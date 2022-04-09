import { BatchTable } from "./BatchTable";
import { SelectReveal } from "./SelectReveal";
import { UploadStep } from "./UploadStep";
import {
  Box,
  Container,
  Drawer,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  HStack,
  Heading,
  Icon,
} from "@chakra-ui/react";
import { NFTDrop } from "@thirdweb-dev/sdk";
import { Button } from "components/buttons/Button";
import { Card } from "components/layout/Card";
import Papa from "papaparse";
import { useCallback, useRef, useState } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import { IoChevronBack } from "react-icons/io5";
import {
  CSVData,
  getAcceptedFiles,
  transformHeader,
  useMergedData,
} from "utils/batch";

interface NftDropBatchUploadProps {
  contract?: NFTDrop;
  isOpen: boolean;
  onClose: () => void;
}

export const NftDropBatchUpload: React.FC<NftDropBatchUploadProps> = ({
  contract,
  isOpen,
  onClose,
}) => {
  const [step, setStep] = useState(0);
  const [csvData, setCSVData] = useState<Papa.ParseResult<CSVData>>();
  const [jsonData, setJsonData] = useState<any>();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);
  const [noFile, setNoFile] = useState(false);

  const reset = useCallback(() => {
    setCSVData(undefined);
    setJsonData(undefined);
    setImageFiles([]);
    setVideoFiles([]);
    setNoFile(false);
  }, []);

  const _onClose = useCallback(() => {
    reset();
    setStep(0);
    onClose();
  }, [onClose, setStep, reset]);

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
      <DrawerOverlay />
      <DrawerContent overflowY="scroll">
        <Container maxW="container.page" borderRadius="2xl" my={12}>
          <Card bg="backgroundCardHighlight">
            <Flex flexDir="column" width="100%" p={4}>
              {step === 0 ? (
                <>
                  <Flex
                    align="center"
                    justify="space-between"
                    py={4}
                    w="100%"
                    mb={2}
                  >
                    <Heading size="title.md">Upload your NFTs</Heading>
                    <DrawerCloseButton position="relative" right={0} top={0} />
                  </Flex>
                  <Flex direction="column" gap={6} h="100%">
                    {csvData || jsonData ? (
                      <BatchTable
                        portalRef={paginationPortalRef}
                        data={mergedData}
                      />
                    ) : (
                      <UploadStep
                        getRootProps={getRootProps}
                        getInputProps={getInputProps}
                        noFile={noFile}
                        isDragActive={isDragActive}
                      />
                    )}
                    <Flex borderTop="1px solid" borderTopColor="borderColor">
                      <Container maxW="container.page">
                        <Flex align="center" justify="space-between" p={4}>
                          <Box ref={paginationPortalRef} />
                          <Flex gap={2} align="center">
                            <Button
                              borderRadius="md"
                              isDisabled={!csvData && !jsonData}
                              onClick={() => {
                                reset();
                              }}
                            >
                              Reset
                            </Button>
                            <Button
                              borderRadius="md"
                              colorScheme="primary"
                              isDisabled={!csvData && !jsonData}
                              onClick={() => setStep(1)}
                            >
                              Next
                            </Button>
                          </Flex>
                        </Flex>
                      </Container>
                    </Flex>
                  </Flex>
                </>
              ) : (
                <>
                  <Flex
                    align="center"
                    justify="space-between"
                    py={4}
                    w="100%"
                    mb={2}
                  >
                    <HStack>
                      <Icon
                        boxSize={5}
                        as={IoChevronBack}
                        color="gray.600"
                        onClick={() => setStep(0)}
                        cursor="pointer"
                      />
                      <Heading size="title.md">
                        When will you reveal your NFTs?
                      </Heading>
                    </HStack>
                    <DrawerCloseButton position="relative" right={0} top={0} />
                  </Flex>
                  <SelectReveal
                    contract={contract}
                    mergedData={mergedData}
                    onClose={_onClose}
                  />
                </>
              )}
            </Flex>
          </Card>
        </Container>
      </DrawerContent>
    </Drawer>
  );
};
