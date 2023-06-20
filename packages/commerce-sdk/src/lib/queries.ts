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