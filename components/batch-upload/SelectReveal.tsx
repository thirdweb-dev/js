import {
  useNFTDropBatchMint,
  useNFTDropDelayedRevealBatchMint,
} from "@3rdweb-sdk/react/hooks/useNFTDrop";
import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Radio,
  Stack,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { NFTDrop, NFTMetadataInput } from "@thirdweb-dev/sdk";
import { TransactionButton } from "components/buttons/TransactionButton";
import { Card } from "components/layout/Card";
import { FileInput } from "components/shared/FileInput";
import { useImageFileOrUrl } from "hooks/useImageFileOrUrl";
import { MouseEventHandler, useState } from "react";
import { useForm } from "react-hook-form";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { parseErrorToMessage } from "utils/errorParser";
import z from "zod";

interface SelectRevealOptionProps {
  name: string;
  description: string;
  isActive: boolean;
  onClick: MouseEventHandler<HTMLDivElement>;
  disabled?: boolean;
}

const SelectRevealOption: React.FC<SelectRevealOptionProps> = ({
  name,
  description,
  isActive,
  onClick,
}) => {
  return (
    <Stack
      as={Card}
      padding={5}
      width={{ base: "inherit", md: "350px" }}
      borderRadius="md"
      borderColor={isActive ? "primary.500" : undefined}
      onClick={onClick}
      cursor={"pointer"}
    >
      <Stack flexDirection="row" alignItems="start" spacing={0}>
        <Radio
          cursor="pointer"
          size="lg"
          colorScheme="blue"
          mt={0.5}
          mr={2.5}
          isChecked={isActive}
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
  );
};

interface SelectRevealProps {
  contract?: NFTDrop;
  mergedData: NFTMetadataInput[];
  onClose: () => void;
}

const DelayedRevealSchema = z
  .object({
    name: z.string().nonempty("A name is required"),
    image: z.any().optional(),
    description: z.string().or(z.string().length(0)).optional(),
    password: z.string().nonempty({ message: "A password is required." }),
    confirmPassword: z
      .string()
      .nonempty({ message: "Please confirm your password." }),
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
  const [selectedReveal, setSelectedReveal] = useState<
    "unselected" | "instant" | "delayed"
  >("unselected");
  const [show, setShow] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<DelayedRevealInput>({
    resolver: zodResolver(DelayedRevealSchema),
  });

  const imageUrl = useImageFileOrUrl(watch("image"));

  const mintBatch = useNFTDropBatchMint(contract);
  const mintDelayedRevealBatch = useNFTDropDelayedRevealBatchMint(contract);

  const toast = useToast();

  const onSuccess = (): void => {
    toast({
      title: "Success",
      description: "Batch uploaded successfully",
      status: "success",
      duration: 5000,
      isClosable: true,
    });
    onClose();
  };

  const onSubmit = (data: DelayedRevealInput) => {
    mintDelayedRevealBatch.mutate(
      {
        placeholder: {
          name: data.name,
          description: data.description || "",
          image: data.image,
        },
        metadatas: mergedData,
        password: data.password,
      },
      {
        onSuccess,
        onError: (error) => {
          toast({
            title: "Error uploading delayed reveal batch",
            description: parseErrorToMessage(error),
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        },
      },
    );
  };

  return (
    <Flex flexDir="column">
      <Flex
        gap={{ base: 3, md: 6 }}
        mb={6}
        flexDir={{ base: "column", md: "row" }}
      >
        <SelectRevealOption
          name="Reveal upon mint"
          description="Collectors will immediately see the final NFT when they complete the minting"
          isActive={selectedReveal === "instant"}
          onClick={() => setSelectedReveal("instant")}
        />
        <SelectRevealOption
          name="Delayed Reveal"
          description="Collectors will mint your placeholder image, then you reveal at a later time"
          isActive={selectedReveal === "delayed"}
          onClick={() => setSelectedReveal("delayed")}
        />
      </Flex>
      <Flex>
        {selectedReveal === "instant" ? (
          <Flex flexDir="column">
            <Text size="body.md" color="gray.600">
              You&apos;re ready to go! Now you can upload the files, we will be
              uploading each file to IPFS so it might take a while.
            </Text>
            <TransactionButton
              mt={4}
              size="lg"
              colorScheme="primary"
              transactionCount={1}
              isDisabled={!mergedData.length}
              type="submit"
              isLoading={mintBatch.isLoading}
              loadingText={`Uploading ${mergedData.length} NFTs...`}
              onClick={() => {
                mintBatch.mutate(mergedData, {
                  onSuccess: onClose,
                });
              }}
            >
              Upload {mergedData.length} NFTs
            </TransactionButton>
          </Flex>
        ) : selectedReveal === "delayed" ? (
          <Stack spacing={6} as="form" onSubmit={handleSubmit(onSubmit)}>
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
                    accept="image/*"
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
                <FormErrorMessage>{errors?.image?.message}</FormErrorMessage>
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
              <TransactionButton
                mt={4}
                size="lg"
                colorScheme="primary"
                transactionCount={1}
                isDisabled={!mergedData.length}
                type="submit"
                isLoading={mintDelayedRevealBatch.isLoading}
                loadingText={`Uploading ${mergedData.length} NFTs...`}
              >
                Upload {mergedData.length} NFTs
              </TransactionButton>
            </Stack>
          </Stack>
        ) : null}
      </Flex>
    </Flex>
  );
};
