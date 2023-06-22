import { SDKOptions, ThirdwebSDK } from "@thirdweb-dev/sdk";
import crypto from "crypto";
import { NextApiRequest } from "next";
import { LoyaltyRewardsParams, ResponseBody } from "../../../types";
import { GET_ORDER_BY_ID_QUERY } from "../../lib/queries";
import { getRawBody, shopifyFetchAdminAPI } from '../../lib/utils';

/**
 * Gift ERC20 loyalty tokens to a customer using their wallet address from each purchase.
 * 
 * @example
 * ```
 * const txHash = await rewardPoints({
    nextApiRequest: {{next_api_request}},
    rewardAmount: 100,
    tokenContractAddress: {{"contract_address"}},
    webhookSecret: {{"webhook_secret"}},
    chain: "goerli",
    privateKey: {{"private_key"}},
    shopifyAdminUrl: {{"shopify_admin_url"}},
    shopifyAccessToken: {{"shopify_access_token"}},
  });
 * ```
 * @returns Transaction hash
 * @public
 */

export async function rewardPoints({
  nextApiRequest,
  webhookSecret,
  tokenContractAddress,
  gaslessRelayerUrl,
  chain,
  rewardAmount,
  privateKey,
  shopifyAdminUrl,
  shopifyAccessToken,
}: LoyaltyRewardsParams) {
  const secretKey = webhookSecret;

  const hmac = nextApiRequest.headers["x-shopify-hmac-sha256"];
  const body = await getRawBody(nextApiRequest);
  const hash = crypto
    .createHmac("sha256", secretKey)
    .update(body)
    .digest("base64");

    // Compare our hash to Shopify's hash
    if (hash === hmac) {
      const shopifyOrderId = nextApiRequest.headers["x-shopify-order-id"];

      const response = await shopifyFetchAdminAPI({
        shopifyAdminUrl,
        shopifyAccessToken,
        query: GET_ORDER_BY_ID_QUERY,
        variables: {
          id: `gid://shopify/Order/${shopifyOrderId}`,
        },
      });

      const respBody = response.body as ResponseBody;

      if (!respBody.data.order.lineItems) {
        throw new Error("Order did not contain any line items");
      }

      const itemsPurchased = respBody.data.order.lineItems.edges.map(
        (edge) => edge.node,
      );

      let wallet = "";
      try {
        wallet =
          itemsPurchased[0].customAttributes.find(
            (e: any) => e.key === "wallet",
          )?.value || "";
      } catch (e) {
        throw new Error("No wallet address found in order's custom attributes");
      }

      const sdkOptions: SDKOptions | undefined = gaslessRelayerUrl
        ? {
            gasless: {
              openzeppelin: { relayerUrl: gaslessRelayerUrl },
            },
          }
        : undefined;

      const sdk = ThirdwebSDK.fromPrivateKey(
        privateKey,
        chain,
        sdkOptions,
      );

      const tokenContract = await sdk.getContract(tokenContractAddress, "token");
      try {
        const tx = await tokenContract.erc20.transfer(wallet, rewardAmount);
        console.log(`Rewarding ${rewardAmount} points to wallet address: ${wallet}`, `tx: ${tx.receipt.transactionHash}`);
        return tx.receipt.transactionHash;
      } catch (e) {
        throw new Error(`Error rewarding points to wallet address: \n${e}`);
      }
    } else {
      throw new Error("Forbidden");
    }
};

/**
 * Check customers eligibility for loyalty rewards.
 * 
 * @example
 * ```javascript
 * const isEligible = await checkEligibility({
 *  request: req,
 *  webhookSecret: secretKey,
 *  shopifyAdminUrl: {{"shopify_admin_url"}},
 *  shopifyAccessToken: {{"shopify_access_token"}},
 * });
 * ```
 * @returns boolean
 * @public
 * */
export async function checkEligibility({
  request,
  webhookSecret,
}: {
  request: NextApiRequest;
  webhookSecret: string;
}) {
  return true;
};


/**
 * Generate a discount code for a customer.
 * 
 * @example
 * ```javascript
 * const discountCode = await generateDiscount({
 *   wallet: {{"wallet_address"}},
 *   shopifyAdminUrl: {{"shopify_admin_url"}},
 *   shopifyAccessToken: {{"shopify_access_token"}},
 * });
 * ```
 * @returns Discount code
 * @public
 * */

// export async function generateDiscount();

/**
 * Generate and send an NFT receipt for a customer.
 * 
 * @example
 * ```javascript
 * const receipt = await sendNFTReceipt({
 *  wallet: {{"wallet_address"}},
 *  shopifyAdminUrl: {{"shopify_admin_url"}},
 *  shopifyAccessToken: {{"shopify_access_token"}},
 * });
 * ```
 * @returns Transaction hash
 * @public
 * */

// export async function sendNFTReceipt();