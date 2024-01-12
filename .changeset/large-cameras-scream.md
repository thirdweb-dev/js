---
"@thirdweb-dev/react": patch
---

Add `onConnect` prop to `ConnectWallet` and `ConnectEmbed` components.

```tsx
<ConnectWallet
  onConnect={() => {
    console.log("connected");
  }}
/>
```

```tsx
<ConnectEmbed
  onConnect={() => {
    console.log("connected");
  }}
/>
```
