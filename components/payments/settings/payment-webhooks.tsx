import {
  usePaymentsWebhooksByAccountId,
  usePaymentsWebhooksSecretKeyByAccountId,
} from "@3rdweb-sdk/react/hooks/usePayments";
import { Flex, Divider, Skeleton } from "@chakra-ui/react";
import { Card, Heading, CodeBlock, Text } from "tw-components";
import { PaymentsWebhooksTable } from "./payments-webhooks-table";
import { DetailsRow } from "components/settings/ApiKeys/DetailsRow";
import { useMemo } from "react";
import { PaymentsWebhooksCreateButton } from "./payments-webhooks-create-webhook-button";
import { PaymentsWebhooksTestButton } from "./payments-webhooks-test";

const WEBHOOK_LIMIT = 3;

interface PaymentsWebhooksProps {
  accountId: string;
}

export const PaymentsWebhooks: React.FC<PaymentsWebhooksProps> = ({
  accountId,
}) => {
  const { data: webhookApiKey, isFetched: isSecretKeyFetched } =
    usePaymentsWebhooksSecretKeyByAccountId(accountId);
  const {
    data: webhooks,
    isLoading,
    isFetched,
  } = usePaymentsWebhooksByAccountId(accountId);

  const { productionWebhooks, testnetWebhooks } = useMemo(
    () => ({
      productionWebhooks:
        webhooks?.filter((webhook) => webhook.isProduction) || [],
      testnetWebhooks:
        webhooks?.filter((webhook) => !webhook.isProduction) || [],
    }),
    [webhooks],
  );

  return (
    <>
      <Card
        p={8}
        as={Flex}
        flexDir="column"
        gap={8}
        maxW={{ base: "full", xl: "70%" }}
      >
        <Flex flexDir="column" gap={2}>
          <Heading>Webhooks</Heading>
          <Text>Notify your backend when payment and mint events happen.</Text>
        </Flex>
        <DetailsRow
          title="Secret Key"
          tooltip={`Used for authenticating the webhook request`}
          content={
            <Skeleton isLoaded={isSecretKeyFetched} w="full" borderRadius="md">
              <CodeBlock code={webhookApiKey?.data?.decrypted_key ?? ""} />
            </Skeleton>
          }
        />

        <Divider />
        <Flex flexDir="column" gap={2}>
          <Flex justifyContent="space-between" alignItems="center" gap={2}>
            <Heading size="title.md">Mainnets</Heading>
            <Flex alignItems="center" gap={2}>
              <PaymentsWebhooksCreateButton
                accountId={accountId}
                existingWebhooks={productionWebhooks}
                isMainnets={true}
                isDisabled={productionWebhooks.length >= WEBHOOK_LIMIT}
              />
              <PaymentsWebhooksTestButton
                accountId={accountId}
                webhooks={productionWebhooks}
                isMainnets={true}
                isDisabled={productionWebhooks.length === 0}
              />
            </Flex>
          </Flex>
          <PaymentsWebhooksTable
            accountId={accountId}
            webhooks={productionWebhooks}
            isLoading={isLoading}
            isFetched={isFetched}
          />
        </Flex>

        <Divider />
        <Flex flexDir="column" gap={2}>
          <Flex justifyContent="space-between" alignItems="center" gap={2}>
            <Heading size="title.md">Testnets</Heading>
            <Flex alignItems="center" gap={2}>
              <PaymentsWebhooksCreateButton
                accountId={accountId}
                existingWebhooks={testnetWebhooks}
                isMainnets={false}
                isDisabled={testnetWebhooks.length >= WEBHOOK_LIMIT}
              />
              <PaymentsWebhooksTestButton
                accountId={accountId}
                webhooks={testnetWebhooks}
                isMainnets={false}
                isDisabled={testnetWebhooks.length === 0}
              />
            </Flex>
          </Flex>
          <PaymentsWebhooksTable
            accountId={accountId}
            webhooks={testnetWebhooks}
            isLoading={isLoading}
            isFetched={isFetched}
          />
        </Flex>
      </Card>
    </>
  );
};
