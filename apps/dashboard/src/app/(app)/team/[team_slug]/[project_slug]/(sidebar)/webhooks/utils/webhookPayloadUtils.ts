import type { WebhookFormValues } from "./webhookTypes";

export function parseAddresses(addresses: string | undefined): string[] {
  if (!addresses) return [];
  return addresses
    .split(/[\,\s]+/)
    .map((addr) => addr.trim())
    .filter(Boolean);
}

export interface WebhookPayload {
  name: string;
  filters: Record<
    string,
    {
      chain_ids?: string[];
      addresses?: string[];
      from_addresses?: string[];
      to_addresses?: string[];
      signatures?: Array<{
        sig_hash: string;
        abi?: string;
        params: Record<string, unknown>;
      }>;
    }
  >;
  webhook_url: string;
}

export function buildEventWebhookPayload(
  data: WebhookFormValues,
): WebhookPayload {
  const eventSignatures = [];
  if (data.sigHash) {
    eventSignatures.push({
      sig_hash: data.sigHash,
      abi: data.sigHashAbi,
      params: {},
    });
  }
  return {
    name: data.name ?? "",
    filters: {
      "v1.events": {
        chain_ids: data.chainIds?.map(String),
        addresses: parseAddresses(data.addresses),
        signatures: eventSignatures.length > 0 ? eventSignatures : undefined,
      },
    },
    webhook_url: data.webhookUrl,
  };
}

export function buildTransactionWebhookPayload(
  data: WebhookFormValues,
): WebhookPayload {
  const txSignatures = [];
  if (data.sigHash) {
    txSignatures.push({
      sig_hash: data.sigHash,
      abi: data.sigHashAbi,
      params: {},
    });
  }
  return {
    name: data.name ?? "",
    filters: {
      "v1.transactions": {
        chain_ids: data.chainIds?.map(String),
        from_addresses: parseAddresses(data.fromAddresses),
        to_addresses: data.toAddresses
          ? parseAddresses(data.toAddresses)
          : undefined,
        signatures: txSignatures.length > 0 ? txSignatures : undefined,
      },
    },
    webhook_url: data.webhookUrl,
  };
}
