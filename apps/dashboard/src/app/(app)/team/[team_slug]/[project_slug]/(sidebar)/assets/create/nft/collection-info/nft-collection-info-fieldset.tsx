"use client";

import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { SingleNetworkSelector } from "@/components/blocks/NetworkSelectors";
import { ClientOnly } from "@/components/blocks/client-only";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileInput } from "components/shared/FileInput";
import type { UseFormReturn } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
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
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(props.onNext)}>
        <StepCard
          title="Collection Info"
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
                client={props.client}
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
                    placeholder="My NFT Collection"
                    {...form.register("name")}
                  />
                </FormFieldSetup>

                <FormFieldSetup
                  className="lg:max-w-[200px]"
                  label="Symbol"
                  isRequired={false}
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
                      props.onChainUpdated();
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
                  placeholder="Describe your NFT collection"
                  className="grow"
                  {...form.register("description")}
                />
              </FormFieldSetup>
            </div>
          </div>

          <SocialUrlsFieldset form={form} />
        </StepCard>
      </form>
    </Form>
  );
}
