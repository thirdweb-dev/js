import {
  useEngineIpAllowlistConfiguration,
  useEngineSetIpAllowlistConfiguration,
  useHasEngineFeature,
} from "@3rdweb-sdk/react/hooks/useEngine";
import { Flex, Textarea } from "@chakra-ui/react";
import { useTxNotifications } from "hooks/useTxNotifications";
import { isValid } from "ipaddr.js";
import { useForm } from "react-hook-form";
import { Button, Heading, Text } from "tw-components";
import { InlineCode } from "@/components/ui/inline-code";

interface EngineIpAllowlistConfigProps {
  instanceUrl: string;
  authToken: string;
}

interface IpForm {
  raw: string;
}

export const EngineIpAllowlistConfig: React.FC<
  EngineIpAllowlistConfigProps
> = ({ instanceUrl, authToken }) => {
  const { data: existingIpAllowlist } = useEngineIpAllowlistConfiguration({
    authToken,
    instanceUrl,
  });
  const { mutateAsync: setIpAllowlist } = useEngineSetIpAllowlistConfiguration({
    authToken,
    instanceUrl,
  });

  const { onSuccess, onError } = useTxNotifications(
    "IP Allowlist updated successfully.",
    "Failed to update IP Allowlist",
  );
  const { isSupported } = useHasEngineFeature(instanceUrl, "IP_ALLOWLIST");

  const form = useForm<IpForm>({
    values: { raw: existingIpAllowlist?.join("\n") ?? "" },
  });

  const onSubmit = async (data: IpForm) => {
    try {
      const ips = data.raw
        .split(/[\n,]/)
        .filter((url) => !!url)
        .map((ip) => ip.trim());

      // Check if all IPs are well formed.
      const incorrectIp = ips.find((ip) => !isValid(ip));

      if (incorrectIp) {
        throw new Error(`Invalid IP Address: ${incorrectIp}`);
      }

      await setIpAllowlist({ ips });
      form.reset({
        raw: ips.join("\n"),
      });
      onSuccess();
    } catch (error) {
      onError(error);
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <Flex
      as="form"
      flexDir="column"
      gap={4}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <Flex flexDir="column" gap={2}>
        <Heading size="title.md">Allowlist IPs</Heading>
        <Text>
          Specify the IP Addresses that can call Engine (
          <InlineCode code="8.8.8.8" />
          ).
          <br />
          Enter a comma separated list of IPs, or one IP per line, or leave this
          list empty to allow all IPs.
          <br />
          This does not affect Dashboard calls to Engine.
        </Text>
      </Flex>

      <Textarea
        placeholder={"8.8.8.8\nff06:0:0:0:0:0:0:c3"}
        rows={4}
        {...form.register("raw")}
      />

      <Flex alignItems="center" gap={4} justifyContent="end">
        <Button
          colorScheme="primary"
          isDisabled={!form.formState.isDirty}
          px={12}
          type="submit"
          w={{ base: "full", md: "inherit" }}
        >
          {form.formState.isSubmitting ? "Saving..." : "Save"}
        </Button>
      </Flex>
    </Flex>
  );
};
