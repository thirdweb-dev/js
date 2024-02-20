---
"@thirdweb-dev/react": patch
---

Add `hideSendButton` and `hideReceiveButton` props to `ConnectWallet` component to hide the send and receive buttons in ConnectWallet's Details Modal

```tsx
// hide both buttons
<ConnectWallet hideSendButton={true} hideReceiveButton={true} />
```

```tsx
// hide only send button
<ConnectWallet hideSendButton={true} />
```

```tsx
// hide only receive button
<ConnectWallet hideReceiveButton={true} />
```
