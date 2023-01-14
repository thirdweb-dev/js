import { MarkdownRenderer } from "../released-contract/markdown-renderer";
import {
  Box,
  Flex,
  FormControl,
  Icon,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
  Tooltip,
} from "@chakra-ui/react";
import { ExtraPublishMetadata } from "@thirdweb-dev/sdk";
import { FileInput } from "components/shared/FileInput";
import { SelectOption } from "core-ui/batch-upload/lazy-mint-form/select-option";
import { useImageFileOrUrl } from "hooks/useImageFileOrUrl";
import { replaceIpfsUrl } from "lib/sdk";
import { Dispatch, SetStateAction } from "react";
import { useFormContext } from "react-hook-form";
import { BsCode, BsEye } from "react-icons/bs";
import { FiTrash, FiUpload } from "react-icons/fi";
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
  contractSelection: "standard" | "proxy" | "factory";
  setContractSelection: Dispatch<
    SetStateAction<"standard" | "proxy" | "factory">
  >;
  latestVersion: string | undefined;
  placeholderVersion: string;
  isValidVersion: boolean;
  isValidSemver: boolean;
}

export const LandingFieldset: React.FC<LandingFieldsetProps> = ({
  contractSelection,
  setContractSelection,
  latestVersion,
  placeholderVersion,
  isValidSemver,
  isValidVersion,
}) => {
  const form = useFormContext<ExtraPublishMetadata>();
  const logoUrl = useImageFileOrUrl(form.watch("logo"));

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
            href="https://portal.thirdweb.com/release"
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
              {...form.register("displayName", { required: true })}
              placeholder="Ex. MyContract"
            />
            <FormErrorMessage>
              {form.formState.errors?.displayName?.message}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!form.formState.errors.description}>
            <FormLabel>Description</FormLabel>
            <Textarea
              {...form.register("description")}
              rows={2}
              placeholder="Briefly describe what your contract does."
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
          <Tabs isLazy lazyBehavior="keepMounted" colorScheme="purple">
            <TabList
              px={0}
              borderBottomColor="borderColor"
              borderBottomWidth="1px"
            >
              <Tab gap={2}>
                <Icon as={BsCode} my={2} />
                <Heading size="label.lg">Write</Heading>
              </Tab>
              <Tab gap={2}>
                <Icon as={BsEye} my={2} />
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
                <Text size="body.md">latest release: {latestVersion}</Text>
              )}
            </Flex>
            <Input
              {...form.register("version", { required: true })}
              placeholder={placeholderVersion}
            />
            {form.watch("version") && (
              <Text color="red.300" mt={1}>
                {!isValidSemver
                  ? "Not a valid semver version."
                  : !isValidVersion
                  ? "Version must be greater than previous version."
                  : ""}
              </Text>
            )}
            <FormErrorMessage>
              {form.formState.errors?.version?.message}
            </FormErrorMessage>
          </FormControl>
          {latestVersion && (
            <FormControl isInvalid={!!form.formState.errors.changelog}>
              <FormLabel>Release notes</FormLabel>
              <Tabs isLazy lazyBehavior="keepMounted" colorScheme="purple">
                <TabList
                  px={0}
                  borderBottomColor="borderColor"
                  borderBottomWidth="1px"
                >
                  <Tab gap={2}>
                    <Icon as={BsCode} my={2} />
                    <Heading size="label.lg">Write</Heading>
                  </Tab>
                  <Tab gap={2}>
                    <Icon as={BsEye} my={2} />
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
            {form.watch("audit") instanceof File ? (
              <InputGroup>
                <Input
                  isDisabled
                  value={form.watch("audit")?.name}
                  placeholder="ipfs://..."
                />
                <InputRightElement>
                  <Icon
                    as={FiTrash}
                    cursor="pointer"
                    color="red.300"
                    _hover={{ color: "red.200" }}
                    onClick={() => form.setValue("audit", "")}
                  />
                </InputRightElement>
              </InputGroup>
            ) : (
              <InputGroup>
                <Input {...form.register("audit")} placeholder="ipfs://..." />
                <InputRightElement>
                  <Tooltip label="Upload file" shouldWrapChildren>
                    <FileInput
                      setValue={(file) => {
                        form.setValue("audit", file);
                      }}
                    >
                      <Icon
                        as={FiUpload}
                        color="gray.600"
                        _hover={{ color: "gray.500" }}
                      />
                    </FileInput>
                  </Tooltip>
                </InputRightElement>
              </InputGroup>
            )}
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
          Choose your contract type
        </Heading>
        <Text size="body.md" mb={4}>
          Not sure which contract type to choose?{" "}
          <Link href="https://portal.thirdweb.com/release" color="primary.600">
            Learn more
          </Link>
          .
        </Text>
        <Flex flexDir="column" gap={2} width="full">
          <SelectOption
            name="Standard contract"
            onClick={() => setContractSelection("standard")}
            isActive={contractSelection === "standard"}
            infoText="Use this if your contract does not follow the factory contract or proxy contract pattern."
            width="full"
          />
          <SelectOption
            name="Proxy contract"
            onClick={() => setContractSelection("proxy")}
            isActive={contractSelection === "proxy"}
            infoText="Use this if your contract follows the proxy contract pattern. This makes it cheaper for users to deploy your contract."
            width="full"
          />
          <SelectOption
            name="Factory contract"
            onClick={() => setContractSelection("factory")}
            isActive={contractSelection === "factory"}
            infoText="Use this if your contract follows the factory contract pattern. This lets you call an initializer function when users deploy your contract."
            width="full"
          />
        </Flex>
      </Box>
    </Flex>
  );
};
