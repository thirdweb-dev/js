import { ApiKeyCreateValidationSchema } from "../validations";
import {
  FormControl,
  Input,
  Flex,
  ListItem,
  UnorderedList,
  Textarea,
  HStack,
} from "@chakra-ui/react";
import { UseFormReturn } from "react-hook-form";
import {
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Text,
  Checkbox,
} from "tw-components";

interface CreateGeneralProps {
  form: UseFormReturn<ApiKeyCreateValidationSchema, any>;
}

export const CreateGeneral: React.FC<CreateGeneralProps> = ({ form }) => {
  return (
    <Flex flexDir="column" gap={6}>
      <FormControl
        isRequired
        isInvalid={!!form.getFieldState("name", form.formState).error}
      >
        <FormLabel>Key name</FormLabel>
        <Input
          autoFocus
          placeholder="API Key name"
          type="text"
          {...form.register("name")}
        />
        <FormErrorMessage>
          {form.getFieldState("name", form.formState).error?.message}
        </FormErrorMessage>
      </FormControl>

      <Flex flexDir="column" gap={4}>
        <FormControl
          isInvalid={!!form.getFieldState("domains", form.formState).error}
        >
          <FormHelperText m={0} pb={6} size="body.md">
            Prevent third-parties from using your Client ID by restricting
            access to allowed domains.{" "}
            <Text size="label.md" as="span">
              Highly recommended
            </Text>{" "}
            for frontend applications.
          </FormHelperText>

          <HStack alignItems="center" justifyContent="space-between" pb={2}>
            <FormLabel size="label.sm" mb={0}>
              Allowed Domains
            </FormLabel>
            <Checkbox
              isChecked={form.watch("domains") === "*"}
              onChange={(e) => {
                form.setValue("domains", e.target.checked ? "*" : "");
              }}
            >
              <Text>Allow all domains</Text>
            </Checkbox>
          </HStack>

          <Textarea
            placeholder="thirdweb.com, rpc.example.com, localhost:3000"
            {...form.register("domains")}
          />
          {!form.getFieldState("domains", form.formState).error ? (
            <FormHelperText>
              <UnorderedList pt={2} spacing={1}>
                <Text as={ListItem}>
                  Authorize all domains with <code>*</code>
                  <br />
                  <Text as="span" pl={2}>
                    f.ex: <code>*.thirdweb.com</code> accepts all{" "}
                    <code>.thirdweb.com</code> sites
                  </Text>
                </Text>
                <Text as={ListItem}>
                  Authorize local URLs with <code>localhost:&lt;port&gt;</code>
                </Text>
                <Text as={ListItem}>
                  Separate domains by commas or new lines
                </Text>
              </UnorderedList>
            </FormHelperText>
          ) : (
            <FormErrorMessage>
              {form.getFieldState("domains", form.formState).error?.message}
            </FormErrorMessage>
          )}
        </FormControl>
      </Flex>
    </Flex>
  );
};
