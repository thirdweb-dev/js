---
"@thirdweb-dev/react": minor
---

Add Login with SMS in EmbeddedWallet

Note that by having `phone` before `email` in the options array, the phone login option will be presented first.

Use `['email', 'phone']` to have the email option presented first.

```ts
<ThirdwebProvider
    clientId={import.meta.env.VITE_TEMPLATE_CLIENT_ID}
    activeChain={activeChain}
    supportedWallets={[
    embeddedWallet({
        auth: {
        options: ["phone", "email", "apple", "google"],
        },
    }),
    ...defaultWallets,
    ]}
>
    <App />
</ThirdwebProvider>
```
