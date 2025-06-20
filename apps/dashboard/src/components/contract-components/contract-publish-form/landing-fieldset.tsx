import {
  Box,
  Flex,
  FormControl,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
} from "@chakra-ui/react";
import { compare, validate } from "compare-versions";
import { FileInput } from "components/shared/FileInput";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { SelectOption } from "core-ui/batch-upload/lazy-mint-form/select-option";
import { useFormContext } from "react-hook-form";
import type { ThirdwebClient } from "thirdweb";
import type { ExtendedMetadata } from "thirdweb/utils";
import {
  Card,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Link,
  Text,
} from "tw-components";
import { MarkdownRenderer } from "../published-contract/markdown-renderer";
import { ExternalLinksFieldset } from "./external-links-fieldset";

interface LandingFieldsetProps {
  latestVersion: string | undefined;
  placeholderVersion: string;
  client: ThirdwebClient;
}

export const LandingFieldset: React.FC<LandingFieldsetProps> = ({
  latestVersion,
  placeholderVersion,
  client,
}) => {
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

  return (
    <Flex as="fieldset" direction="column" gap={16} mt={{ base: 4, md: 12 }}>
      <Flex direction="column" gap={2}>
        <Heading size="title.lg">
          {!latestVersion ? "Publish" : "Edit"} your contract
        </Heading>
        <Text fontStyle="normal">
          Publishing your contract makes it shareable, discoverable, and
          deployable in a single click.{" "}
          <Link
            color="blue.500"
            href="https://portal.thirdweb.com/contracts/publish/overview"
            isExternal
          >
            Learn more
          </Link>
        </Text>
      </Flex>
      <Flex gap={6} w="full">
        <FormControl isInvalid={!!form.formState.errors.logo} w="auto">
          <FormLabel>Image</FormLabel>
          <Box width="141px">
            <FileInput
              accept={{ "image/*": [] }}
              className="rounded border border-border transition-all duration-200"
              client={client}
              helperText="Image"
              // @ts-expect-error - we upload the file later this is fine
              setValue={(file) => form.setValue("logo", file)}
              value={logoUrl}
            />
          </Box>
          <FormErrorMessage>
            {form.formState.errors?.logo?.message as unknown as string}
          </FormErrorMessage>
        </FormControl>
        <Flex flexDir="column" gap={4} w="full">
          <FormControl
            isInvalid={!!form.formState.errors.displayName}
            isRequired
          >
            <FormLabel>Contract Name</FormLabel>
            <Input
              onChange={(e) => form.setValue("displayName", e.target.value)}
              placeholder="Ex. MyContract"
              value={form.watch("displayName")}
            />
            <FormErrorMessage>
              {form.formState.errors?.displayName?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!form.formState.errors.description}>
            <FormLabel>Description</FormLabel>
            <Textarea
              onChange={(e) => form.setValue("description", e.target.value)}
              placeholder="Briefly describe what your contract does."
              rows={2}
              value={form.watch("description")}
            />

            <FormErrorMessage>
              {form.formState.errors?.description?.message}
            </FormErrorMessage>
          </FormControl>
        </Flex>
      </Flex>

      <div>
        <Heading mb={2} size="title.md">
          README
        </Heading>
        <Text mb={4} size="body.md">
          Describe what your contract does and how it should be used. Markdown
          formatting is supported.
        </Text>
        <FormControl isInvalid={!!form.formState.errors.readme}>
          <Tabs colorScheme="gray" isLazy lazyBehavior="keepMounted">
            <TabList
              borderBottomColor="borderColor"
              borderBottomWidth="1px"
              px={0}
            >
              <Tab gap={2}>
                <Heading size="label.lg">Write</Heading>
              </Tab>
              <Tab gap={2}>
                <Heading size="label.lg">Preview</Heading>
              </Tab>
            </TabList>
            <TabPanels pt={2}>
              <TabPanel pb={0} px={0}>
                <Textarea
                  {...form.register("readme")}
                  placeholder="Describe how users can use this contract. Add links if relevant."
                  rows={12}
                />
                <FormErrorMessage>
                  {form.formState.errors?.readme?.message}
                </FormErrorMessage>
              </TabPanel>
              <TabPanel pb={0} px={0}>
                <Card>
                  <MarkdownRenderer markdownText={form.watch("readme") || ""} />
                </Card>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </FormControl>
      </div>
      <ExternalLinksFieldset />
      <div>
        <Heading mb={2} size="title.md">
          Version information
        </Heading>
        <Text mb={4} size="body.md">
          Set your contract version number, add release notes, and link to your
          contract&apos;s audit report.
        </Text>
        <Flex flexDir="column" gap={6}>
          <FormControl isInvalid={!!form.formState.errors.version} isRequired>
            <Flex alignItems="center" mb={1}>
              <FormLabel flex="1" mb={0}>
                Version
              </FormLabel>
              {latestVersion && (
                <Text size="body.md">latest version: {latestVersion}</Text>
              )}
            </Flex>
            <Input
              onChange={handleVersionChange}
              placeholder={placeholderVersion}
              value={form.watch("version")}
            />
            <FormErrorMessage>
              {form.formState.errors?.version?.message}
            </FormErrorMessage>
          </FormControl>
          {latestVersion && (
            <FormControl isInvalid={!!form.formState.errors.changelog}>
              <FormLabel>Release notes</FormLabel>
              <Tabs colorScheme="gray" isLazy lazyBehavior="keepMounted">
                <TabList
                  borderBottomColor="borderColor"
                  borderBottomWidth="1px"
                  px={0}
                >
                  <Tab gap={2}>
                    <Heading size="label.lg">Write</Heading>
                  </Tab>
                  <Tab gap={2}>
                    <Heading size="label.lg">Preview</Heading>
                  </Tab>
                </TabList>
                <TabPanels pt={2}>
                  <TabPanel pb={0} px={0}>
                    <Textarea
                      {...form.register("changelog")}
                      placeholder="Mention what is new in this version of your contract."
                    />
                    <FormErrorMessage>
                      {form.formState.errors?.changelog?.message}
                    </FormErrorMessage>
                  </TabPanel>
                  <TabPanel pb={0} px={0}>
                    <Card>
                      <MarkdownRenderer
                        markdownText={form.watch("changelog") || ""}
                      />
                    </Card>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </FormControl>
          )}
          <FormControl isInvalid={!!form.formState.errors.audit}>
            <FormLabel>Audit report</FormLabel>
            <SolidityInput
              client={client}
              solidityType="string"
              {...form.register("audit")}
              placeholder="ipfs://... or https://..."
            />
            <FormHelperText>
              <Text size="body.sm">
                You can add a IPFS hash or URL pointing to an audit report, or
                add a file and we&apos;ll upload it to IPFS.
              </Text>
            </FormHelperText>
          </FormControl>
        </Flex>
      </div>
      <div>
        <Heading mb={2} size="title.md">
          Deployment options
        </Heading>
        <Text mb={4} size="body.md">
          Choose how users will deploy your published contract.
        </Text>
        <Flex flexDir="column" gap={2} width="full">
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
        </Flex>
      </div>
    </Flex>
  );
};
