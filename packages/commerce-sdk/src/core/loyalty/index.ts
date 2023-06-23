import { SDKOptions, ThirdwebSDK } from "@thirdweb-dev/sdk";
import { LocalWallet } from "@thirdweb-dev/wallets";
import crypto from "crypto";
import { NextApiRequest } from "next";
import { LoyaltyRewardsParams, ResponseBody, RewardTokensParams } from "../../../types";
import { GET_ORDER_BY_ID_QUERY } from "../../lib/queries";
import { getRawBody, shopifyFetchAdminAPI } from '../../lib/utils';

/**
 * Gift ERC20 loyalty tokens to a customer using their wallet address.
 * 
 * @description This function is used to gift loyalty tokens to a customer using their wallet address. The customer must have purchased and item from your store in order to receive the loyalty tokens. The function will check the order ID and verify that the customer has purchased an item from your store. If the customer has purchased an item from your store, the function will gift the customer the loyalty tokens.
 * 
 * @example
 * ```
 * const txHash = await rewardPoints({
    nextApiRequest: {{next_api_request}},
    rewardAmount: 100,
    tokenContractAddress: {{"contract_address"}},
    webhookSecret: {{"webhook_secret"}},
    chain: "goerli",
    shopifyAdminUrl: {{"shopify_admin_url"}},
    shopifyAccessToken: {{"shopify_access_token"}},
  });
 * ```
 * @returns Transaction hash
 * @public
 */

export async function rewardTokensOnPurchase({
  nextApiRequest,
  webhookSecret,
  tokenContractAddress,
  gaslessRelayerUrl,
  chain,
  rewardAmount,
  shopifyAdminUrl,
  shopifyAccessToken,
}: LoyaltyRewardsParams) {
  const hmac = nextApiRequest.headers["x-shopify-hmac-sha256"];
  const body = await getRawBody(nextApiRequest);
  const hash = crypto
    .createHmac("sha256", webhookSecret)
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

      try {
        const tx = await rewardTokens({
          wallet,
          tokenContractAddress,
          rewardAmount,
          chain,
          sdkOptions
        })
        console.log(`Rewarding ${rewardAmount} points to wallet address: ${wallet}`, `tx: ${tx}`);
        return tx;
      } catch (e) {
        throw new Error(`Error rewarding points to wallet address: \n${e}`);
      }
    } else {
      throw new Error("Forbidden");
    }
};

/**
 * Send tokens to specified wallet address.
 * 
 * @example
 * ```javascript
 * const txHash = await sendTokens({
 *   wallet: "{{wallet_address}}",
 *   tokenContractAddress: {{"contract_address"}},
 *   amount: 100,
 *   chain: "goerli",
 * });
 * ```
 * @returns Transaction hash
 * @public
 * */

export async function rewardTokens({
  wallet,
  tokenContractAddress,
  rewardAmount,
  chain,
  sdkOptions,
}: RewardTokensParams) {
  const localWallet = new LocalWallet();
  await localWallet.generate();
  await localWallet.connect();

  const sdk = await ThirdwebSDK.fromWallet(
    localWallet,
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
};

/**
 * Generate and send an NFT receipt for a customer on item purchase.
 * 
 * @example
 * ```javascript
 * const receipt = await sendNFTReceipt({
 *  nextApiRequest: {{next_api_request}},
 *  contractAddress: {{"contract_address"}},
 *  webhookSecret: {{"webhook_secret"}},
 *  chain: "goerli",
 *  privateKey: {{"private_key"}},
 *  shopifyAdminUrl: {{"shopify_admin_url"}},
 *  shopifyAccessToken: {{"shopify_access_token"}},
 * });
 * ```
 * @returns Transaction hash
 * @public
 * */

// export async function sendNFTReceipt();

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