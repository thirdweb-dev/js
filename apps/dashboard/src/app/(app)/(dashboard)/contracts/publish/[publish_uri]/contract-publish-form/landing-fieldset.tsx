import { compare, validate } from "compare-versions";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import type { ExtendedMetadata } from "thirdweb/utils";
import { FileInput } from "@/components/blocks/FileInput";
import { FormFieldSetup } from "@/components/blocks/FormFieldSetup";
import { MarkdownRenderer } from "@/components/blocks/markdown-renderer";
import { SolidityInput } from "@/components/solidity-inputs";
import { Input } from "@/components/ui/input";
import { TabButtons } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { UnderlineLink } from "@/components/ui/UnderlineLink";
import { ExternalLinksFieldset } from "./external-links-fieldset";
import { SelectOption } from "./select-option";

type LandingFieldsetProps = {
  latestVersion: string | undefined;
  placeholderVersion: string;
  client: ThirdwebClient;
};

export function LandingFieldset({
  latestVersion,
  placeholderVersion,
  client,
}: LandingFieldsetProps) {
  const form = useFormContext<ExtendedMetadata>();
  const logoUrl = form.watch("logo");

  const handleVersionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    form.setValue("version", value);

    const isValidSemver = validate(value);

    const isValidVersion =
      latestVersion && isValidSemver
        ? compare(latestVersion || "0.0.0", value || "0.0.0", "<")
        : isValidSemver;

    if (!isValidSemver) {
      form.setError("version", {
        message: "Version must be valid semver.",
        type: "pattern",
      });
    } else if (!isValidVersion) {
      form.setError("version", {
        message: "Version must be greater than latest version.",
        type: "manual",
      });
    } else {
      form.clearErrors("version");
    }
  };

  const [readmeTab, setReadmeTab] = useState<"write" | "preview">("write");
  const [changelogTab, setChangelogTab] = useState<"write" | "preview">(
    "write",
  );

  return (
    <fieldset className="space-y-12">
      {/* header */}
      <div>
        <h1 className="text-2xl font-semibold tracking-tight mb-1">
          {!latestVersion ? "Publish" : "Edit"} your contract
        </h1>
        <p className="text-muted-foreground text-sm">
          Publishing your contract makes it shareable, discoverable, and
          deployable in a single click.{" "}
          <UnderlineLink
            href="https://portal.thirdweb.com/contracts/publish/overview"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn more
          </UnderlineLink>
        </p>
      </div>

      {/* logo, name, description */}
      <div className="flex flex-col md:flex-row gap-6 w-full">
        <FormFieldSetup
          label="Image"
          errorMessage={form.formState.errors?.logo?.message as string}
          isRequired={false}
          className="w-auto"
        >
          <div className="w-[200px]">
            <FileInput
              accept={{ "image/*": [] }}
              className="rounded-lg border bg-card transition-all duration-200"
              client={client}
              helperText="Image"
              // @ts-expect-error - we upload the file later this is fine
              setValue={(file) => form.setValue("logo", file)}
              value={logoUrl}
            />
          </div>
        </FormFieldSetup>

        <div className="flex flex-col gap-4 w-full grow">
          <FormFieldSetup
            htmlFor="displayName"
            label="Contract Name"
            errorMessage={form.formState.errors?.displayName?.message}
            isRequired={true}
          >
            <Input
              id="displayName"
              onChange={(e) => form.setValue("displayName", e.target.value)}
              placeholder="Ex. MyContract"
              className="bg-card"
              value={form.watch("displayName")}
            />
          </FormFieldSetup>

          <FormFieldSetup
            htmlFor="description"
            label="Description"
            errorMessage={form.formState.errors?.description?.message}
            isRequired={false}
            className="grow flex flex-col"
          >
            <Textarea
              id="description"
              onChange={(e) => form.setValue("description", e.target.value)}
              placeholder="Briefly describe what your contract does."
              rows={2}
              className="bg-card grow"
              value={form.watch("description")}
            />
          </FormFieldSetup>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-1 tracking-tight">README</h2>
        <p className="text-muted-foreground text-sm mb-5">
          Describe what your contract does and how it should be used. Markdown
          formatting is supported.
        </p>

        <TabButtons
          tabs={[
            {
              name: "Write",
              onClick: () => setReadmeTab("write"),
              isActive: readmeTab === "write",
            },
            {
              name: "Preview",
              onClick: () => setReadmeTab("preview"),
              isActive: readmeTab === "preview",
            },
          ]}
        />

        <div className="mt-2">
          {readmeTab === "write" && (
            <Textarea
              {...form.register("readme")}
              placeholder="Describe how users can use this contract. Add links if relevant."
              rows={12}
              className="bg-card"
            />
          )}

          {readmeTab === "preview" && (
            <div className="p-4 rounded-lg border border-border bg-card">
              <MarkdownRenderer markdownText={form.watch("readme") || ""} />
            </div>
          )}
        </div>

        {form.formState.errors.readme && (
          <p className="text-red-500 text-sm mt-2">
            {form.formState.errors.readme.message}
          </p>
        )}
      </div>

      <ExternalLinksFieldset />

      <div>
        <h2 className="text-xl font-semibold mb-1">Version information</h2>
        <p className="text-muted-foreground text-sm mb-5">
          Set your contract version number, add release notes, and link to your
          contract&apos;s audit report.
        </p>

        <div className="space-y-6">
          <FormFieldSetup
            htmlFor="version"
            label={
              <div className="flex items-center justify-between w-full">
                <span>Version</span>
                {latestVersion && (
                  <span className="text-sm text-muted-foreground">
                    latest version: {latestVersion}
                  </span>
                )}
              </div>
            }
            errorMessage={form.formState.errors?.version?.message}
            isRequired={true}
          >
            <Input
              id="version"
              onChange={handleVersionChange}
              className="bg-card"
              placeholder={placeholderVersion}
              value={form.watch("version")}
            />
          </FormFieldSetup>

          {latestVersion && (
            <div>
              <h3 className="text-sm font-medium mb-2">Release notes</h3>
              {form.formState.errors?.changelog?.message && (
                <p className="text-red-500 text-sm mt-2">
                  {form.formState.errors.changelog.message}
                </p>
              )}
              <TabButtons
                tabs={[
                  {
                    name: "Write",
                    onClick: () => setChangelogTab("write"),
                    isActive: changelogTab === "write",
                  },
                  {
                    name: "Preview",
                    onClick: () => setChangelogTab("preview"),
                    isActive: changelogTab === "preview",
                  },
                ]}
              />

              <div className="mt-2">
                {changelogTab === "write" && (
                  <Textarea
                    {...form.register("changelog")}
                    placeholder="Mention what is new in this version of your contract."
                    className="bg-card"
                  />
                )}

                {changelogTab === "preview" && (
                  <div className="p-4 rounded-lg border bg-card">
                    <MarkdownRenderer
                      markdownText={form.watch("changelog") || ""}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          <FormFieldSetup
            label="Audit report"
            errorMessage={form.formState.errors?.audit?.message}
            isRequired={false}
            helperText="You can add a IPFS hash or URL pointing to an audit report, or add a file and we'll upload it to IPFS."
          >
            <SolidityInput
              client={client}
              solidityType="string"
              {...form.register("audit")}
              placeholder="ipfs://... or https://..."
              className="bg-card"
            />
          </FormFieldSetup>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-1">Deployment options</h2>
        <p className="text-muted-foreground text-sm mb-3">
          Choose how users will deploy your published contract.
        </p>
        <div className="flex flex-col md:flex-row gap-4 w-full">
          <SelectOption
            className="w-full"
            description="Users will directly deploy the full contract."
            isActive={form.watch("deployType") === "standard"}
            name="Direct deploy"
            onClick={() => form.setValue("deployType", "standard")}
          />
          <SelectOption
            className="w-full"
            description="Users will deploy your contract through a default or custom factory contract."
            isActive={
              form.watch("deployType") === "autoFactory" ||
              form.watch("deployType") === "customFactory"
            }
            name="Deploy via factory"
            onClick={() => form.setValue("deployType", "autoFactory")}
          />
        </div>
      </div>
    </fieldset>
  );
}
