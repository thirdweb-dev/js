import { BatchTable } from "./batch-table";
import { SelectReveal } from "./select-reveal";
import { UploadStep } from "./upload-step";
import { Box, Container, Flex, HStack, Icon } from "@chakra-ui/react";
import { useTotalCount } from "@thirdweb-dev/react";
import { SmartContract } from "@thirdweb-dev/sdk";
import { BigNumber } from "ethers";
import Papa from "papaparse";
import { useCallback, useRef, useState } from "react";
import { DropzoneOptions, useDropzone } from "react-dropzone";
import { IoChevronBack } from "react-icons/io5";
import { Button, Card, Drawer, Heading } from "tw-components";
import {
  CSVData,
  getAcceptedFiles,
  transformHeader,
  useMergedData,
} from "utils/batch";

interface BatchLazyMintProps {
  contract: SmartContract | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BatchLazyMint: React.FC<BatchLazyMintProps> = ({
  contract,
  isOpen,
  onClose,
}) => {
  const nextTokenIdToMint = useTotalCount(contract);
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
        // we know this array will always exist, but it might be empty
      } else if (json.length > 0) {
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });
  const paginationPortalRef = useRef<HTMLDivElement>(null);
  return (
    <Drawer
      allowPinchZoom
      preserveScrollBarGap
      size="full"
      onClose={_onClose}
      isOpen={isOpen}
    >
      <Container
        maxW="container.page"
        borderRadius={{ base: 0, md: "2xl" }}
        my={{ base: 0, md: 12 }}
        p={{ base: 0, md: 4 }}
      >
        <Card bg="backgroundCardHighlight">
          <Flex flexDir="column" width="100%" p={4}>
            {step === 0 ? (
              <>
                <Flex
                  align="center"
                  justify="space-between"
                  py={{ base: 2, md: 4 }}
                  w="100%"
                  mb={2}
                >
                  <Heading size="title.md">Upload your NFTs</Heading>
                </Flex>
                <Flex direction="column" gap={6} h="100%">
                  {csvData || jsonData ? (
                    <BatchTable
                      portalRef={paginationPortalRef}
                      data={mergedData}
                      nextTokenIdToMint={BigNumber.from(
                        nextTokenIdToMint.data || 0,
                      ).toNumber()}
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
                          <Button
                            borderRadius="md"
                            colorScheme="primary"
                            isDisabled={!csvData && !jsonData}
                            onClick={() => setStep(1)}
                            w={{ base: "100%", md: "auto" }}
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
    </Drawer>
  );
};
