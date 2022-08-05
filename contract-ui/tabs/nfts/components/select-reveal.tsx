import { Flex, Progress, Radio, Stack, Tooltip } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLazyMint } from "@thirdweb-dev/react";
import {
  EditionDrop,
  Erc721,
  NFTMetadataInput,
  UploadProgressEvent,
} from "@thirdweb-dev/sdk";
import { TransactionButton } from "components/buttons/TransactionButton";
import { useTrack } from "hooks/analytics/useTrack";
import { useTxNotifications } from "hooks/useTxNotifications";
import { MouseEventHandler, useState } from "react";
import { useForm } from "react-hook-form";
import { Card, Checkbox, Heading, Text } from "tw-components";
import { shuffleData } from "utils/batch";
import z from "zod";

interface SelectOptionProps {
  name: string;
  description: string;
  isActive: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
  disabled?: boolean;
  disabledText?: string;
}

const SelectOption: React.FC<SelectOptionProps> = ({
  name,
  description,
  isActive,
  onClick,
  disabled,
  disabledText,
}) => {
  return (
    <Tooltip
      label={
        disabled && (
          <Card bgColor="backgroundHighlight">
            <Text>{disabledText}</Text>
          </Card>
        )
      }
      bg="transparent"
      boxShadow="none"
      p={0}
      shouldWrapChildren
    >
      <Stack
        as={Card}
        padding={5}
        width={{ base: "inherit", md: "350px" }}
        borderRadius="md"
        borderColor={isActive ? "primary.500" : undefined}
        onClick={onClick}
        cursor={disabled ? "not-allowed" : "pointer"}
        pointerEvents={disabled ? "none" : undefined}
        bgColor={disabled ? "backgroundHighlight" : undefined}
      >
        <Stack flexDirection="row" alignItems="start" spacing={0} cursor="">
          <Radio
            cursor="pointer"
            size="lg"
            colorScheme="blue"
            mt={0.5}
            mr={2.5}
            isChecked={isActive}
            isDisabled={disabled}
          />
          <Stack ml={4} flexDirection="column" alignSelf="start">
            <Heading size="subtitle.sm" fontWeight="700" mb={0}>
              {name}
            </Heading>
            <Text size="body.sm" mt="4px">
              {description}
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </Tooltip>
  );
};

interface SelectRevealProps {
  contract?: Erc721;
  mergedData: NFTMetadataInput[];
  onClose: () => void;
}

const DelayedRevealSchema = z
  .object({
    name: z.string().min(1, "A name is required"),
    image: z.any().optional(),
    description: z.string().or(z.string().length(0)).optional(),
    password: z.string().min(1, "A password is required."),
    shuffle: z.boolean().default(false),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type DelayedRevealInput = z.infer<typeof DelayedRevealSchema>;

export const SelectReveal: React.FC<SelectRevealProps> = ({
  contract,
  mergedData,
  onClose,
}) => {
  const trackEvent = useTrack();
  const [selectedReveal, setSelectedReveal] = useState<
    "unselected" | "instant" | "delayed"
  >("instant");
  /*   const [show, setShow] = useState(false); */
  const [progress, setProgress] = useState<UploadProgressEvent>({
    progress: 0,
    total: 100,
  });

  const { register, watch } = useForm<DelayedRevealInput>({
    resolver: zodResolver(DelayedRevealSchema),
  });

  /*   const imageUrl = useImageFileOrUrl(watch("image")); */

  const mintBatch = useLazyMint(contract, (event: UploadProgressEvent) => {
    setProgress(event);
  });

  const { onSuccess, onError } = useTxNotifications(
    "Batch uploaded successfully",
    "Error uploading batch",
  );

  return (
    <Flex flexDir="column">
      <Flex
        gap={{ base: 3, md: 6 }}
        mb={6}
        flexDir={{ base: "column", md: "row" }}
      >
        <SelectOption
          name="Reveal upon mint"
          description="Collectors will immediately see the final NFT when they complete the minting"
          isActive={selectedReveal === "instant"}
          onClick={() => setSelectedReveal("instant")}
        />
        <SelectOption
          name="Delayed Reveal"
          description="Collectors will mint your placeholder image, then you reveal at a later time"
          isActive={selectedReveal === "delayed"}
          onClick={() => setSelectedReveal("delayed")}
          disabled={true}
          disabledText="Delayed reveal is not available yet on dashboard for custom contracts"
        />
      </Flex>
      <Flex>
        {selectedReveal === "instant" ? (
          <Flex flexDir="column" gap={2}>
            <Text size="body.md" color="gray.600">
              You&apos;re ready to go! Now you can upload the files, we will be
              uploading each file to IPFS so it might take a while.
            </Text>
            {contract instanceof EditionDrop ? null : (
              <Flex alignItems="center" gap={3}>
                <Checkbox {...register("shuffle")} />
                <Flex gap={1}>
                  <Text>Shuffle the order of the NFTs before uploading.</Text>
                  <Text fontStyle="italic">
                    This is an off-chain operation and is not provable.
                  </Text>
                </Flex>
              </Flex>
            )}
            <TransactionButton
              mt={4}
              size="lg"
              colorScheme="primary"
              transactionCount={1}
              isDisabled={!mergedData.length}
              type="submit"
              isLoading={mintBatch.isLoading}
              loadingText={
                progress.progress >= progress.total
                  ? `Waiting for approval...`
                  : `Uploading ${mergedData.length} NFTs...`
              }
              onClick={() => {
                trackEvent({
                  category: "batch-upload-instant",
                  action: "upload",
                  label: "attempt",
                });
                mintBatch.mutate(
                  {
                    metadatas: watch("shuffle")
                      ? shuffleData(mergedData)
                      : mergedData,
                  },
                  {
                    onSuccess: () => {
                      trackEvent({
                        category: "batch-upload-instant",
                        action: "upload",
                        label: "success",
                      });
                      onSuccess();
                      onClose();
                    },
                    onError: (error) => {
                      trackEvent({
                        category: "batch-upload-instant",
                        action: "upload",
                        label: "error",
                        error,
                      });
                      setProgress({
                        progress: 0,
                        total: 100,
                      });
                      onError(error);
                    },
                  },
                );
              }}
            >
              Upload {mergedData.length} NFTs
            </TransactionButton>
            {mintBatch.isLoading && (
              <Progress
                borderRadius="md"
                mt="12px"
                size="lg"
                hasStripe
                colorScheme="blue"
                value={(progress.progress / progress.total) * 100}
              />
            )}
          </Flex>
        ) : selectedReveal === "delayed" ? (
          <>
            {/* <Stack
            spacing={6}
            as="form"
            onSubmit={handleSubmit((data) => {
              mintDelayedRevealBatch.mutate(
                {
                  placeholder: {
                    name: data.name,
                    description: data.description || "",
                    image: data.image,
                  },
                  metadatas: watch("shuffle")
                    ? shuffleData(mergedData)
                    : mergedData,
                  password: data.password,
                  onProgress: (event: UploadProgressEvent) => {
                    setProgress(event);
                  },
                },
                {
                  onSuccess: () => {
                    onSuccess();
                    onClose();
                  },
                  onError: (err) => {
                    setProgress({
                      progress: 0,
                      total: 100,
                    });
                    onError(err);
                  },
                },
              );
            })}
          >
            <Stack spacing={3}>
              <Heading size="title.sm">Let&apos;s set a password</Heading>
              <Alert status="warning" borderRadius="lg">
                <AlertIcon />
                You&apos;ll need this password to reveal your NFTs. Please save
                it somewhere safe.
              </Alert>
              <Flex
                flexDir={{ base: "column", md: "row" }}
                gap={{ base: 4, md: 0 }}
              >
                <FormControl isRequired isInvalid={!!errors.password} mr={4}>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      {...register("password")}
                      placeholder="Choose password"
                      type={show ? "text" : "password"}
                    />
                    <InputRightElement
                      cursor="pointer"
                      children={
                        <Icon
                          as={show ? AiFillEye : AiFillEyeInvisible}
                          onClick={() => setShow(!show)}
                        />
                      }
                    />
                  </InputGroup>

                  <FormErrorMessage>
                    {errors?.password?.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl isRequired isInvalid={!!errors.confirmPassword}>
                  <FormLabel>Confirm password</FormLabel>
                  <Input
                    {...register("confirmPassword")}
                    placeholder="Confirm password"
                    type="password"
                  />
                  <FormErrorMessage>
                    {errors?.confirmPassword?.message}
                  </FormErrorMessage>
                </FormControl>
              </Flex>
            </Stack>
            <Stack spacing={5}>
              <Heading size="title.sm">Placeholder</Heading>
              <FormControl isInvalid={!!errors.image}>
                <FormLabel>Image</FormLabel>
                <Box width={{ base: "auto", md: "350px" }}>
                  <FileInput
                    accept={{ "image/*": [] }}
                    value={imageUrl}
                    showUploadButton
                    setValue={(file) => setValue("image", file)}
                    border="1px solid"
                    borderColor="gray.200"
                    borderRadius="md"
                    transition="all 200ms ease"
                    _hover={{ shadow: "sm" }}
                  />
                </Box>
                <FormHelperText>
                  You can optionally upload an image as the placeholder.
                </FormHelperText>
                <FormErrorMessage>
                  {errors?.image?.message as unknown as string}
                </FormErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={!!errors.name}>
                <FormLabel>Name</FormLabel>
                <Input
                  {...register("name")}
                  placeholder="eg. My NFT (Coming soon)"
                />
                <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
              </FormControl>
              <FormControl isInvalid={!!errors.description}>
                <FormLabel>Description</FormLabel>
                <Textarea
                  {...register("description")}
                  placeholder="eg. Reveal on July 15th!"
                />
                <FormErrorMessage>
                  {errors?.description?.message}
                </FormErrorMessage>
              </FormControl>
              <Flex alignItems="center" gap={3}>
                <Checkbox {...register("shuffle")} />
                <Flex gap={1}>
                  <Text>Shuffle the order of the NFTs before uploading.</Text>
                  <Text fontStyle="italic">
                    This is an off-chain operation and is not provable.
                  </Text>
                </Flex>
              </Flex>
              <TransactionButton
                mt={4}
                size="lg"
                colorScheme="primary"
                transactionCount={1}
                isDisabled={!mergedData.length}
                type="submit"
                isLoading={mintDelayedRevealBatch.isLoading}
                loadingText={
                  progress.progress >= progress.total
                    ? `Waiting for approval...`
                    : `Uploading ${mergedData.length} NFTs...`
                }
              >
                Upload {mergedData.length} NFTs
              </TransactionButton>
              {mintDelayedRevealBatch.isLoading && (
                <Progress
                  borderRadius="md"
                  mt="12px"
                  size="lg"
                  hasStripe
                  colorScheme="blue"
                  value={(progress.progress / progress.total) * 100}
                />
              )}
            </Stack>
          </Stack> */}
          </>
        ) : null}
      </Flex>
    </Flex>
  );
};
