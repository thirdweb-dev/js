import { ApiKey } from "@3rdweb-sdk/react/hooks/useApi";
import { Flex, SimpleGrid, useColorModeValue } from "@chakra-ui/react";
import { useMemo } from "react";
import { Card, CodeBlock, Heading } from "tw-components";
import { toDateTimeLocal } from "utils/date-utils";
import { FieldAlert } from "../Alerts";
import { DetailsRow } from "../DetailsRow";

interface GeneralDetailsProps {
  apiKey: ApiKey;
}

export const GeneralDetails: React.FC<GeneralDetailsProps> = ({ apiKey }) => {
  const bg = useColorModeValue("backgroundCardHighlight", "transparent");

  const {
    key,
    secretMasked,
    domains,
    bundleIds,
    createdAt,
    updatedAt,
    lastAccessedAt,
  } = apiKey;

  const domainsContent = useMemo(() => {
    if (domains.length === 0) {
      return <FieldAlert message="NoDomains" />;
    }

    if (domains.includes("*")) {
      return <FieldAlert message="AnyDomain" />;
    }

    return <CodeBlock code={domains.join("\n")} canCopy={false} />;
  }, [domains]);

  const bundleIdsContent = useMemo(() => {
    if (bundleIds.length === 0) {
      return <FieldAlert message="NoBundleIds" />;
    }

    if (bundleIds.includes("*")) {
      return <FieldAlert message="AnyBundleId" />;
    }

    return <CodeBlock code={bundleIds.join("\n")} canCopy={false} />;
  }, [bundleIds]);

  return (
    <Flex flexDir="column" gap={6}>
      <Card p={{ base: 4, md: 6 }} bg={bg}>
        <Flex flexDir="column" gap={6}>
          <Heading size="subtitle.md">{apiKey.name}</Heading>

          <DetailsRow
            title="Client Id"
            tooltip={`Identifies your application. It should generally be restricted to specific domains (web) and/or bundle-ids (native).`}
            content={<CodeBlock code={key} />}
          />

          {/* NOTE: for very old api keys the secret might be `null`, if that's the case we skip it */}
          {secretMasked && (
            <DetailsRow
              title="Secret Key"
              tooltip="Identifies and authenticates your application from the backend. Using the secret key bypasses any allowed domains or bundle ids."
              content={<CodeBlock code={secretMasked} canCopy={false} />}
            />
          )}
        </Flex>
      </Card>

      <SimpleGrid columns={{ base: 1, lg: 3 }} w="100%" gap={6}>
        <Card p={{ base: 4, md: 6 }} bg={bg}>
          <DetailsRow title="Created" content={toDateTimeLocal(createdAt)} />
        </Card>
        <Card p={{ base: 4, md: 6 }} bg={bg}>
          <DetailsRow
            title="Last updated"
            content={toDateTimeLocal(updatedAt)}
          />
        </Card>
        <Card p={{ base: 4, md: 6 }} bg={bg}>
          <DetailsRow
            title="Last accessed"
            content={lastAccessedAt ? toDateTimeLocal(lastAccessedAt) : "Never"}
          />
        </Card>
      </SimpleGrid>

      <Card p={{ base: 4, md: 6 }} bg={bg}>
        <Flex flexDir="column" gap={6}>
          <Heading size="subtitle.md">Access restrictions</Heading>

          <DetailsRow
            title="Allowed Domains"
            tooltip={`Prevent third-parties from using your Client ID by restricting access to allowed domains.`}
            content={domainsContent}
          />

          <DetailsRow
            title="Allowed Bundle IDs"
            tooltip={`Prevent third-parties from using your Client ID by restricting access to allowed Bundle IDs. This is applicable only if you want to use your key with native games or native mobile applications.`}
            content={bundleIdsContent}
          />
        </Flex>
      </Card>
    </Flex>
  );
};
