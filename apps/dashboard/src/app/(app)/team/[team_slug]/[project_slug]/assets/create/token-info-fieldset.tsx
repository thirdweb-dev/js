"use client";

import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { Button } from "@/components/ui/button";
import {} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ClientOnly } from "components/ClientOnly/ClientOnly";
import { FileInput } from "components/shared/FileInput";
import { PlusIcon, Trash2Icon } from "lucide-react";
import { useFieldArray } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import { StepCard } from "./create-token-card";
import type { TokenInfoForm } from "./form";

export function TokenInfoFieldset(props: {
  client: ThirdwebClient;
  onNext: () => void;
  form: TokenInfoForm;
}) {
  const { form } = props;
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onNext)}>
        <StepCard
          page="info"
          title="Token Information"
          prevButton={undefined}
          nextButton={{
            type: "submit",
          }}
        >
          <div className="flex flex-col gap-6 px-4 py-6 md:grid md:grid-cols-[280px_1fr] md:px-6">
            {/* left */}
            <FormFieldSetup
              errorMessage={form.formState.errors.image?.message as string}
              label="Image"
              isRequired={false}
            >
              <FileInput
                accept={{ "image/*": [] }}
                value={form.watch("image")}
                setValue={(file) =>
                  form.setValue("image", file, {
                    shouldTouch: true,
                  })
                }
                className="rounded-lg border-border bg-background transition-all duration-200 hover:border-active-border hover:bg-background"
              />
            </FormFieldSetup>

            {/* right */}
            <div className="flex flex-col gap-6">
              {/* name + symbol */}
              <div className="flex flex-col gap-6 lg:flex-row lg:gap-4">
                <FormFieldSetup
                  className="grow"
                  label="Name"
                  isRequired
                  htmlFor="name"
                  errorMessage={form.formState.errors.name?.message}
                >
                  <Input
                    id="name"
                    placeholder="My Token"
                    {...form.register("name")}
                  />
                </FormFieldSetup>

                <FormFieldSetup
                  className="lg:max-w-[200px]"
                  label="Symbol"
                  isRequired
                  htmlFor="symbol"
                  errorMessage={form.formState.errors.symbol?.message}
                >
                  <Input
                    id="symbol"
                    placeholder="XYZ"
                    {...form.register("symbol")}
                  />
                </FormFieldSetup>
              </div>

              {/* chain */}
              <FormFieldSetup
                label="Chain"
                isRequired
                htmlFor="chain"
                errorMessage={form.formState.errors.chain?.message}
              >
                <ClientOnly ssr={null}>
                  <SingleNetworkSelector
                    className="bg-background"
                    client={props.client}
                    chainId={Number(form.watch("chain"))}
                    onChange={(chain) => {
                      form.setValue("chain", chain.toString());
                    }}
                    disableChainId
                  />
                </ClientOnly>
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
                  placeholder="Describe your token"
                  className="grow"
                  {...form.register("description")}
                />
              </FormFieldSetup>
            </div>
          </div>

          <SocialUrls form={form} />
        </StepCard>
      </form>
    </Form>
  );
}

function SocialUrls(props: {
  form: TokenInfoForm;
}) {
  const { form } = props;

  const { fields, append, remove } = useFieldArray({
    name: "socialUrls",
    control: form.control,
  });

  return (
    <div className="border-t border-dashed px-4 py-6 lg:px-6">
      <h2 className="mb-2 font-medium text-sm">Social URLs</h2>

      {fields.length > 0 && (
        <div className="mb-5 space-y-4">
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="flex gap-3 max-sm:mb-6 max-sm:border-b max-sm:border-dashed max-sm:pb-6"
            >
              <div className="flex flex-1 flex-col gap-3 lg:flex-row">
                <FormField
                  control={form.control}
                  name={`socialUrls.${index}.platform`}
                  render={({ field }) => (
                    <FormItem className="lg:max-w-[140px]">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Platform"
                          aria-label="Platform"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`socialUrls.${index}.url`}
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="https://..."
                          aria-label="Platform URL"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => remove(index)}
              >
                <Trash2Icon className="h-4 w-4" />
                <span className="sr-only">Remove</span>
              </Button>
            </div>
          ))}
        </div>
      )}

      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={() => append({ platform: "", url: "" })}
        className="gap-2"
      >
        <PlusIcon className="size-4" />
        Add Social URL
      </Button>
    </div>
  );
}
