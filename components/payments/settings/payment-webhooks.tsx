import {
  usePaymentsWebhooksByAccountId,
  usePaymentsCreateWebhook,
  usePaymentsUpdateWebhook,
  isValidWebhookUrl,
  usePaymentsWebhooksSecretKeyByAccountId,
} from "@3rdweb-sdk/react/hooks/usePayments";
import { Flex, Divider, useToast, Spinner } from "@chakra-ui/react";
import { Card, Heading, CodeBlock } from "tw-components";
import {
  PaymentsWebhooksTable,
  PaymentsWebhooksTableProps,
} from "./payments-webhooks-table";
import { DetailsRow } from "components/settings/ApiKeys/DetailsRow";
import { useMemo } from "react";

interface PaymentsWebhooksProps {
  accountId: string;
}

export const PaymentsWebhooks: React.FC<PaymentsWebhooksProps> = ({
  accountId,
}) => {
  const { data: webhookApiKey, isLoading: isLoadingSecretKey } =
    usePaymentsWebhooksSecretKeyByAccountId(accountId);
  const { data: webhooks, isLoading: isGetLoading } =
    usePaymentsWebhooksByAccountId(accountId);
  const { mutate: updateWebhook, isLoading: isUpdateLoading } =
    usePaymentsUpdateWebhook(accountId);
  const { mutate: createWebhook, isLoading: isCreateLoading } =
    usePaymentsCreateWebhook(accountId);

  const toast = useToast();

  const triggerAlert = (
    status: "error" | "success",
    header: string,
    description: string,
  ) => {
    toast({
      position: "bottom",
      variant: "solid",
      title: header,
      description,
      status,
      duration: 9000,
      isClosable: true,
    });
  };

  const { productionWebhooks, testnetWebhooks } = useMemo(
    () => ({
      productionWebhooks:
        webhooks?.filter((webhook) => webhook.isProduction) || [],
      testnetWebhooks:
        webhooks?.filter((webhook) => !webhook.isProduction) || [],
    }),
    [webhooks],
  );

  const onUpdateWebhook: PaymentsWebhooksTableProps["onUpdate"] = (
    webhook,
    newUrl,
  ) => {
    if (!isValidWebhookUrl(newUrl)) {
      triggerAlert(
        "error",
        "Invalid Webhook Url",
        `${newUrl} is not a valid webhook url, please try a different url`,
      );
      return;
    }

    // send the request
    updateWebhook(
      { webhookId: webhook.id, url: newUrl },
      {
        onSuccess: () => {
          triggerAlert(
            "success",
            "Webhook Created",
            `Successfully created  ${
              webhook.isProduction ? "production" : "testnet"
            } webhook: ${webhook.url}`,
          );
        },
        onError: () => {
          triggerAlert(
            "error",
            "Failed to Create Webhook",
            `Failed to create  ${
              webhook.isProduction ? "production" : "testnet"
            } webhook: ${webhook.url}`,
          );
        },
      },
    );
  };

  const onDeleteWebhook: PaymentsWebhooksTableProps["onDelete"] = (webhook) => {
    // mutate
    updateWebhook(
      { webhookId: webhook.id, deletedAt: new Date() },
      {
        onSuccess: () => {
          triggerAlert(
            "success",
            "Webhook Deleted",
            `Successfully deleted ${
              webhook.isProduction ? "production" : "testnet"
            } webhook: ${webhook.url}`,
          );
        },
        onError: () => {
          triggerAlert(
            "error",
            "Failed to Delete Webhook",
            `Failed to delete ${
              webhook.isProduction ? "production" : "testnet"
            } webhook: ${webhook.url}`,
          );
        },
      },
    );
  };

  const createWebhookHandlerFactory = (isProduction: boolean) => {
    const onAddWebhook: PaymentsWebhooksTableProps["onCreate"] = async (
      url,
    ) => {
      if (!isValidWebhookUrl(url)) {
        triggerAlert(
          "error",
          "Invalid Webhook Url",
          `${url} is not a valid webhook url, please try a different url`,
        );
        return;
      }

      // mutate
      createWebhook(
        { url, isProduction },
        {
          onSuccess: () => {
            triggerAlert(
              "success",
              "Webhook Updated",
              `Successfully updated ${
                isProduction ? "production" : "testnet"
              } webhook: ${url}`,
            );
          },
          onError: () => {
            triggerAlert(
              "error",
              "Failed to Update Webhook",
              `Failed to update ${
                isProduction ? "production" : "testnet"
              } webhook to url: ${url}`,
            );
          },
        },
      );
    };
    return onAddWebhook;
  };

  const isLoading = isCreateLoading || isGetLoading || isUpdateLoading;

  console.log(`Webhook APi key: ${webhookApiKey}`);
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
        </Flex>
        <DetailsRow
          title="Secret Key"
          tooltip={`Used for authenticating the webhook request`}
          content={
            isLoadingSecretKey ? (
              <Flex justifyContent="center" alignItems="center">
                <Spinner size="sm" />
              </Flex>
            ) : (
              <CodeBlock code={webhookApiKey?.data?.decrypted_key ?? ""} />
            )
          }
        />

        <Divider />

        <Flex flexDir="column" gap={2}>
          <Heading size="title.md">Production</Heading>
          <PaymentsWebhooksTable
            webhooks={productionWebhooks}
            onCreate={createWebhookHandlerFactory(true)}
            onUpdate={onUpdateWebhook}
            onDelete={onDeleteWebhook}
            isLoading={isLoading}
          />
        </Flex>

        <Divider />
        <Flex flexDir="column" gap={2}>
          <Heading size="title.md">Testnet</Heading>
          <PaymentsWebhooksTable
            webhooks={testnetWebhooks}
            onCreate={createWebhookHandlerFactory(false)}
            onUpdate={onUpdateWebhook}
            onDelete={onDeleteWebhook}
            isLoading={isLoading}
          />
        </Flex>
      </Card>
    </>
  );
};
