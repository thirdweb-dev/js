import { GetWalletFromOrderParams, ResponseBody } from "../../types/shopify";
import { GET_ORDER_BY_ID_QUERY } from "./queries";
import { shopifyFetchAdminAPI } from "./utils";

export async function getWalletFromOrder({
  shopifyAdminUrl,
  shopifyAccessToken,
  shopifyOrderId,
}: GetWalletFromOrderParams) {
  let response;
  try {
    response = await shopifyFetchAdminAPI({
      shopifyAdminUrl,
      shopifyAccessToken,
      query: GET_ORDER_BY_ID_QUERY,
      variables: {
        id: `gid://shopify/Order/${shopifyOrderId}`,
      },
    });
  } catch (e) {
    throw new Error("Error fetching order from Shopify");
  }

  const respBody = response.body as ResponseBody;

  if (!respBody.data.order.lineItems) {
    throw new Error("Order did not contain any line items");
  }

  const itemsPurchased = respBody.data.order.lineItems.edges.map(
    (edge) => edge.node,
  );

  let receiver = "";
  try {
    receiver =
      itemsPurchased[0].customAttributes.find(
        (e: any) => e.key === "wallet",
      )?.value || "";
  } catch (e) {
    throw new Error("receiver's wallet address not found in order's custom attributes");
  }

  return {
    receiver,
    itemsPurchased,
  };
}