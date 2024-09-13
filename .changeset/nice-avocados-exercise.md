---
"thirdweb": patch
---

Add `auth` option to enforce SIWE authentication after wallet connection on `useConnectModal` hook

```tsx
function Example() {
  const { connect } = useConnectModal();
  return (
    <button
      type="button"
      onClick={async () => {
        const wallet = await connect({
          client: yourClient,
          auth: yourAuth,
        });

        console.log("connected + Signed in with:", wallet);
      }}
    >
      Connect + Sign in
    </button>
  );
}
```

Allow making the Connect Modal non-dismissible by settings `dismisable: false` on `useConnectModal` hook. This acts as a sign-in/connect gate to prevent users from interacting with the app without connecting and/or signing in.

```tsx
function Example() {
  const { connect } = useConnectModal();
  return (
    <button
      type="button"
      onClick={async () => {
        const wallet = await connect({
          client: yourClient,
          auth: yourAuth,
          dismissible: false,
        });

        console.log("connected + Signed in with:", wallet);
      }}
    >
      Connect + Sign in
    </button>
  );
}
```
