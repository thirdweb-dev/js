import { SDKOptions } from "@thirdweb-dev/sdk";
import { IssueDigitalReceiptParams, IssueDigitalReceiptWebhookParams, RedeemDiscountCodeParams, RewardTokensParams, RewardTokensWebhookParams } from "../../../types";
import { generateDiscountCode, getWalletFromOrder } from "../../lib/shopify";
import { getSdkInstance, redeemPointsSync, sendReceiptAsync, sendReceiptSync, sendTokensAsync, sendTokensSync, verifyWebhook } from '../../lib/utils';

/**
 * Read the webhook information, grab the wallet address from an order and sends it the specified amount of tokens.
 * 
 * @description NOTE: This function relies on the headers information given from a Shopify webhook. The function will find the order by id and grab the wallet address from the custom attributes. If the wallet is found, the function will gift the specified amount of tokens to that wallet address.
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
 * @description Send specified amount of tokens to specified wallet address.
 * 
 * @example
 * ```javascript
 * const txHash = await sendTokens({
 *   receiver: "{{wallet_address}}",
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
 * Read the webhook information, grab the wallet address from an order, generate a digital receipt and send it to that wallet.
 * 
 * @description NOTE: This function relies on the headers information given from a Shopify webhook. The function will find the order by id and grab the wallet address from the custom attributes. If the wallet is found, the function will generate a digital receipt and send it to that wallet address.
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
}: IssueDigitalReceiptWebhookParams) {
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
 *   receiver: "{{wallet_address}}",
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
}: IssueDigitalReceiptParams) {
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
 * Check if a wallet has enough points to purchase a discount code and generate one if it does have points.
 *
 * @description This will check the amount of points a wallet has and if they have enough points for a reward, they can spend those points to get a discount code.
 * 
 * @example
 * ```javascript
 * const discountCode = await redeemDiscountCode({
 *   signerOrWallet: {{signer_or_wallet}},
 *   chain: "goerli",
 *   receiver: "{{wallet_address}}",
 *   sdkOptions: {{sdk_options}},
 *   tokenContractAddress: {{"contract_address"}},
 *   requiredPoints: 5000,
 *   discountAmount: 50,
 * });
 * ```
 * @returns Discount code or error
 * @public
 * */

export async function rewardDiscount({
  signerOrWallet,
  chain,
  receiver,
  sdkOptions,
  tokenContractAddress,
  requiredPoints,
  discountDollarAmount,
  shopifyAdminUrl,
  shopifyAccessToken,
}: RedeemDiscountCodeParams) {
  // Check if user has enough points to redeem a discount code.
  const sdk = await getSdkInstance(signerOrWallet, chain, sdkOptions);
  if (!sdk) {
    throw new Error("Error getting SDK instance");
  };

  const tokenContract = await sdk.getContract(tokenContractAddress, "token");
  const balance = await tokenContract.erc20.balanceOf(receiver);
  const cleanValue = Number(balance.displayValue);
  if (cleanValue < requiredPoints) {
    throw new Error(`Wallet does not have enough points to redeem this discount code: ${receiver}`);
  }
  // Generate discount code for the amount of points.
  const discountCode = await generateDiscountCode({
    shopifyAdminUrl,
    shopifyAccessToken,
    discountDollarAmount,
  })
  // Burn the points from the wallet.
  try {
    await redeemPointsSync({
      tokenContract,
      receiver,
      quantity: requiredPoints,
    })
  } catch (e) {
    throw new Error(`Error redeeming points from wallet address ${receiver}: \n${e}`);
  }
  // Return the discount code.
  return discountCode;
};

/**
 * Check a wallets eligibility for loyalty rewards.
 * 
 * @example
 * ```javascript
 * const isEligible = await hasAccess({
 *  request: req,
 *  webhookSecret: secretKey,
 *  shopifyAdminUrl: {{"shopify_admin_url"}},
 *  shopifyAccessToken: {{"shopify_access_token"}},
 * });
 * ```
 * @returns boolean
 * @public
 * */
// export async function hasAccess() {
//   return true;
// };