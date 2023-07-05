import { GenerateDiscountParams, GetWalletFromOrderParams, ResponseBody } from "../../types/shopify";
import { GENERATE_BASIC_DISCOUNT_MUTATION, GET_ORDER_BY_ID_QUERY } from "./queries";
import { shopifyFetchAdminAPI } from "./utils";

function generateUniqueCode() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

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
  discountPercentage,
}: GenerateDiscountParams) {
  let response;
  try {
    response = await shopifyFetchAdminAPI({
      shopifyAdminUrl,
      shopifyAccessToken,
      query: GENERATE_BASIC_DISCOUNT_MUTATION,
      variables: {
        basicCodeDiscount: {
          title: `${discountPercentage}% off your order`,
          code: generateUniqueCode(),
          startsAt: new Date().toISOString(),
          endsAt: null,
          customerSelection: {
            all: true
          },
          customerGets: {
            value: {
              percentage: discountPercentage / 100
            },
            items: {
              all: true
            }
          },
          appliesOncePerCustomer: true
        }
      }
    });
  } catch (e) {
    throw new Error(`Error generating discount from Shopify: \n${e}`);
  }

  if (!response.body.data.discountCodeBasicCreate) {
    console.log(JSON.stringify(response.body, null, 2));
    throw new Error("Error generating discount from Shopify");
  }

  return response.body.data.discountCodeBasicCreate.codeDiscountNode.codeDiscount.codes.nodes[0].code;
};