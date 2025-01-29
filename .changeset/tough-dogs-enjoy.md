---
"thirdweb": minor
---

Support Account and Wallet headless components in react native

You can now use the Account and Wallet headless components in react native, this lets you build your own UI, styling it however you want, but letting the components handle the logic.

Example Account components usage:

```tsx
<AccountProvider address={account.address} client={client}>
  /* avatar */
  <AccountAvatar
    loadingComponent={
      <AccountBlobbie size={92} style={{ borderRadius: 100 }} />
    }
    fallbackComponent={
      <AccountBlobbie size={92} style={{ borderRadius: 100 }} />
    }
    style={{
      width: 92,
      height: 92,
      borderRadius: 100,
    }}
  />
  /* address */
  <AccountAddress
    style={{ fontSize: 16, color: Colors.secondary }}
    formatFn={shortenAddress}
  />
  /* balance */
  <AccountBalance
    showBalanceInFiat={"USD"}
    chain={chain}
    loadingComponent={<ActivityIndicator size="large" color={Colors.accent} />}
    fallbackComponent={
      <Text className="text-primary">Failed to load balance</Text>
    }
    style={{
      color: "white",
      fontSize: 48,
      fontWeight: "bold",
    }}
  />
</AccountProvider>
```

Example Wallet components usage:

```tsx
<WalletProvider id={"io.metamask"}>
  <WalletIcon width={32} height={32} />
  <WalletName style={{ fontSize: 16, color: Colors.primary }} />
</WalletProvider>
```
