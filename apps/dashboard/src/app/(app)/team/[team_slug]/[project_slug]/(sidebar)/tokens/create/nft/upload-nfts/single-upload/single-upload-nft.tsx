"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import { FileInput } from "components/shared/FileInput";
import { ArrowLeftIcon, ArrowRightIcon, AsteriskIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
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
    resolver: zodResolver(nftWithPriceSchema),
    values: props.nftData || undefined,
    defaultValues: {
      image: undefined,
      name: "",
      description: "",
      attributes: [{ trait_type: "", value: "" }],
    },
    reValidateMode: "onChange",
  });

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
              label="Media"
              isRequired={false}
            >
              <p className="mb-2 text-muted-foreground text-sm">
                You can upload image, audio, video, html, text, pdf, or 3d model
                file
              </p>
              <FileInput
                value={media}
                showPreview={true}
                setValue={setFile}
                className="rounded-lg bg-background"
                selectOrUpload="Upload"
                client={props.client}
                helperText="Media"
              />
            </FormFieldSetup>

            {showCoverImageUpload && (
              <FormFieldSetup
                errorMessage={form.formState.errors?.image?.message}
                htmlFor="cover-image"
                label="Cover Image"
                isRequired={false}
              >
                <p className="mb-2 text-muted-foreground text-sm">
                  You can optionally upload an image as the cover of your NFT
                </p>
                <FileInput
                  client={props.client}
                  accept={{ "image/*": [] }}
                  helperText="Cover Image"
                  value={image}
                  setValue={(file) => {
                    form.setValue("image", file);
                  }}
                  className="rounded-lg bg-background"
                />
              </FormFieldSetup>
            )}
          </div>

          {/* right */}
          <div className="flex flex-col gap-6">
            {/* name  */}
            <FormFieldSetup
              label="Name"
              isRequired
              htmlFor="name"
              errorMessage={form.formState.errors.name?.message}
            >
              <Input
                id="name"
                placeholder="My NFT"
                {...form.register("name")}
              />
            </FormFieldSetup>

            <FormFieldSetup
              label="Description"
              isRequired={false}
              htmlFor="description"
              className="flex grow flex-col"
              errorMessage={form.formState.errors.description?.message}
            >
              <Textarea
                id="description"
                placeholder="Describe your NFT"
                className="grow"
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
                  id="price_amount"
                  value={form.watch("price_amount")}
                  placeholder="0.00"
                  className="w-40 rounded-r-none border-r-0 bg-background"
                  onChange={(value) => {
                    form.setValue("price_amount", value, {
                      shouldValidate: true,
                    });
                  }}
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
                  className="rounded-l-none bg-background"
                  addNativeTokenIfMissing={true}
                  showCheck={true}
                  disableAddress={true}
                  selectedToken={
                    form.watch("price_currency")
                      ? {
                          address: form.watch("price_currency"),
                          chainId: props.chainId,
                        }
                      : undefined
                  }
                  onChange={(token) => {
                    form.setValue("price_currency", token.address, {
                      shouldValidate: true,
                    });
                  }}
                  client={props.client}
                  chainId={props.chainId}
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
            label="Supply"
            isRequired
            htmlFor="supply"
            errorMessage={form.formState.errors.supply?.message}
          >
            <DecimalInput
              id="supply"
              placeholder="Custom"
              value={form.watch("supply")}
              className="bg-background"
              onChange={(value) => {
                form.setValue("supply", value, {
                  shouldValidate: true,
                });
              }}
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
              type="button"
              variant="outline"
              onClick={handlePrev}
              className="gap-2"
            >
              <ArrowLeftIcon className="size-4" />
              Back
            </Button>
            <Button type="submit" className="gap-2">
              Next
              <ArrowRightIcon className="size-4" />
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
