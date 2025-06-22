"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, ArrowRightIcon, AsteriskIcon } from "lucide-react";
import { useId } from "react";
import { useForm } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import { FileInput } from "@/components/blocks/FileInput";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { TokenSelector } from "@/components/blocks/TokenSelector";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DecimalInput } from "@/components/ui/decimal-input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  getUploadedNFTMediaMeta,
  handleNFTMediaUpload,
} from "../../../../../../../../../(dashboard)/(chain)/[chain_id]/[contractAddress]/modules/components/nft/handleNFTMediaUpload";
import type { NFTMetadataWithPrice } from "../batch-upload/process-files";
import { nftWithPriceSchema } from "../schema";
import { AttributesFieldset } from "./attributes";

export function SingleUploadNFT(props: {
  client: ThirdwebClient;
  onNext: () => void;
  onPrev: () => void;
  chainId: number;
  nftData: NFTMetadataWithPrice | null;
  setNFTData: (nftData: NFTMetadataWithPrice) => void;
}) {
  const form = useForm<NFTMetadataWithPrice>({
    defaultValues: {
      attributes: [{ trait_type: "", value: "" }],
      description: "",
      image: undefined,
      name: "",
    },
    resolver: zodResolver(nftWithPriceSchema),
    reValidateMode: "onChange",
    values: props.nftData || undefined,
  });

  const nameId = useId();
  const descriptionId = useId();

  const priceAmountId = useId();
  const supplyId = useId();

  function handlePrev() {
    props.setNFTData(form.getValues()); // save before going back
    props.onPrev();
  }

  const setFile = (file: File) => {
    handleNFTMediaUpload({ file, form });
  };

  const { media, image, mediaFileError, showCoverImageUpload, external_url } =
    getUploadedNFTMediaMeta(form);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          props.setNFTData(values);
          props.onNext();
        })}
      >
        <div
          className={cn(
            "flex flex-col gap-6 px-4 py-6 md:grid md:grid-cols-[250px_1fr] md:px-6",
            showCoverImageUpload && "!flex flex-col",
          )}
        >
          {/* left */}
          <div
            className={cn(
              showCoverImageUpload && "grid max-w-lg grid-cols-2 gap-6",
            )}
          >
            <FormFieldSetup
              errorMessage={mediaFileError?.message}
              htmlFor="media"
              isRequired={false}
              label="Media"
            >
              <p className="mb-2 text-muted-foreground text-sm">
                You can upload image, audio, video, html, text, pdf, or 3d model
                file
              </p>
              <FileInput
                className="rounded-lg bg-background"
                client={props.client}
                helperText="Media"
                selectOrUpload="Upload"
                setValue={setFile}
                showPreview={true}
                value={media}
              />
            </FormFieldSetup>

            {showCoverImageUpload && (
              <FormFieldSetup
                errorMessage={form.formState.errors?.image?.message}
                htmlFor="cover-image"
                isRequired={false}
                label="Cover Image"
              >
                <p className="mb-2 text-muted-foreground text-sm">
                  You can optionally upload an image as the cover of your NFT
                </p>
                <FileInput
                  accept={{ "image/*": [] }}
                  className="rounded-lg bg-background"
                  client={props.client}
                  helperText="Cover Image"
                  setValue={(file) => {
                    form.setValue("image", file);
                  }}
                  value={image}
                />
              </FormFieldSetup>
            )}
          </div>

          {/* right */}
          <div className="flex flex-col gap-6">
            {/* name  */}
            <FormFieldSetup
              errorMessage={form.formState.errors.name?.message}
              htmlFor="name"
              isRequired
              label="Name"
            >
              <Input
                id={nameId}
                placeholder="My NFT"
                {...form.register("name")}
              />
            </FormFieldSetup>

            <FormFieldSetup
              className="flex grow flex-col"
              errorMessage={form.formState.errors.description?.message}
              htmlFor="description"
              isRequired={false}
              label="Description"
            >
              <Textarea
                className="grow"
                id={descriptionId}
                placeholder="Describe your NFT"
                {...form.register("description")}
              />
            </FormFieldSetup>
          </div>
        </div>

        <div className="border-t border-dashed px-4 py-6 md:px-6">
          <AttributesFieldset form={form} />
        </div>

        {/* Price and Supply */}
        <div className="grid grid-cols-1 gap-4 border-t border-dashed px-4 py-6 md:px-6 lg:grid-cols-2">
          {/* Price */}
          <div className="space-y-1 ">
            <div className="inline-flex items-center gap-1">
              <Label>Price</Label>
              <AsteriskIcon className="size-3.5 text-destructive-text" />
            </div>
            <div className="flex">
              {/* Price Amount */}
              <div className="space-y-1">
                <DecimalInput
                  className="w-40 rounded-r-none border-r-0 bg-background"
                  id={priceAmountId}
                  onChange={(value) => {
                    form.setValue("price_amount", value, {
                      shouldValidate: true,
                    });
                  }}
                  placeholder="0.00"
                  value={form.watch("price_amount")}
                />
                {form.formState.errors.price_amount?.message && (
                  <p className="text-destructive-text text-sm">
                    {form.formState.errors.price_amount?.message}
                  </p>
                )}
              </div>

              {/* Price Currency */}
              <div className="flex-1 space-y-1">
                <TokenSelector
                  addNativeTokenIfMissing={true}
                  chainId={props.chainId}
                  className="rounded-l-none bg-background"
                  client={props.client}
                  disableAddress={true}
                  onChange={(token) => {
                    form.setValue("price_currency", token.address, {
                      shouldValidate: true,
                    });
                  }}
                  selectedToken={
                    form.watch("price_currency")
                      ? {
                          address: form.watch("price_currency"),
                          chainId: props.chainId,
                        }
                      : undefined
                  }
                  showCheck={true}
                />
                {form.formState.errors.price_currency?.message && (
                  <p className="text-destructive-text text-sm">
                    {form.formState.errors.price_currency?.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Supply */}
          <FormFieldSetup
            errorMessage={form.formState.errors.supply?.message}
            htmlFor="supply"
            isRequired
            label="Supply"
          >
            <DecimalInput
              className="bg-background"
              id={supplyId}
              onChange={(value) => {
                form.setValue("supply", value, {
                  shouldValidate: true,
                });
              }}
              placeholder="Custom"
              value={form.watch("supply")}
            />
          </FormFieldSetup>
        </div>

        {/* Advanced Settings */}
        <div className="border-t border-dashed px-4 py-6 md:px-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="background_color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    Background Color{" "}
                    <Badge
                      className="px-2 py-0.5 text-muted-foreground"
                      variant="outline"
                    >
                      {" "}
                      OpenSea{" "}
                    </Badge>
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input maxLength={7} {...field} placeholder="#123456" />
                      <div
                        className="-translate-y-1/2 absolute top-1/2 right-4 size-5 rounded-full"
                        style={{
                          backgroundColor: field.value,
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormDescription>
                    Must be a six-character hexadecimal with a pre-pended #.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!(external_url instanceof File) && (
              <FormField
                control={form.control}
                name="external_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      External URL{" "}
                      <Badge
                        className="px-2 py-0.5 text-muted-foreground"
                        variant="outline"
                      >
                        {" "}
                        OpenSea{" "}
                      </Badge>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://" type="url" />
                    </FormControl>
                    <FormDescription>
                      This is the URL that will appear below the asset's image
                      on OpenSea and will allow users to leave OpenSea and view
                      the item on your site.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>
        </div>

        <div className="border-t border-dashed px-4 py-6 md:px-6">
          <div className="flex justify-end gap-3">
            <Button
              className="gap-2"
              onClick={handlePrev}
              type="button"
              variant="outline"
            >
              <ArrowLeftIcon className="size-4" />
              Back
            </Button>
            <Button className="gap-2" type="submit">
              Next
              <ArrowRightIcon className="size-4" />
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
