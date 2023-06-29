import { SDKOptions } from "@thirdweb-dev/sdk";
import { NextApiRequest } from "next";
import { RewardTokensParams, RewardTokensWebhookParams, issueDigitalReceiptParams, issueDigitalReceiptWebhookParams } from "../../../types";
import { getWalletFromOrder } from "../../lib/shopify";
import { getSdkInstance, sendReceiptAsync, sendReceiptSync, sendTokensAsync, sendTokensSync, verifyWebhook } from '../../lib/utils';

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
 *   rawBody: {{raw_body}},
 *   headers: {{headers}},
 *   shopifyAdminUrl: {{"shopify_admin_url"}},
 *   shopifyAccessToken: {{"shopify_access_token"}},
 *   gaslessRelayerUrl: {{"gasless_relayer_url"}},
 *   webhookSecret: {{"webhook_secret"}},
 *   signerOrWallet: signer,
 *   chain: "goerli",
 *   tokenContractAddress: {{"contract_address"}},
 *   rewardAmount: 100,
 * });
 * ```
 * @returns Transaction hash
 * @public
 */

export async function rewardTokensWebhook({
  rawBody,
  headers,
  shopifyAdminUrl,
  shopifyAccessToken,
  gaslessRelayerUrl,
  webhookSecret,
  signerOrWallet,
  chain,
  tokenContractAddress,
  rewardAmount,
}: RewardTokensWebhookParams) {
  if (!rawBody || !headers) {
    throw new Error("Bad request - missing rawBody or headers");
  }

  const shopifyOrderId = headers["x-shopify-order-id"];
  if (!shopifyOrderId) {
    throw new Error("Bad request - missing Shopify order ID");
  }

  const verified = verifyWebhook(rawBody, headers, webhookSecret);
  if (!verified) {
    throw new Error("Bad request - HMAC verification failed");
  }

  const { receiver } = await getWalletFromOrder({
    shopifyAdminUrl,
    shopifyAccessToken,
    shopifyOrderId,
  });

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
      receiver,
      tokenContractAddress,
      rewardAmount,
      chain,
      sdkOptions,
      fromWebhook: true,
    })
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
 *   rewardAmount: 100,
 *   chain: "goerli",
 *   sdkOptions: {{sdk_options}},
 *   signerOrWallet: {{signer_or_wallet}},
 * });
 * ```
 * @returns Transaction hash
 * @public
 * */

export async function rewardTokens({
  receiver,
  tokenContractAddress,
  rewardAmount,
  chain,
  sdkOptions,
  signerOrWallet,
  fromWebhook = false,
}: RewardTokensParams) {
  const sdk = await getSdkInstance(signerOrWallet, chain, sdkOptions);
  if (!sdk) {
    throw new Error("Error getting SDK instance");
  };

  const tokenContract = await sdk.getContract(tokenContractAddress, "token");
  if (!tokenContract) {
    throw new Error("Error getting token contract");
  }
  try {
    let txHash = "";
    if (fromWebhook) {
      txHash = await sendTokensAsync({
        tokenContract,
        receiver,
        rewardAmount,
      })
    } else {
      txHash = await sendTokensSync({
        tokenContract,
        receiver,
        rewardAmount,
      })
    }
    return txHash;
  } catch (e) {
    throw new Error(`Error rewarding points to wallet address: \n${e}`);
  }
};

/**
 * Generate and send an NFT receipt for a customer on item purchase.
 * 
 * @example
 * ```javascript
 * const txHash = await sendNFTReceiptWebhook({
 *   rawBody: {{raw_body}},
 *   headers: {{headers}},
 *   shopifyAdminUrl: {{"shopify_admin_url"}},
 *   shopifyAccessToken: {{"shopify_access_token"}},
 *   gaslessRelayerUrl: {{"gasless_relayer_url"}},
 *   webhookSecret: {{"webhook_secret"}},
 *   signerOrWallet: signer,
 *   chain: "goerli",
 *   receiptContractAddress: {{"contract_address"}},
 * });
 * ```
 * @returns Transaction hash
 * @public
 * */

export async function issueDigitalReceiptWebhook({
  rawBody,
  headers,
  shopifyAdminUrl,
  shopifyAccessToken,
  gaslessRelayerUrl,
  webhookSecret,
  signerOrWallet,
  chain,
  receiptContractAddress,
}: issueDigitalReceiptWebhookParams) {
  if (!rawBody || !headers) {
    throw new Error("Bad request - missing rawBody or headers");
  }

  const shopifyOrderId = headers["x-shopify-order-id"];

  const verified = verifyWebhook(rawBody, headers, webhookSecret);
  if (!verified) {
    throw new Error("Bad request - HMAC verification failed");
  }

  const { receiver, itemsPurchased } = await getWalletFromOrder({
    shopifyAdminUrl,
    shopifyAccessToken,
    shopifyOrderId,
  });

  const sdkOptions: SDKOptions | undefined = gaslessRelayerUrl
    ? {
      gasless: {
        openzeppelin: { relayerUrl: gaslessRelayerUrl },
      },
    }
    : undefined;

  for (const item of itemsPurchased) {
    // Grab the information of the product ordered
    const product = item.variant.product;

    // Set the metadata for the NFT to the product information
    const metadata = {
      name: product.title,
      description: product.description,
      image: product.featuredImage.url,
      attributes: {
        trait_type: "Amount",
        value: item.quantity,
      },
    };

    try {
      const tx = await issueDigitalReceipt({
        signerOrWallet,
        chain,
        receiver,
        fromWebhook: true,
        sdkOptions,
        receiptContractAddress,
        metadata,
      })
      return tx;
    } catch (e) {
      throw new Error(`Error rewarding points to wallet address: \n${e}`);
    }
  };
};

/**
 * Issue a digital receipt to a specified receiver address.
 * 
 * @example
 * ```javascript
 * const metadata = {
 *  name: "Digital Receipt",
 *  description: "Digital Receipt",
 *  image: "https://image.com",
 * }
 * const txHash = await issueDigitalReceipt({
 *   signerOrWallet: {{signer_or_wallet}},
 *   chain: "goerli",
 *   wallet: "{{wallet_address}}",
 *   sdkOptions: {{sdk_options}},
 *   receiptContractAddress: {{"contract_address"}},
 *   metadata,
 * });
 * ```
 * @returns Transaction hash
 * @public
 * */

export async function issueDigitalReceipt({
  signerOrWallet,
  chain,
  receiver,
  fromWebhook = false,
  sdkOptions,
  receiptContractAddress,
  metadata,
}: issueDigitalReceiptParams) {
  const sdk = await getSdkInstance(signerOrWallet, chain, sdkOptions);
  if (!sdk) {
    throw new Error("Error getting SDK instance");
  };

  const receiptContract = await sdk.getContract(receiptContractAddress, "nft-collection");
  if (!receiptContract) {
    throw new Error("Error getting token contract");
  }
  try {
    let txHash = "";
    if (fromWebhook) {
      txHash = await sendReceiptAsync({
        receiptContract,
        receiver,
        metadata,
      })
    } else {
      txHash = await sendReceiptSync({
        receiptContract,
        receiver,
        metadata,
      })
    }
    return txHash;
  } catch (e) {
    throw new Error(`Error sending receipt to receiver address ${receiver}: \n${e}`);
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