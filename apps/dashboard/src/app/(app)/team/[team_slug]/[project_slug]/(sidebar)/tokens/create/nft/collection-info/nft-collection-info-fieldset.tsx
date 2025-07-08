"use client";

import { useId } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import { ClientOnly } from "@/components/blocks/client-only";
import { FileInput } from "@/components/blocks/FileInput";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdminAddressesFieldset } from "../../_common/admin-addresses-fieldset";
import { SocialUrlsFieldset } from "../../_common/SocialUrls";
import { StepCard } from "../../_common/step-card";
import type { NFTCollectionInfoFormValues } from "../_common/form";

export function NFTCollectionInfoFieldset(props: {
  client: ThirdwebClient;
  onNext: () => void;
  form: UseFormReturn<NFTCollectionInfoFormValues>;
  onChainUpdated: () => void;
}) {
  const { form } = props;
  const nameId = useId();
  const symbolId = useId();
  const descriptionId = useId();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onNext)}>
        <StepCard
          nextButton={{
            type: "submit",
          }}
          prevButton={undefined}
          title="Collection Info"
        >
          <div className="flex flex-col gap-6 px-4 py-6 md:grid md:grid-cols-[280px_1fr] md:px-6">
            {/* left */}
            <FormFieldSetup
              errorMessage={form.formState.errors.image?.message as string}
              isRequired={false}
              label="Image"
            >
              <FileInput
                accept={{ "image/*": [] }}
                className="rounded-lg border-border bg-background transition-all duration-200 hover:border-active-border hover:bg-background"
                client={props.client}
                setValue={(file) =>
                  form.setValue("image", file, {
                    shouldTouch: true,
                  })
                }
                value={form.watch("image")}
              />
            </FormFieldSetup>

            {/* right */}
            <div className="flex flex-col gap-6">
              {/* name + symbol */}
              <div className="flex flex-col gap-6 lg:flex-row lg:gap-4">
                <FormFieldSetup
                  className="grow"
                  errorMessage={form.formState.errors.name?.message}
                  htmlFor={nameId}
                  isRequired
                  label="Name"
                >
                  <Input
                    id={nameId}
                    placeholder="My NFT Collection"
                    {...form.register("name")}
                  />
                </FormFieldSetup>

                <FormFieldSetup
                  className="lg:max-w-[200px]"
                  errorMessage={form.formState.errors.symbol?.message}
                  htmlFor={symbolId}
                  isRequired={false}
                  label="Symbol"
                >
                  <Input
                    id={symbolId}
                    placeholder="XYZ"
                    {...form.register("symbol")}
                  />
                </FormFieldSetup>
              </div>

              {/* chain */}
              <FormFieldSetup
                errorMessage={form.formState.errors.chain?.message}
                isRequired
                label="Chain"
              >
                <ClientOnly ssr={null}>
                  <SingleNetworkSelector
                    chainId={Number(form.watch("chain"))}
                    className="bg-background"
                    client={props.client}
                    disableChainId
                    onChange={(chain) => {
                      form.setValue("chain", chain.toString());
                      props.onChainUpdated();
                    }}
                  />
                </ClientOnly>
              </FormFieldSetup>

              <FormFieldSetup
                className="flex grow flex-col"
                errorMessage={form.formState.errors.description?.message}
                htmlFor={descriptionId}
                isRequired={false}
                label="Description"
              >
                <Textarea
                  className="grow"
                  id={descriptionId}
                  placeholder="Describe your NFT collection"
                  {...form.register("description")}
                />
              </FormFieldSetup>
            </div>
          </div>

          <SocialUrlsFieldset form={form} />

          <AdminAddressesFieldset form={form} />
        </StepCard>
      </form>
    </Form>
  );
}
