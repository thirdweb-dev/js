import {
  ButtonGroup,
  FormControl,
  HStack,
  Input,
  ListItem,
  Textarea,
  UnorderedList,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import {
  Button,
  Card,
  Checkbox,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Text,
} from "tw-components";
import { FieldAlert } from "../Alerts";
import { ApiKeyValidationSchema } from "../validations";

interface EditGeneralProps {
  form: UseFormReturn<ApiKeyValidationSchema, any>;
}

export const EditGeneral: React.FC<EditGeneralProps> = ({ form }) => {
  const bg = useColorModeValue("backgroundCardHighlight", "transparent");
  const [domainsFieldActive, setDomainsFieldActive] = useState(true);

  return (
    <Card p={{ base: 4, md: 6 }} w="full" bg={bg}>
      <Flex flexDir="column" gap={8}>
        <FormControl
          isRequired
          isInvalid={!!form.getFieldState("name", form.formState).error}
        >
          <FormLabel>Key name</FormLabel>
          <Input
            autoFocus
            placeholder="Descriptive name"
            type="text"
            {...form.register("name")}
          />
          <FormErrorMessage>
            {form.getFieldState("name", form.formState).error?.message}
          </FormErrorMessage>
        </FormControl>

        <Flex flexDir="column" gap={2}>
          <FormLabel>Access Restrictions</FormLabel>

          <ButtonGroup
            size="sm"
            variant="ghost"
            spacing={{ base: 0.5, md: 2 }}
            w="full"
          >
            <Button
              type="button"
              isActive={domainsFieldActive}
              _active={{
                bg: "bgBlack",
                color: "bgWhite",
              }}
              rounded="lg"
              variant="outline"
              onClick={() => setDomainsFieldActive(true)}
            >
              Domains (Web apps)
            </Button>
            <Button
              type="button"
              isActive={!domainsFieldActive}
              _active={{
                bg: "bgBlack",
                color: "bgWhite",
              }}
              rounded="lg"
              variant="outline"
              onClick={() => setDomainsFieldActive(false)}
            >
              Bundle IDs (iOS, Android, Games)
            </Button>
          </ButtonGroup>

          {domainsFieldActive && (
            <Flex flexDir="column" gap={4}>
              <FormControl
                isInvalid={
                  !!form.getFieldState("domains", form.formState).error
                }
              >
                <FormHelperText pb={4} size="body.md">
                  <Text fontWeight="medium">
                    Prevent third-parties from using your Client ID by
                    restricting access to allowed domains.
                  </Text>

                  <UnorderedList pt={2} spacing={1}>
                    <Text as={ListItem}>
                      Use <code>*</code> to authorize all subdomains. eg:
                      *.thirdweb.com accepts all sites ending in .thirdweb.com.
                    </Text>
                    <Text as={ListItem}>
                      Enter <code>localhost:&lt;port&gt;</code> to authorize
                      local URLs.
                    </Text>
                  </UnorderedList>
                </FormHelperText>

                <HStack
                  alignItems="center"
                  justifyContent="space-between"
                  pb={2}
                >
                  <FormLabel size="label.sm" mb={0}>
                    Allowed Domains
                  </FormLabel>
                  <Checkbox
                    isChecked={form.watch("domains") === "*"}
                    onChange={(e) => {
                      form.setValue("domains", e.target.checked ? "*" : "");
                    }}
                  >
                    <Text>Unrestricted access</Text>
                  </Checkbox>
                </HStack>

                <Textarea
                  placeholder="thirdweb.com, rpc.example.com, localhost:3000"
                  {...form.register("domains")}
                />
                {!form.getFieldState("domains", form.formState).error ? (
                  <FormHelperText>
                    Enter domains separated by commas or new lines.
                  </FormHelperText>
                ) : (
                  <FormErrorMessage>
                    {
                      form.getFieldState("domains", form.formState).error
                        ?.message
                    }
                  </FormErrorMessage>
                )}
              </FormControl>

              {!form.watch("domains") && <FieldAlert message="NoDomains" />}
              {form.watch("domains") === "*" && (
                <FieldAlert message="AnyDomain" />
              )}
            </Flex>
          )}

          {!domainsFieldActive && (
            <Flex flexDir="column" gap={4}>
              <FormControl
                isInvalid={
                  !!form.getFieldState("bundleIds", form.formState).error
                }
              >
                <FormHelperText pb={4} size="body.md">
                  <Text fontWeight="medium">
                    Prevent third-parties from using your Client ID by
                    restricting access to allowed Bundle IDs. This is applicable
                    only if you want to use your key with native games or native
                    mobile applications.
                  </Text>
                </FormHelperText>

                <HStack
                  alignItems="center"
                  justifyContent="space-between"
                  pb={2}
                >
                  <FormLabel size="label.sm" mb={0}>
                    Allowed Bundle IDs
                  </FormLabel>
                  <Checkbox
                    isChecked={form.watch("bundleIds") === "*"}
                    onChange={(e) => {
                      form.setValue("bundleIds", e.target.checked ? "*" : "");
                    }}
                  >
                    <Text>Unrestricted access</Text>
                  </Checkbox>
                </HStack>

                <Textarea
                  placeholder="com.thirdweb.app"
                  {...form.register("bundleIds")}
                />

                {!form.getFieldState("bundleIds", form.formState).error ? (
                  <FormHelperText>
                    Enter bundle ids separated by commas or new lines.
                  </FormHelperText>
                ) : (
                  <FormErrorMessage>
                    {
                      form.getFieldState("bundleIds", form.formState).error
                        ?.message
                    }
                  </FormErrorMessage>
                )}
              </FormControl>

              {!form.watch("bundleIds") && <FieldAlert message="NoBundleIds" />}
              {form.watch("bundleIds") === "*" && (
                <FieldAlert message="AnyBundleId" />
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
    </Card>
  );
};
