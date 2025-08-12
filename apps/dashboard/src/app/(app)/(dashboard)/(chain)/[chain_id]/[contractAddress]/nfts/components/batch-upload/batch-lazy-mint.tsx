"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  EyeIcon,
  EyeOffIcon,
  HelpCircleIcon,
  LockKeyholeIcon,
  RefreshCcwIcon,
  ShuffleIcon,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import type { CreateDelayedRevealBatchParams } from "thirdweb/extensions/erc721";
import type { NFTInput } from "thirdweb/utils";
import { z } from "zod";
import { FileInput } from "@/components/blocks/FileInput";
import { TransactionButton } from "@/components/tx-button";
import { Button } from "@/components/ui/button";
import { Form, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { TabButtons } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { processInputData, shuffleData } from "@/utils/batch";
import { BatchTable } from "./batch-table";
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

const BatchLazyMintFormSchema = z
  .object({
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password.")
      .optional(),

    // metadata
    metadatas: z.array(z.any()),
    // delayed reveal password logic
    password: z.string().min(1, "A password is required.").optional(),
    // delayed reveal placeholder
    placeHolder: z
      .object({
        description: z.string().or(z.string().length(0)).optional(),
        image: z.any().optional(),
        name: z.string().min(1, "A name is required"),
      })
      .optional(),
    revealType: z.literal("instant").or(z.literal("delayed")),

    // shared logic
    shuffle: z.boolean().default(false),
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
    defaultValues: {
      metadatas: [],
      revealType: "instant",
      shuffle: false,
    },
    resolver: zodResolver(BatchLazyMintFormSchema),
  });
}

export function BatchLazyMint(props: {
  nextTokenIdToMint: bigint;
  canCreateDelayedRevealBatch: boolean;
  onSubmit: (formData: SubmitType) => Promise<unknown>;
  chainId: number;
  client: ThirdwebClient;
  isLoggedIn: boolean;
}) {
  const [step, setStep] = useState(0);

  const form = useBatchLazyMintForm();

  const nftMetadatas = form.watch("metadatas");
  const hasError = !!form.getFieldState("metadatas", form.formState).error;

  return (
    <Form {...form}>
      <form
        className="mt-4 flex w-full flex-col"
        onSubmit={form.handleSubmit(async (data) => {
          // first shuffle
          const shuffledMetadatas = data.shuffle
            ? shuffleData(data.metadatas)
            : data.metadatas;

          // check submit is instant
          if (data.revealType === "instant") {
            return props.onSubmit({
              data: { metadatas: shuffledMetadatas },
              revealType: "instant",
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
          await props.onSubmit({
            data: {
              metadata: shuffledMetadatas,
              password: data.password,
              placeholderMetadata: {
                description: data.placeHolder?.description,
                image: data.placeHolder?.image,
                name: data.placeHolder?.name,
              },
            },
            revealType: "delayed",
          });
        })}
      >
        {step === 0 ? (
          <div>
            {nftMetadatas.length > 0 ? (
              <div className="pb-10">
                <h2 className="text-2xl font-semibold tracking-tight mb-4">
                  Upload NFTs
                </h2>

                <BatchTable
                  client={props.client}
                  data={nftMetadatas}
                  nextTokenIdToMint={props.nextTokenIdToMint}
                />
                <div className="mt-5 flex justify-end gap-4">
                  <Button
                    className="w-full md:w-auto gap-2"
                    disabled={!hasError}
                    onClick={() => {
                      form.reset();
                    }}
                    variant="outline"
                  >
                    <RefreshCcwIcon className="size-4" />
                    Reset
                  </Button>
                  <Button
                    className="w-full md:w-auto gap-2"
                    onClick={() => setStep(1)}
                  >
                    Next <ArrowRightIcon className="size-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <UploadStep
                hasFailed={hasError}
                reset={() => {
                  form.reset();
                }}
                onDrop={async (acceptedFiles) => {
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
                }}
              />
            )}
          </div>
        ) : (
          <div className="container px-0 max-w-4xl pb-14">
            <div className="flex mb-3">
              <Button
                className="gap-2 -translate-x-3 text-muted-foreground"
                size="sm"
                onClick={() => setStep(0)}
                variant="ghost"
              >
                <ArrowLeftIcon className="size-4" />
                Back
              </Button>
            </div>

            <h2 className="text-2xl font-semibold tracking-tight mb-4">
              Upload NFTs
            </h2>

            <SelectReveal
              canCreateDelayedRevealBatch={props.canCreateDelayedRevealBatch}
              client={props.client}
              form={form}
            />

            <div className="h-4" />

            <div className="space-y-6">
              {form.watch("revealType") === "delayed" && (
                <DelayedRevealConfiguration client={props.client} form={form} />
              )}

              {/* shuffle */}
              <ShuffleNFTsCard
                isShuffleEnabled={form.watch("shuffle")}
                onShuffleChange={(val) => form.setValue("shuffle", val)}
              />

              <div className="space-y-3">
                <div className="flex justify-end">
                  <TransactionButton
                    client={props.client}
                    disabled={!nftMetadatas.length}
                    isLoggedIn={props.isLoggedIn}
                    isPending={form.formState.isSubmitting}
                    transactionCount={1}
                    txChainID={props.chainId}
                    type="submit"
                  >
                    {form.formState.isSubmitting
                      ? `Uploading ${nftMetadatas.length} NFTs`
                      : `Upload ${nftMetadatas.length} NFTs`}
                  </TransactionButton>
                </div>

                <div className="flex justify-end">
                  <Link
                    className="text-sm flex items-center gap-2 text-muted-foreground hover:text-foreground"
                    href="https://portal.thirdweb.com/knowledge-base/troubleshoot/contracts/batch-upload"
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    <HelpCircleIcon className="size-4" />
                    Experiencing issues uploading your files?
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </form>
    </Form>
  );
}

function ShuffleNFTsCard(props: {
  isShuffleEnabled: boolean;
  onShuffleChange: (val: boolean) => void;
}) {
  return (
    <div className="px-4 lg:px-6 py-8 border rounded-lg bg-card relative">
      <div className="flex mb-3">
        <div className="p-2 rounded-full border bg-card">
          <ShuffleIcon className="size-4 text-muted-foreground" />
        </div>
      </div>

      <h3 className="font-semibold text-lg mb-0.5 tracking-tight">
        Shuffle NFTs
      </h3>

      <p className="text-sm text-muted-foreground">
        Shuffle the order of the NFTs before uploading. This is an off-chain
        operation and is not provable
      </p>

      <Switch
        checked={props.isShuffleEnabled}
        onCheckedChange={(val) => props.onShuffleChange(!!val)}
        className="absolute right-4 top-4 lg:right-6 lg:top-8"
      />
    </div>
  );
}

function SelectReveal(props: {
  form: ReturnType<typeof useBatchLazyMintForm>;
  canCreateDelayedRevealBatch: boolean;
  client: ThirdwebClient;
}) {
  const { form, canCreateDelayedRevealBatch } = props;

  return (
    <div>
      {canCreateDelayedRevealBatch && (
        <TabButtons
          containerClassName="mb-8"
          tabs={[
            {
              name: "Reveal upon mint",
              onClick: () => {
                form.setValue("revealType", "instant");
                // reset all fields related to delayed reveal
                form.resetField("password");
                form.resetField("confirmPassword");
                form.resetField("placeHolder");
              },
              isActive: form.watch("revealType") === "instant",
            },
            {
              name: "Delayed Reveal",
              onClick: () => form.setValue("revealType", "delayed"),
              isActive: form.watch("revealType") === "delayed",
            },
          ]}
        />
      )}

      {form.watch("revealType") === "instant" && (
        <div>
          <h2 className="font-semibold text-xl mb-1 tracking-tight leading-none">
            Reveal upon mint
          </h2>
          <p className="text-muted-foreground text-sm">
            Collectors will immediately see the final NFT when they complete the
            minting
          </p>
        </div>
      )}

      {form.watch("revealType") === "delayed" && (
        <div>
          <h2 className="font-semibold text-xl mb-1 tracking-tight leading-none">
            Delayed Reveal
          </h2>
          <p className="text-muted-foreground text-sm">
            Collectors will mint your placeholder image, then you reveal at a
            later time
          </p>
        </div>
      )}
    </div>
  );
}

function DelayedRevealConfiguration(props: {
  form: ReturnType<typeof useBatchLazyMintForm>;
  client: ThirdwebClient;
}) {
  const { form, client } = props;
  const [show, setShow] = useState(false);
  const imageUrl = form.watch("placeHolder.image");

  return (
    <div className="space-y-6">
      {/* password  */}
      <div className="border px-4 lg:px-6 py-8 rounded-lg bg-card">
        <div className="flex mb-3">
          <div className="p-2 rounded-full border bg-card">
            <LockKeyholeIcon className="size-4 text-muted-foreground" />
          </div>
        </div>
        <h3 className="font-semibold text-lg mb-0.5 tracking-tight">
          Set password
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          You'll need this password to reveal your NFTs. Please save it
          somewhere safe
        </p>

        <div className="space-y-5">
          {/* select password */}
          <FormItem className="space-y-1">
            <FormLabel>Password</FormLabel>
            <div className="relative max-w-md">
              <Input
                {...form.register("password")}
                className="pr-10"
                type={show ? "text" : "password"}
              />
              <Button
                variant="ghost"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 h-auto text-muted-foreground"
                onClick={() => setShow(!show)}
              >
                {show ? (
                  <EyeIcon className="size-4" />
                ) : (
                  <EyeOffIcon className="size-4" />
                )}
              </Button>
            </div>
            <FormMessage>
              {form.getFieldState("password", form.formState).error?.message}
            </FormMessage>
          </FormItem>

          {/* confirm password */}
          <FormItem className="space-y-1">
            <FormLabel>Confirm password</FormLabel>
            <div className="relative max-w-md">
              <Input
                {...form.register("confirmPassword")}
                className="pr-10"
                type="password"
              />
            </div>
            <FormMessage>
              {
                form.getFieldState("confirmPassword", form.formState).error
                  ?.message
              }
            </FormMessage>
          </FormItem>
        </div>
      </div>

      {/* placeholder */}
      <div className="border px-4 lg:px-6 py-8 rounded-lg bg-card">
        <div className="flex mb-3">
          <div className="p-2 rounded-full border bg-card">
            <EyeIcon className="size-4 text-muted-foreground" />
          </div>
        </div>
        <h3 className="font-semibold text-lg tracking-tight mb-0.5">
          Set placeholder metadata
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          The placeholder metadata will be displayed for all NFTs until you
          reveal your NFTs
        </p>
        <div className="flex flex-col lg:flex-row gap-5">
          <FormItem className="w-[200px]">
            <FormLabel>Image</FormLabel>
            <FileInput
              accept={{ "image/*": [] }}
              className="rounded border bg-background transition-all duration-200 "
              client={client}
              setValue={(file) => form.setValue("placeHolder.image", file)}
              value={imageUrl}
            />

            <FormMessage>
              {
                form.getFieldState("placeHolder.image", form.formState).error
                  ?.message
              }
            </FormMessage>
          </FormItem>
          <div className="grow space-y-5 flex flex-col">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <Input
                className="max-w-sm"
                {...form.register("placeHolder.name")}
                placeholder="My NFT (Coming soon)"
              />
              <FormMessage>
                {
                  form.getFieldState("placeHolder.name", form.formState).error
                    ?.message
                }
              </FormMessage>
            </FormItem>
            <FormItem className="grow flex flex-col">
              <FormLabel>Description</FormLabel>
              <Textarea
                {...form.register("placeHolder.description")}
                className="grow"
                placeholder="Reveal on July 15th!"
              />
              <FormMessage>
                {
                  form.getFieldState("placeHolder.description", form.formState)
                    .error?.message
                }
              </FormMessage>
            </FormItem>
          </div>
        </div>
      </div>
    </div>
  );
}
