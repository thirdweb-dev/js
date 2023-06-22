import { SDKOptions, ThirdwebSDK } from "@thirdweb-dev/sdk";
import crypto from "crypto";
import { NextApiRequest } from "next";
import { ResponseBody } from "../../../types";
import { GET_ORDER_BY_ID_QUERY } from "../../lib/queries";
import { getRawBody, shopifyFetchAdminAPI } from '../../lib/utils';

export type LoyaltyRewardsParams = {
  request: NextApiRequest;
  webhookSecret: string;
  tokenContractAddress: string;
  gaslessRelayerUrl?: string;
  chain: string;
  rewardAmount: number;
  privateKey: string;
};

/**
 * Gift ERC20 loyalty tokens to a customer using their wallet address for each purchase.
 *
 * @example
 * ```
 * const txHash = await rewardPoints({
    request: req,
    rewardAmount: 100,
    tokenContractAddress: "0x5e09aE51392483dd429459A38091294BA6ebd74d",
    webhookSecret: secretKey,
    chain: APP_NETWORK,
  });
 * ```
 * @returns transaction hash
 * @public
 */
export const rewardPoints = async ({
  request,
  webhookSecret,
  tokenContractAddress,
  gaslessRelayerUrl,
  chain,
  rewardAmount,
  privateKey,
}: LoyaltyRewardsParams) => {
  const secretKey = webhookSecret;

  const hmac = request.headers["x-shopify-hmac-sha256"];
  const body = await getRawBody(request);
  const hash = crypto
    .createHmac("sha256", secretKey)
    .update(body)
    .digest("base64");

    // Compare our hash to Shopify's hash
    if (hash === hmac) {
      const shopifyOrderId = request.headers["x-shopify-order-id"];

      const response = await shopifyFetchAdminAPI({
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