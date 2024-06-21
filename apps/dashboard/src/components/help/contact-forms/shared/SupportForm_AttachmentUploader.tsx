import type { CreateTicketInput } from "@3rdweb-sdk/react/hooks/useApi";
import {
  AspectRatio,
  Box,
  ButtonGroup,
  Center,
  Divider,
  Flex,
  GridItem,
  Icon,
  SimpleGrid,
  Tooltip,
  useToast,
} from "@chakra-ui/react";
import { TWMediaRenderer } from "components/ipfs-upload/dropzone";
import { type Dispatch, type SetStateAction, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";
import { BsFillCloudUploadFill } from "react-icons/bs";
import { FiTrash2 } from "react-icons/fi";
import {
  Button,
  Card,
  FormLabel,
  Heading,
  Text,
  TrackedIconButton,
} from "tw-components";

// Unthread only allow attaching 10 files at once
const MAX_FILES = 10;
// and each file should be less than 20 MB
const MAX_FILE_SIZE = 20 * 1024 * 1024;

export const AttachmentForm = () => {
  const [droppedFiles, setDroppedFiles] = useState<File[]>([]);
  const form = useFormContext<CreateTicketInput>();
  const toast = useToast();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files, rejectedFiles) => {
      if (files.length > 10) {
        return toast({
          position: "bottom",
          variant: "solid",
          title: "Error adding files",
          description: "Maximum 10 files allowed",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      if (rejectedFiles.length) {
        return toast({
          position: "bottom",
          variant: "solid",
          title: "Error adding files",
          description: "Each file should not be larger than 20MB",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      setDroppedFiles((prev) => [...prev, ...files]);
      form.setValue("files", files);
    },
    maxFiles: MAX_FILES,
    maxSize: MAX_FILE_SIZE,
  });

  return (
    <Flex flexDir="column">
      <FormLabel>Attachment</FormLabel>
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
            cursor="pointer"
          >
            <input {...getInputProps()} />

            {
              <Flex direction="column" p={2} align="center">
                {isDragActive ? (
                  <>
                    <Icon
                      as={BsFillCloudUploadFill}
                      boxSize={8}
                      mb={2}
                      color="gray.600"
                    />
                    <Text size="label.lg">Drop your files here</Text>
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
                      Drop your files here
                    </Text>
                  </>
                )}
              </Flex>
            }
          </Center>
        )}
      </AspectRatio>
    </Flex>
  );
};

interface FileUploadProps {
  files: File[];
  updateFiles: Dispatch<SetStateAction<File[]>>;
}

// this is a simplified version of the <FileUpload /> in dropzone.tsx
// since Unthread only allows 10 files per upload, we don't have to worry about pagination
const FileUpload: React.FC<FileUploadProps> = ({ files, updateFiles }) => {
  return (
    <Flex direction="column" w="full" h="full" justify="space-between">
      <SimpleGrid columns={1} p={1.5} gap={1.5} overflow="auto">
        {files.map((file, index) => {
          return (
            <GridItem colSpan={0} key={`${file.name}_${index}`}>
              <SimpleGrid
                as={Card}
                columns={40}
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
                <GridItem colSpan={15} rowSpan={1}>
                  <Heading size="label.md" as="label" noOfLines={2}>
                    {file.name}
                  </Heading>
                </GridItem>

                <GridItem colSpan={2} rowSpan={1} placeItems="center">
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
                      category={""}
                      label="remove-file"
                      icon={<Icon as={FiTrash2} />}
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        updateFiles((prev) => prev.filter((f) => f !== file));
                      }}
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
        <ButtonGroup p={{ base: 0, md: 2 }}>
          <Button
            isDisabled={false}
            onClick={() => {
              updateFiles([]);
            }}
          >
            Reset
          </Button>
        </ButtonGroup>
      </Flex>
    </Flex>
  );
};
