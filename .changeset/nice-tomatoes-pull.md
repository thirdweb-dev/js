---
"@thirdweb-dev/react-core": minor
---

All Auth hooks and configuration have been upgraded along with the major upgrade to Auth. This includes changes in necessary `authConfig` to the `ThirdwebProvider`, as well as usage of the `useLogin`, `useLogout`, and `useUser` hooks.

## How to Upgrade

In order to upgrade your frontend setup to account for these changes, you'll need to make the following changes to your app:

**1. Remove `loginRedirect` from `authConfig`**

In your `ThirdwebProvider`, you can remove the `loginRedirect` option from the `authConfig` object, as the `login` endpoint no longer uses redirects.

```jsx
export default function MyApp({ Component, pageProps }) {
  return (
    <ThirdwebProvider
      authConfig={{
        domain: "example.com",
        authUrl: "/api/auth",
        // No more loginRedirect
      }}
    >
      <Component {...pageProps} />
    </ThirdwebProvider>
  );
}
```

**2. Update `useLogin` and `useLogout` to use object destructuring**

The `useLogin` and `useLogout` hooks now return an object with a `login` and `logout` function (as well as `isLoading` states), respectively. You'll need to update your usage of these hooks to use object destructuring.

```jsx
import { useLogin, useLogout } from "@thirdweb-dev/react-core";

export default function Component() {
  const { login } = useLogin();
  const { logout } = useLogout();

  return (
    <div>
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```
