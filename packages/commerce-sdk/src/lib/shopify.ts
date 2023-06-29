import { GenerateDiscountParams, GetWalletFromOrderParams, ResponseBody } from "../../types/shopify";
import { GENERATE_BASIC_DISCOUNT_MUTATION, GET_ORDER_BY_ID_QUERY } from "./queries";
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

export async function generateDiscountCode({
  shopifyAdminUrl,
  shopifyAccessToken,
  discountDollarAmount,
}: GenerateDiscountParams) {
  let response;
  try {
    response = await shopifyFetchAdminAPI({
      shopifyAdminUrl,
      shopifyAccessToken,
      query: GENERATE_BASIC_DISCOUNT_MUTATION,
      variables: {
        automaticBasicDiscount: {
          title: "Discount",
          startsAt: new Date().toISOString(),
          endsAt: new Date().toISOString() + 1000 * 60 * 60 * 24 * 7,
          customerGets: {
            value: {
              discountAmount: {
                amount: (discountDollarAmount / 100),
                appliesOnEachItem: true,
              }
            },
            items: {
              all: true
            }
          }
        }
      },
    });
  } catch (e) {
    throw new Error(`Error generating discount from Shopify: \n${e}`);
  }

  console.log(response.body);
  return response.body;
};