---
"thirdweb": minor
---
**thirdweb/react**

Add a new optional `auth` prop to `<ConnectButton />` to allow specifying a SIWE auth flow after users connect their wallets.

```jsx
<ConnectButton
      client={client}
      auth={{
        isLoggedIn: async (address) => {
          // check if the user is logged in by calling your server, etc.
          // then return a boolean value
          return true || false;
        },
        getLoginPayload: async ({ address, chainId }) => {
          // send the address (and optional chainId) to your server to generate the login payload for the user to sign
          // you can use the `generatePayload` function from `thirdweb/auth` to generate the payload
          // once you have retrieved the payload return it from this function

          return // <the login payload here>
        },
        doLogin: async (loginParams) => {
          // send the login params to your server where you can validate them using the `verifyPayload` function
          // from `thirdweb/auth`
          // you can then set a cookie or return a token to save in local storage, etc
          // `isLoggedIn` will automatically get called again after this function resolves
        },
        doLogout: async () => {
          //  do anything you need to do such as clearing cookies, etc when the user should be logged out
          // `isLoggedIn` will automatically get called again after this function resolves
        },
      }}
    />
```
