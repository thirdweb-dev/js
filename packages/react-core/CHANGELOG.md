# @thirdweb-dev/react-core

## 3.8.2

## 3.8.1

## 3.8.0

### Patch Changes

- [#546](https://github.com/thirdweb-dev/js/pull/546) [`440a4ad`](https://github.com/thirdweb-dev/js/commit/440a4ade95874e696c589eaa7aae9f0fecc862be) Thanks [@nachoiacovino](https://github.com/nachoiacovino)! - Add missing marketplace v3 hooks

## 3.7.4

## 3.7.3

### Patch Changes

- Updated dependencies [[`dee4596`](https://github.com/thirdweb-dev/js/commit/dee45965496d5d0298944031dd13a4345f9e1683)]:
  - @thirdweb-dev/auth@3.0.3

## 3.7.2

### Patch Changes

- Updated dependencies []:
  - @thirdweb-dev/auth@3.0.2

## 3.7.1

### Patch Changes

- [#520](https://github.com/thirdweb-dev/js/pull/520) [`8c81ca5`](https://github.com/thirdweb-dev/js/commit/8c81ca5c3033b04b1f64e3a1134a72e7e3ec03b1) Thanks [@adam-maj](https://github.com/adam-maj)! - Update auth and react-core dependencies

- Updated dependencies [[`8c81ca5`](https://github.com/thirdweb-dev/js/commit/8c81ca5c3033b04b1f64e3a1134a72e7e3ec03b1)]:
  - @thirdweb-dev/auth@3.0.1

## 3.7.0

### Minor Changes

- [#460](https://github.com/thirdweb-dev/js/pull/460) [`a6c074c`](https://github.com/thirdweb-dev/js/commit/a6c074c3f33148cd17f5a66a58df9272a4381bab) Thanks [@adam-maj](https://github.com/adam-maj)! - All Auth hooks and configuration have been upgraded along with the major upgrade to Auth. This includes changes in necessary `authConfig` to the `ThirdwebProvider`, as well as usage of the `useLogin`, `useLogout`, and `useUser` hooks.

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

- [#511](https://github.com/thirdweb-dev/js/pull/511) [`62b7388`](https://github.com/thirdweb-dev/js/commit/62b7388bb2f2564fff0c5e86f0a468db65992b4e) Thanks [@ikethirdweb](https://github.com/ikethirdweb)! - react-core init

  `react-core` package creation. The goal is to share as much code as possible between our react and future react-native packages.

### Patch Changes

- [#514](https://github.com/thirdweb-dev/js/pull/514) [`48893c7`](https://github.com/thirdweb-dev/js/commit/48893c730e565c962d117b1eca579e240dc6a5ec) Thanks [@jnsdls](https://github.com/jnsdls)! - switch to using the new `@thirdweb-dev/react-core` package to power `@thirdweb-dev/react`
