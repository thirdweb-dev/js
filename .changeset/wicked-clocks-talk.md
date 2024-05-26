---
"thirdweb": minor
---

Adds onDisconnect callback to connect button

### Usage

```tsx
<ConnectButton
  client={THIRDWEB_CLIENT}
  onDisconnect={() => console.log("disconnect")}
  theme={theme === "light" ? "light" : "dark"}
/>
```
