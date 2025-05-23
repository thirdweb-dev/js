import { InlineCode } from "@/components/ui/inline-code";
import {
  useEngineCorsConfiguration,
  useEngineSetCorsConfiguration,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { Flex, Textarea } from "@chakra-ui/react";
import { useTxNotifications } from "hooks/useTxNotifications";
import { useForm } from "react-hook-form";
import { Button, Heading, Text } from "tw-components";

interface EngineCorsConfigProps {
  instanceUrl: string;
  authToken: string;
}

interface CorsForm {
  raw: string;
}

export const EngineCorsConfig: React.FC<EngineCorsConfigProps> = ({
  instanceUrl,
  authToken,
}) => {
  const { data: existingUrls } = useEngineCorsConfiguration({
    instanceUrl,
    authToken,
  });
  const { mutateAsync: setCorsConfig } = useEngineSetCorsConfiguration({
    instanceUrl,
    authToken,
  });

  const { onSuccess, onError } = useTxNotifications(
    "CORS URLs updated successfully.",
    "Failed to update CORS URLs.",
  );

  const form = useForm<CorsForm>({
    values: { raw: existingUrls?.join("\n") ?? "" },
  });

  const onSubmit = async (data: CorsForm) => {
    try {
      const urls = data.raw.split(/[\n,]/).filter((url) => !!url);
      // Assert all URLs are well formed and strip the path.
      const sanitized = urls.map(parseOriginFromUrl);

      await setCorsConfig({ urls: sanitized });
      onSuccess();
    } catch (error) {
      onError(error);
    }
  };

  return (
    <Flex
      as="form"
      flexDir="column"
      gap={4}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Flex flexDir="column" gap={2}>
        <Heading size="title.md">Allowlisted Domains</Heading>
        <Text>
          Specify the origins that can call Engine (
          <InlineCode code="https://example.com" />
          ).
          <br />
          Enter one origin per line, or leave this list empty to disallow calls
          from web clients.
        </Text>
      </Flex>

      <Textarea
        placeholder={"https://example.com\nhttp://localhost:3000"}
        rows={4}
        {...form.register("raw")}
      />

      <Flex justifyContent="end" gap={4} alignItems="center">
        <Button
          isDisabled={!form.formState.isDirty}
          colorScheme="primary"
          w={{ base: "full", md: "inherit" }}
          px={12}
          type="submit"
        >
          {form.formState.isSubmitting ? "Saving..." : "Save"}
        </Button>
      </Flex>
    </Flex>
  );
};

const parseOriginFromUrl = (url: string) => {
  try {
    const { protocol, origin } = new URL(url);
    if (!(protocol === "http:" || protocol === "https:")) {
      throw new Error("Missing or invalid protocol");
    }
    return origin;
  } catch {
    throw new Error(`Invalid URL: "${url}"`);
  }
};
