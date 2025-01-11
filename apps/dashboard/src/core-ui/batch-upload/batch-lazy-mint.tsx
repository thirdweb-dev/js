"use client";

import { Checkbox, CheckboxWithLabel } from "@/components/ui/checkbox";
import type { Account } from "@3rdweb-sdk/react/hooks/useApi";
import {
  Alert,
  AlertIcon,
  Flex,
  FormControl,
  Input,
  InputGroup,
  InputRightElement,
  Textarea,
} from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionButton } from "components/buttons/TransactionButton";
import { FileInput } from "components/shared/FileInput";
import { useImageFileOrUrl } from "hooks/useImageFileOrUrl";
import { ChevronLeftIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import { useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import type { CreateDelayedRevealBatchParams } from "thirdweb/extensions/erc721";
import type { NFTInput } from "thirdweb/utils";
import {
  Button,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Text,
  TrackedLink,
} from "tw-components";
import type { ComponentWithChildren } from "types/component-with-children";
import { processInputData, shuffleData } from "utils/batch";
import { z } from "zod";
import { BatchTable } from "./batch-table";
import { SelectOption } from "./lazy-mint-form/select-option";
import { UploadStep } from "./upload-step";

type DelayedSubmit = {
  revealType: "delayed";
  data: CreateDelayedRevealBatchParams;
};
type InstantSubmit = {
  revealType: "instant";
  data: { metadatas: NFTInput[] };
};

type SubmitType = DelayedSubmit | InstantSubmit;

interface BatchLazyMintEVMProps {
  nextTokenIdToMint: bigint;
  canCreateDelayedRevealBatch: boolean;
  onSubmit: (formData: SubmitType) => Promise<unknown>;
  chainId: number;
}

type BatchLazyMintProps = BatchLazyMintEVMProps;

const BatchLazyMintFormSchema = z
  .object({
    // delayed reveal placeholder
    placeHolder: z
      .object({
        name: z.string().min(1, "A name is required"),
        image: z.any().optional(),
        description: z.string().or(z.string().length(0)).optional(),
      })
      .optional(),
    // delayed reveal password logic
    password: z.string().min(1, "A password is required.").optional(),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password.")
      .optional(),

    // shared logic
    shuffle: z.boolean().default(false),
    revealType: z.literal("instant").or(z.literal("delayed")).optional(),

    // metadata
    metadatas: z.array(z.any()),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type BatchLazyMintFormType = z.output<typeof BatchLazyMintFormSchema> & {
  metadatas: NFTInput[];
};

function useBatchLazyMintForm() {
  return useForm<BatchLazyMintFormType>({
    resolver: zodResolver(BatchLazyMintFormSchema),
    defaultValues: {
      metadatas: [],
      revealType: undefined,
      shuffle: false,
    },
  });
}

export const BatchLazyMint: ComponentWithChildren<
  BatchLazyMintProps & {
    twAccount: Account | undefined;
  }
> = (props) => {
  const [step, setStep] = useState(0);

  const form = useBatchLazyMintForm();

  const nftMetadatas = form.watch("metadatas");
  const hasError = !!form.getFieldState("metadatas", form.formState).error;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (acceptedFiles) => {
      try {
        await processInputData(acceptedFiles, (data) =>
          form.setValue("metadatas", data),
        );
      } catch {
        form.setError("metadatas", {
          message: "Invalid metadata files",
          type: "validate",
        });
      }

      if (nftMetadatas.length === 0) {
        form.setError("metadatas", {
          message: "Invalid metadata files",
          type: "validate",
        });
      }
    },
  });

  const paginationPortalRef = useRef<HTMLDivElement>(null);

  return (
    <form
      className="mt-4 flex w-full flex-col"
      onSubmit={form.handleSubmit((data) => {
        // first shuffle
        const shuffledMetadatas = data.shuffle
          ? shuffleData(data.metadatas)
          : data.metadatas;

        // check submit is instant
        if (data.revealType === "instant") {
          return props.onSubmit({
            revealType: "instant",
            data: { metadatas: shuffledMetadatas },
          });
        }
        // validate password
        if (!data.password) {
          form.setError("password", {
            message: "A password is required for delayed reveal.",
            type: "validate",
          });
          return;
        }
        // validate placeholder
        if (!data.placeHolder?.name) {
          form.setError("placeHolder.name", {
            message: "A name is required for delayed reveal.",
            type: "validate",
          });
        }
        // submit
        return props.onSubmit({
          revealType: "delayed",
          data: {
            metadata: shuffledMetadatas,
            password: data.password,
            placeholderMetadata: {
              name: data.placeHolder?.name,
              description: data.placeHolder?.description,
              image: data.placeHolder?.image,
            },
          },
        });
      })}
    >
      {step === 0 ? (
        <div className="flex flex-col gap-6">
          {nftMetadatas.length > 0 ? (
            <>
              <BatchTable
                portalRef={paginationPortalRef}
                data={nftMetadatas}
                nextTokenIdToMint={props.nextTokenIdToMint}
              />
              <div className="border-border border-t">
                <div className="flex flex-col items-center justify-between p-0 md:flex-row md:p-4">
                  <div ref={paginationPortalRef} />
                  <div className="mt-4 flex w-full flex-row items-center gap-2 md:mt-0 md:w-auto">
                    <Button
                      borderRadius="md"
                      isDisabled={!hasError}
                      onClick={() => {
                        form.reset();
                      }}
                      w={{ base: "100%", md: "auto" }}
                    >
                      Reset
                    </Button>
                    <Button
                      borderRadius="md"
                      colorScheme="primary"
                      onClick={() => setStep(1)}
                      w={{ base: "100%", md: "auto" }}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <UploadStep
              getRootProps={getRootProps}
              getInputProps={getInputProps}
              hasFailed={hasError}
              isDragActive={isDragActive}
            />
          )}
        </div>
      ) : (
        <>
          <Flex align="center" justify="space-between" py={4} w="100%" mb={2}>
            <div className="flex flex-row items-center gap-2">
              <Button
                className="text-muted-foreground"
                variant="ghost"
                onClick={() => setStep(0)}
              >
                <ChevronLeftIcon className="size-5 cursor-pointer" />
              </Button>
              <Heading size="title.md" className="my-auto">
                When will you reveal your NFTs?
              </Heading>
            </div>
          </Flex>
          <SelectReveal
            form={form}
            canCreateDelayedRevealBatch={props.canCreateDelayedRevealBatch}
          />
          {form.watch("revealType") && (
            <>
              <CheckboxWithLabel>
                <Checkbox
                  className="mt-3"
                  checked={form.watch("shuffle")}
                  onCheckedChange={(val) => form.setValue("shuffle", !!val)}
                />
                <div className="flex flex-col items-center gap-1 md:flex-row">
                  <p>Shuffle the order of the NFTs before uploading.</p>
                  <em>This is an off-chain operation and is not provable.</em>
                </div>
              </CheckboxWithLabel>
              <div className="w-full md:w-[61%]">
                <TransactionButton
                  txChainID={props.chainId}
                  className="mt-4 w-full"
                  transactionCount={1}
                  disabled={!nftMetadatas.length}
                  type="submit"
                  isPending={form.formState.isSubmitting}
                  twAccount={props.twAccount}
                >
                  {form.formState.isSubmitting
                    ? `Uploading ${nftMetadatas.length} NFTs`
                    : `Upload ${nftMetadatas.length} NFTs`}
                </TransactionButton>
                {props.children}
              </div>
              <Text size="body.sm" mt={2}>
                <TrackedLink
                  href="https://support.thirdweb.com/dashboard/n5evQ4EfEjEifczEQaZ1hL/batch-upload-troubleshooting/5WMQFqfaUTU1C8NM8FtJ2X"
                  isExternal
                  category="batch-upload"
                  label="issues"
                >
                  Experiencing issues uploading your files?
                </TrackedLink>
              </Text>
            </>
          )}
        </>
      )}
    </form>
  );
};

interface SelectRevealProps {
  form: ReturnType<typeof useBatchLazyMintForm>;
  canCreateDelayedRevealBatch: boolean;
}

const SelectReveal: React.FC<SelectRevealProps> = ({
  form,
  canCreateDelayedRevealBatch,
}) => {
  const [show, setShow] = useState(false);

  const imageUrl = useImageFileOrUrl(form.watch("placeHolder.image"));
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
          isActive={form.watch("revealType") === "instant"}
          onClick={() => form.setValue("revealType", "instant")}
        />
        <SelectOption
          name="Delayed Reveal"
          description="Collectors will mint your placeholder image, then you reveal at a later time"
          isActive={form.watch("revealType") === "delayed"}
          onClick={() => form.setValue("revealType", "delayed")}
          disabled={!canCreateDelayedRevealBatch}
          disabledText="This contract doesn't implement Delayed Reveal"
        />
      </Flex>
      <div className="flex flex-col gap-3">
        {form.watch("revealType") === "delayed" && (
          <>
            <Heading size="title.sm">Let&apos;s set a password</Heading>
            <Alert status="warning" borderRadius="lg">
              <AlertIcon />
              You&apos;ll need this password to reveal your NFTs. Please save it
              somewhere safe.
            </Alert>

            <Flex
              flexDir={{ base: "column", md: "row" }}
              gap={{ base: 4, md: 0 }}
            >
              <FormControl
                isRequired
                isInvalid={
                  !!form.getFieldState("password", form.formState).error
                }
                mr={4}
              >
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    {...form.register("password")}
                    placeholder="Choose password"
                    type={show ? "text" : "password"}
                  />
                  <InputRightElement cursor="pointer">
                    {show ? (
                      <EyeIcon
                        onClick={() => setShow(!show)}
                        className="size-3"
                      />
                    ) : (
                      <EyeOffIcon
                        onClick={() => setShow(!show)}
                        className="size-3"
                      />
                    )}
                  </InputRightElement>
                </InputGroup>

                <FormErrorMessage>
                  {
                    form.getFieldState("password", form.formState).error
                      ?.message
                  }
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isRequired
                isInvalid={
                  !!form.getFieldState("confirmPassword", form.formState).error
                }
              >
                <FormLabel>Confirm password</FormLabel>
                <Input
                  {...form.register("confirmPassword")}
                  placeholder="Confirm password"
                  type="password"
                />
                <FormErrorMessage>
                  {
                    form.getFieldState("confirmPassword", form.formState).error
                      ?.message
                  }
                </FormErrorMessage>
              </FormControl>
            </Flex>
            <div className="flex flex-col gap-5">
              <Heading size="title.sm">Placeholder</Heading>
              <FormControl
                isInvalid={
                  !!form.getFieldState("placeHolder.image", form.formState)
                    .error
                }
              >
                <FormLabel>Image</FormLabel>
                <div className="w-auto md:w-[350px]">
                  <FileInput
                    accept={{ "image/*": [] }}
                    value={imageUrl}
                    showUploadButton
                    setValue={(file) =>
                      form.setValue("placeHolder.image", file)
                    }
                    className="rounded border border-border transition-all duration-200"
                  />
                </div>
                <FormHelperText>
                  You can optionally upload an image as the placeholder.
                </FormHelperText>
                <FormErrorMessage>
                  {
                    form.getFieldState("placeHolder.image", form.formState)
                      .error?.message
                  }
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isRequired
                isInvalid={
                  !!form.getFieldState("placeHolder.name", form.formState).error
                }
              >
                <FormLabel>Name</FormLabel>
                <Input
                  {...form.register("placeHolder.name")}
                  placeholder="eg. My NFT (Coming soon)"
                />
                <FormErrorMessage>
                  {
                    form.getFieldState("placeHolder.name", form.formState).error
                      ?.message
                  }
                </FormErrorMessage>
              </FormControl>
              <FormControl
                isInvalid={
                  !!form.getFieldState("placeHolder.name", form.formState).error
                }
              >
                <FormLabel>Description</FormLabel>
                <Textarea
                  {...form.register("placeHolder.description")}
                  placeholder="eg. Reveal on July 15th!"
                />
                <FormErrorMessage>
                  {
                    form.getFieldState(
                      "placeHolder.description",
                      form.formState,
                    ).error?.message
                  }
                </FormErrorMessage>
              </FormControl>
            </div>
          </>
        )}
      </div>
    </Flex>
  );
};
