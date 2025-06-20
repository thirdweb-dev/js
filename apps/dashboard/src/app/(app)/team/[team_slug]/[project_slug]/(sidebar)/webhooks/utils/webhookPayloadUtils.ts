import { keccak256, toFunctionSelector } from "thirdweb/utils";
import type { WebhookFormValues } from "./webhookTypes";

export function parseAddresses(addresses: string | undefined): string[] {
  if (!addresses) return [];
  return addresses
    .split(/[,\s]+/)
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
      abi: data.sigHashAbi || data.abi,
      params: {},
      sig_hash: data.sigHash.startsWith("0x")
        ? data.sigHash
        : keccak256(new TextEncoder().encode(data.sigHash)),
    });
  }
  return {
    filters: {
      "v1.events": {
        addresses: parseAddresses(data.addresses),
        chain_ids: data.chainIds?.map(String),
        signatures: eventSignatures.length > 0 ? eventSignatures : undefined,
      },
    },
    name: data.name ?? "",
    webhook_url: data.webhookUrl,
  };
}

export function buildTransactionWebhookPayload(
  data: WebhookFormValues,
): WebhookPayload {
  const txSignatures = [];
  if (data.sigHash) {
    txSignatures.push({
      abi: data.sigHashAbi || data.abi,
      params: {},
      sig_hash: data.sigHash.startsWith("0x")
        ? data.sigHash
        : toFunctionSelector(data.sigHash),
    });
  }
  return {
    filters: {
      "v1.transactions": {
        chain_ids: data.chainIds?.map(String),
        from_addresses: parseAddresses(data.fromAddresses),
        signatures: txSignatures.length > 0 ? txSignatures : undefined,
        to_addresses: data.toAddresses
          ? parseAddresses(data.toAddresses)
          : undefined,
      },
    },
    name: data.name ?? "",
    webhook_url: data.webhookUrl,
  };
}
