import { DASHBOARD_THIRDWEB_CLIENT_ID } from "@/constants/env";

export interface Transaction {
    chain_id: number;
    hash: string;
    nonce: number;
    block_hash: string;
    block_number: number;
    block_timestamp: number;
    transaction_index: number;
    from_address: string;
    to_address: string | null;
    value: number;
    gas: number;
    gas_price: number | null;
    data: string | null;
    function_selector: string | null;
    max_fee_per_gas: number | null;
    max_priority_fee_per_gas: number | null;
    transaction_type: number | null;
    r: string | null;
    s: string | null;
    v: number | null;
    access_list_json: string | null;
    contract_address: string | null;
    gas_used: number | null;
    cumulative_gas_used: number | null;
    effective_gas_price: number | null;
    blob_gas_used: number | null;
    blob_gas_price: number | null;
    logs_bloom: string | null;
    status: boolean | null; // true for success, false for failure
}

interface InsightsResponse {
    meta: {
        address: string;
        signature: string;
        page: number;
        total_items: number;
        total_pages: number;
        limit_per_chain: number;
        chain_ids: number[];
    };
    data: Transaction[];
}

export async function fetchActivity(args: {
  chainId: number;
  address: string;
  page?: string;
}): Promise<InsightsResponse> {
  const { chainId, address, page } = args;

  const response = await fetch(
    `https://insight.thirdweb.com/v1/transactions?chain=${chainId}&filter_from_address=${address}&page=${page}&limit=10&sort_by=block_number&sort_order=desc`,
      {
          headers: {
            "x-client-id": DASHBOARD_THIRDWEB_CLIENT_ID,
          },
        },
);

  if (!response.ok) {
    throw new Error('Failed to fetch transaction history');
  }

  const data: InsightsResponse = await response.json();
  return data;
} 