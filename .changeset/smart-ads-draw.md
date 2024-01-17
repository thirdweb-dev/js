---
"@thirdweb-dev/react-native": patch
---

Exports standalone ConnectEmbed UI

Devs can now show the Connect modal UI directly into their apps.
This component will render the wallets defined in our ThirdwebProvider.

```tsx
<ConnectEmbed
  modalTitleIconUrl="<my-icon-url>"
  modalTitle="Sign In"
  theme={"light"}
  onConnect={() => {
    console.log("wallet connected");
  }}
  container={{
    paddingVertical: "md",
    marginHorizontal: "md",
    borderRadius: "md",
  }}
/>
```
