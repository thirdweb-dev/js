import { SDKOptions, ThirdwebSDK } from "@thirdweb-dev/sdk";
import { AbstractClientWallet } from "@thirdweb-dev/wallets";
import { Signer } from 'ethers';
import { NextApiRequest } from "next";
import { LoyaltyRewardsParams, ResponseBody, RewardTokensParams } from "../../../types";
import { GET_ORDER_BY_ID_QUERY } from "../../lib/queries";
import { shopifyFetchAdminAPI, verifyWebhook } from '../../lib/utils';

/**
 * Gift ERC20 loyalty tokens to a customer using their wallet address.
 * 
 * @description This function is used to gift loyalty tokens to a customer using their wallet address. The customer must have purchased and item from your store in order to receive the loyalty tokens. The function will check the order ID and verify that the customer has purchased an item from your store. If the customer has purchased an item from your store, the function will gift the customer the loyalty tokens.
 * 
 * @example
 * ```javascript
 * import ethers from "ethers";
 * const signer = new ethers.Wallet("{{private_key}}");
 * 
 * const txHash = await rewardPoints({
 *   signerOrWallet: signer,
 *   body: {{body}},
 *   headers: {{headers}},
 *   webhookSecret: {{"webhook_secret"}},
 *   tokenContractAddress: {{"contract_address"}},
 *   gaslessRelayerUrl: {{"gasless_relayer_url"}},
 *   chain: "goerli",
 *   rewardAmount: 100,
 *   shopifyAdminUrl: {{"shopify_admin_url"}},
 *   shopifyAccessToken: {{"shopify_access_token"}},
 * });
 * ```
 * @returns Transaction hash
 * @public
 */

export async function rewardTokensOnPurchase({
  body,
  headers,
  webhookSecret,
  tokenContractAddress,
  gaslessRelayerUrl,
  chain,
  rewardAmount,
  shopifyAdminUrl,
  shopifyAccessToken,
  signerOrWallet,
}: LoyaltyRewardsParams) {
  console.log("rewardTokensOnPurchase", {body, headers, webhookSecret, tokenContractAddress, gaslessRelayerUrl, chain, rewardAmount, shopifyAdminUrl, shopifyAccessToken, signerOrWallet});
  if (!body || !headers) {
    throw new Error("Bad request - missing body or headers");
  }

  const shopifyOrderId = headers["x-shopify-order-id"];

  const verified = verifyWebhook(body, headers, webhookSecret);
  if (!verified) {
    throw new Error("Bad request - HMAC verification failed");
  }

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
      signerOrWallet,
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
  signerOrWallet,
}: RewardTokensParams) {
  let sdk = undefined;
  if (signerOrWallet instanceof Signer) {
    sdk = ThirdwebSDK.fromSigner(
      signerOrWallet,
      chain,
      sdkOptions,
    );
  }

  if (signerOrWallet instanceof AbstractClientWallet) {
    sdk = await ThirdwebSDK.fromWallet(
      signerOrWallet,
      chain,
      sdkOptions,
    );
  }

  if (!sdk) return;

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