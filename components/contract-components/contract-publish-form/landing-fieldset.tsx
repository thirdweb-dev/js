import { MarkdownRenderer } from "../published-contract/markdown-renderer";
import {
  Box,
  Flex,
  FormControl,
  Image,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
} from "@chakra-ui/react";
import { ExtraPublishMetadata } from "@thirdweb-dev/sdk";
import { compare, validate } from "compare-versions";
import { FileInput } from "components/shared/FileInput";
import { SolidityInput } from "contract-ui/components/solidity-inputs";
import { SelectOption } from "core-ui/batch-upload/lazy-mint-form/select-option";
import { useImageFileOrUrl } from "hooks/useImageFileOrUrl";
import { replaceIpfsUrl } from "lib/sdk";
import { useFormContext } from "react-hook-form";
import {
  Card,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Link,
  Text,
} from "tw-components";

interface LandingFieldsetProps {
  latestVersion: string | undefined;
  placeholderVersion: string;
}

export const LandingFieldset: React.FC<LandingFieldsetProps> = ({
  latestVersion,
  placeholderVersion,
}) => {
  const form = useFormContext<ExtraPublishMetadata>();
  const logoUrl = useImageFileOrUrl(form.watch("logo"));

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
        type: "pattern",
        message: "Version must be valid semver.",
      });
    } else if (!isValidVersion) {
      form.setError("version", {
        type: "manual",
        message: "Version must be greater than latest version.",
      });
    } else {
      form.clearErrors("version");
    }
  };

  return (
    <Flex gap={16} direction="column" as="fieldset" mt={{ base: 4, md: 12 }}>
      <Flex gap={2} direction="column">
        <Heading size="title.lg">
          {!latestVersion ? "Publish" : "Edit"} your contract
        </Heading>
        <Text fontStyle="normal">
          Publishing your contract makes it shareable, discoverable, and
          deployable in a single click.{" "}
          <Link
            color="blue.500"
            isExternal
            href="https://portal.thirdweb.com/contracts/publish/overview"
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
              value={logoUrl}
              setValue={(file) => form.setValue("logo", file)}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="md"
              transition="all 200ms ease"
              _hover={{ shadow: "sm" }}
              renderPreview={(fileUrl) => (
                <Image
                  alt=""
                  w="100%"
                  h="100%"
                  src={replaceIpfsUrl(fileUrl)}
                  borderRadius="full"
                />
              )}
              helperText="Image"
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
              placeholder="Ex. MyContract"
              value={form.watch("displayName")}
              onChange={(e) => form.setValue("displayName", e.target.value)}
            />
            <FormErrorMessage>
              {form.formState.errors?.displayName?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!form.formState.errors.description}>
            <FormLabel>Description</FormLabel>
            <Textarea
              rows={2}
              placeholder="Briefly describe what your contract does."
              value={form.watch("description")}
              onChange={(e) => form.setValue("description", e.target.value)}
            />

            <FormErrorMessage>
              {form.formState.errors?.description?.message}
            </FormErrorMessage>
          </FormControl>
        </Flex>
      </Flex>

      <Box>
        <Heading size="title.md" mb={2}>
          README
        </Heading>
        <Text size="body.md" mb={4}>
          Describe what your contract does and how it should be used. Markdown
          formatting is supported.
        </Text>
        <FormControl isInvalid={!!form.formState.errors.readme}>
          <Tabs isLazy lazyBehavior="keepMounted" colorScheme="gray">
            <TabList
              px={0}
              borderBottomColor="borderColor"
              borderBottomWidth="1px"
            >
              <Tab gap={2}>
                <Heading size="label.lg">Write</Heading>
              </Tab>
              <Tab gap={2}>
                <Heading size="label.lg">Preview</Heading>
              </Tab>
            </TabList>
            <TabPanels pt={2}>
              <TabPanel px={0} pb={0}>
                <Textarea
                  {...form.register("readme")}
                  rows={12}
                  placeholder="Describe how users can use this contract. Add links if relevant."
                />
                <FormErrorMessage>
                  {form.formState.errors?.readme?.message}
                </FormErrorMessage>
              </TabPanel>
              <TabPanel px={0} pb={0}>
                <Card>
                  <MarkdownRenderer markdownText={form.watch("readme") || ""} />
                </Card>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </FormControl>
      </Box>
      <Box>
        <Heading size="title.md" mb={2}>
          Version information
        </Heading>
        <Text size="body.md" mb={4}>
          Set your contract version number, add release notes, and link to your
          contract&apos;s audit report.
        </Text>
        <Flex flexDir="column" gap={6}>
          <FormControl isRequired isInvalid={!!form.formState.errors.version}>
            <Flex alignItems="center" mb={1}>
              <FormLabel flex="1" mb={0}>
                Version
              </FormLabel>
              {latestVersion && (
                <Text size="body.md">latest version: {latestVersion}</Text>
              )}
            </Flex>
            <Input
              placeholder={placeholderVersion}
              value={form.watch("version")}
              onChange={handleVersionChange}
            />
            <FormErrorMessage>
              {form.formState.errors?.version?.message}
            </FormErrorMessage>
          </FormControl>
          {latestVersion && (
            <FormControl isInvalid={!!form.formState.errors.changelog}>
              <FormLabel>Release notes</FormLabel>
              <Tabs isLazy lazyBehavior="keepMounted" colorScheme="gray">
                <TabList
                  px={0}
                  borderBottomColor="borderColor"
                  borderBottomWidth="1px"
                >
                  <Tab gap={2}>
                    <Heading size="label.lg">Write</Heading>
                  </Tab>
                  <Tab gap={2}>
                    <Heading size="label.lg">Preview</Heading>
                  </Tab>
                </TabList>
                <TabPanels pt={2}>
                  <TabPanel px={0} pb={0}>
                    <Textarea
                      {...form.register("changelog")}
                      placeholder="Mention what is new in this version of your contract."
                    />
                    <FormErrorMessage>
                      {form.formState.errors?.changelog?.message}
                    </FormErrorMessage>
                  </TabPanel>
                  <TabPanel px={0} pb={0}>
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
      </Box>
      <Box>
        <Heading size="title.md" mb={2}>
          Deployment options
        </Heading>
        <Text size="body.md" mb={4}>
          Choose how users will deploy your published contract.
        </Text>
        <Flex flexDir="column" gap={2} width="full">
          <SelectOption
            name="Direct deploy"
            description="Users will directly deploy the full contract."
            onClick={() => form.setValue("deployType", "standard")}
            isActive={form.watch("deployType") === "standard"}
            width="full"
          />
          <SelectOption
            name="Deploy via factory"
            description="Users will deploy your contract through a default or custom factory contract."
            onClick={() => form.setValue("deployType", "autoFactory")}
            isActive={
              form.watch("deployType") === "autoFactory" ||
              form.watch("deployType") === "customFactory"
            }
            width="full"
          />
        </Flex>
      </Box>
    </Flex>
  );
};
