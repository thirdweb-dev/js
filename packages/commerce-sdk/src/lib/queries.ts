export const GET_ORDER_BY_ID_QUERY = `#graphql
  query getOrderById($id: ID!) {
    order(id: $id) {
      id
      tags
      lineItems(first: 10) {
        edges {
          node {
            id
            quantity
            variant {
              id
              product {
                id
                title
                description
                featuredImage {
                  id
                  url
                }
              }
            }
            customAttributes {
              key
              value
            }
          }
        }
      }
    }
  }
`;

export const GENERATE_BASIC_DISCOUNT_MUTATION = `#graphql
mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
  discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
    codeDiscountNode {
      codeDiscount {
        ... on DiscountCodeBasic {
          title
          codes(first: 10) {
            nodes {
              code
            }
          }
          startsAt
          endsAt
          customerSelection {
            ... on DiscountCustomerAll {
              allCustomers
            }
          }
          customerGets {
            value {
              ... on DiscountPercentage {
                percentage
              }
            }
            items {
              ... on AllDiscountItems {
                allItems
              }
            }
          }
          appliesOncePerCustomer
        }
      }
    }
    userErrors {
      field
      code
      message
    }
  }
}
`
;