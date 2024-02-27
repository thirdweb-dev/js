import { SignatureDrop } from "@thirdweb-dev/contracts-js/dist/declarations/src/SignatureDrop";
import { ChainId } from "../constants/chains/ChainId";
import { ContractWrapper } from "../core/classes/internal/contract-wrapper";
import { SignedPayload721WithQuantitySignature } from "../schema/contracts/common/signature";
import { PrebuiltEditionDrop, PrebuiltNFTDrop } from "../types/eips";
import invariant from "tiny-invariant";

const PAPER_API_BASE = `https://paper.xyz/api` as const;
const PAPER_API_VERSION = `2022-08-12` as const;

/**
 * @internal
 */
export const PAPER_API_URL =
  `${PAPER_API_BASE}/${PAPER_API_VERSION}/platform/thirdweb` as const;

const PAPER_CHAIN_ID_MAP = /* @__PURE__ */ {
  [ChainId.Mainnet]: "Ethereum",
  [ChainId.Goerli]: "Goerli",
  [ChainId.Polygon]: "Polygon",
  [ChainId.Mumbai]: "Mumbai",
  [ChainId.Avalanche]: "Avalanche",
} as const;

/**
 * @internal
 */
export function parseChainIdToPaperChain(chainId: number) {
  invariant(
    chainId in PAPER_CHAIN_ID_MAP,
    `chainId not supported by paper: ${chainId}`,
  );
  return PAPER_CHAIN_ID_MAP[chainId as keyof typeof PAPER_CHAIN_ID_MAP];
}

type RegisterContractSuccessResponse = {
  result: {
    id: string;
  };
};

/**
 *
 * @param contractAddress - the contract address
 * @param chainId - the chain id
 * @internal
 * @returns The paper xyz contract id
 * @throws if the contract is not registered on paper xyz
 */
export async function fetchRegisteredCheckoutId(
  contractAddress: string,
  chainId: number,
): Promise<string> {
  const paperChain = parseChainIdToPaperChain(chainId);
  const res = await fetch(
    `${PAPER_API_URL}/register-contract?contractAddress=${contractAddress}&chain=${paperChain}`,
  );
  const json = (await res.json()) as RegisterContractSuccessResponse;
  invariant(json.result.id, "Contract is not registered with paper");
  return json.result.id;
}

/**
 * The parameters for creating a paper.xyz checkout link.
 * @public
 */
export type PaperCreateCheckoutLinkShardParams = {
  /**
   * The title of the checkout.
   */
  title: string;
  /**
   * The number of NFTs that will be purchased through the checkout flow.
   */
  quantity?: number;
  /**
   * The wallet address that the NFT will be sent to.
   */
  walletAddress?: string;
  /**
   * The email address of the recipient.
   */
  email?: string;
  /**
   * The description of the checkout.
   */
  description?: string;
  /**
   * The image that will be displayed on the checkout page.
   */
  imageUrl?: string;
  /**
   * Override the seller's Twitter handle for this checkout.
   */
  twitterHandleOverride?: string;
  /**
   * The time in minutes that the intent will be valid for.
   */
  expiresInMinutes?: number;
  /**
   * Determines whether the buyer or seller pays the network and service fees for this purchase. The seller will be billed if set to SELLER. (default: `BUYER`)
   */
  feeBearer?: "BUYER" | "SELLER";
  /**
   * Arbitrary data that will be included in webhooks and when viewing purchases in the paper.xyz dashboard.
   */
  metadata?: Record<string, string | number | null>;
  /**
   * If true, Paper will send buyers an email when their purchase is transferred to their wallet. (default: true)
   */
  sendEmailOnSuccess?: boolean;
  /**
   * The URL to prompt the user to navigate after they complete their purchase.
   */
  successCallbackUrl?: string;
  /**
   * The URL to redirect (or prompt the user to navigate) if the checkout link is expired or the buyer is not eligible to purchase (sold out, not allowlisted, sale not started, etc.).
   */
  cancelCallbackurl?: string;
  /**
   * If true, the checkout flow will redirect the user to the successCallbackUrl immediately after successful payment and bypass the final receipt page.
   */
  redirectAfterPayment?: boolean;
  /**
   * The maximum quantity the buyer is allowed to purchase in one transaction.
   */
  limitPerTransaction?: number;
};

/**
 * @internal
 */
export type PaperCreateCheckoutLinkIntentParams<
  TContract extends PrebuiltNFTDrop | PrebuiltEditionDrop | SignatureDrop,
> = PaperCreateCheckoutLinkShardParams &
  (TContract extends PrebuiltEditionDrop
    ? {
        contractArgs: { tokenId: string };
      }
    : TContract extends SignatureDrop
    ? {
        contractArgs: SignedPayload721WithQuantitySignature;
      }
    : TContract extends PrebuiltNFTDrop
    ? // eslint-disable-next-line @typescript-eslint/ban-types
      {}
    : never);

/**
 * @internal
 */
export type PaperCreateCheckoutLinkIntentResult = {
  checkoutLinkIntentUrl: string;
};

const DEFAULT_PARAMS: Partial<PaperCreateCheckoutLinkShardParams> = {
  expiresInMinutes: 15,
  feeBearer: "BUYER",
  sendEmailOnSuccess: true,
  redirectAfterPayment: false,
};

/**
 * @internal
 */
export async function createCheckoutLinkIntent<
  TContract extends PrebuiltNFTDrop | PrebuiltEditionDrop | SignatureDrop,
>(
  contractId: string,
  params: PaperCreateCheckoutLinkIntentParams<TContract>,
): Promise<string> {
  const res = await fetch(`${PAPER_API_URL}/checkout-link-intent`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contractId,
      ...DEFAULT_PARAMS,
      ...params,
      metadata: {
        ...params.metadata,
        via_platform: "thirdweb",
      },
      // overrides that are hard coded
      hideNativeMint: true,
      hidePaperWallet: !!params.walletAddress,
      hideExternalWallet: true,
      hidePayWithCrypto: true,
      usePaperKey: false,
    }),
  });
  const json = (await res.json()) as PaperCreateCheckoutLinkIntentResult;
  invariant(
    json.checkoutLinkIntentUrl,
    "Failed to create checkout link intent",
  );
  return json.checkoutLinkIntentUrl;
}

/**
 * @internal
 */
export class PaperCheckout<
  TContract extends PrebuiltNFTDrop | PrebuiltEditionDrop | SignatureDrop,
> {
  private contractWrapper;

  constructor(contractWrapper: ContractWrapper<TContract>) {
    this.contractWrapper = contractWrapper;
  }

  private async getCheckoutId(): Promise<string> {
    return fetchRegisteredCheckoutId(
      this.contractWrapper.address,
      await this.contractWrapper.getChainID(),
    );
  }

  public async isEnabled(): Promise<boolean> {
    try {
      return !!(await this.getCheckoutId());
    } catch (err) {
      return false;
    }
  }

  public async createLinkIntent(
    params: PaperCreateCheckoutLinkIntentParams<TContract>,
  ): Promise<string> {
    return await createCheckoutLinkIntent<TContract>(
      await this.getCheckoutId(),
      params,
    );
  }
}
