---
"@thirdweb-dev/react": patch
---

- New USER_MANAGED recovery flow added to `embeddedWallet` which is enabled if you configure the `clientId` to use `USER_MANAGED` recovery

- API to configure Oauth on `embeddedWallet` and `paperWallet` added

```ts
// default - google sign in is enabled
embeddedWallet();

// this is same as
embeddedWallet({
  oauthOptions: {
    providers: ["google"],
  },
});

// disable google sign in
embeddedWallet({
  oauthOptions: false,
});
```

```ts
// default - google sign in is enabled
paperWallet();

// this is same as
paperWallet({
  oauthOptions: {
    providers: ["google"],
  },
});

// disable google sign in
paperWallet({
  oauthOptions: false,
});

// Using USER_MANAGED recovery also disables google sign in
paperWallet({
  advancedOptions: {
    recoveryShareManagement: "USER_MANAGED",
  },
});
```
