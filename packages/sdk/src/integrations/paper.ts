import { SignedPayload721WithQuantitySignature } from "../schema/contracts/common/signature";
import type {
  SignatureDrop,
  DropERC721,
  DropERC1155,
} from "@thirdweb-dev/contracts-js";
import fetch from "cross-fetch";

const PAPER_BASE_URL = "https://paper.xyz/api/2022-08-12";

interface PaperCheckoutIntentArgsShared {
  walletAddress: string;
  email: string;
  // has to be 1 for erc721, otherwise the quantity of the token that is being bought
  quantity: number;
  // will be passed through paper
  metadata?: Record<string, unknown>;
}

interface PaperCheckoutIntentArgsErc721 extends PaperCheckoutIntentArgsShared {}

interface PaperCheckoutIntentArgsErc1155 extends PaperCheckoutIntentArgsShared {
  contractArgs: {
    tokenId: string;
  };
}

interface PaperCheckoutIntentArgsSignature
  extends PaperCheckoutIntentArgsShared {
  contractArgs: SignedPayload721WithQuantitySignature;
}

export type PaperEnabledContracts = SignatureDrop | DropERC721 | DropERC1155;

export type PaperCheckoutIntentArgs<T extends PaperEnabledContracts> =
  T extends SignatureDrop
    ? PaperCheckoutIntentArgsSignature
    : T extends DropERC721
    ? PaperCheckoutIntentArgsErc721
    : T extends DropERC1155
    ? PaperCheckoutIntentArgsErc1155
    : never;

export interface PaperCheckoutIntentResponse {
  sdkClientSecret: string;
}

export async function createCheckoutIntent<T extends PaperEnabledContracts>(
  paperApiKey: string,
  chainId: number,
  contractAddress: string,
  paperArgs: PaperCheckoutIntentArgs<T>,
): Promise<PaperCheckoutIntentResponse> {
  const contractIdResult = await fetch(
    `${PAPER_BASE_URL}/platform/thirdweb/register-contract?contractAddress=${contractAddress}&chainId=${chainId}`,
  );
  const { contractId } = await contractIdResult.json();

  const response = await fetch(`${PAPER_BASE_URL}/checkout-sdk-intent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${paperApiKey}`,
    },
    body: JSON.stringify({ contractId, ...paperArgs }),
  });

  if (!response.ok) {
    throw new Error(`Failed to create checkout intent: ${response.statusText}`);
  }

  return response.json();
}
