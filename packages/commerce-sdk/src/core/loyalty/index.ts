import { SDKOptions, ThirdwebSDK } from "@thirdweb-dev/sdk";
import crypto from "crypto";
import { ResponseBody, rewardPointsProps } from "../../../types";
import { GET_ORDER_BY_ID_QUERY } from "../../lib/queries";
import { getRawBody, shopifyFetchAdminAPI } from '../../lib/utils';
 
export const rewardPoints = async ({
  request,
  webhookSecret,
  tokenContractAddress,
  gaslessRelayerUrl,
  chain,
  rewardAmount,
}: rewardPointsProps) => {
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
        process.env.GENERATED_PRIVATE_KEY as string,
        chain,
        sdkOptions,
      );

      const tokenContract = await sdk.getContract(tokenContractAddress, "token");
      try {
        const tx = await tokenContract.erc20.transfer(wallet, rewardAmount);
        console.log(`Rewarding ${rewardAmount} points to wallet address: ${wallet}`, `tx: ${tx.receipt.transactionHash}`);
        return "OK";
      } catch (e) {
        console.log(tokenContract.getAddress());
        console.log(tokenContract.getAddress());
        throw new Error(`Error rewarding points to wallet address: \n${e}`);
      }
    } else {
      throw new Error("Forbidden");
    }
};