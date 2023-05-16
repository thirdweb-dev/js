---
"@thirdweb-dev/react-native": patch
---

## [ReactNative] Adds modalTitle, buttonTitle and detailsButton props to the ConnectWallet component

You can now customize the following props:

1. `buttonTitle`

The title of the ConnectWallet button which defaults to: "Connect Wallet":

```javascript
<ConnectWallet buttonTitle="Connect to claim" />
```

2. `modalTitle`

The title of the ConnectWallet modal which defaults to: "Choose your wallet":

```javascript
<ConnectWallet modalTitle="Select a wallet" />
```

3. `detailsButton`

The button that shows the details of the connected wallet. By default it shows
the chain icon, wallet balance, account address and wallet icon:

```javascript
const customDetailsButton = (
  <View>
    <Text>Connected button details</Text>
    <Text>{shortenWalletAddress(address)}</Text>
  </View>
);

<ConnectWallet detailsButton={customDetailsButton} />;
```

### Web3Button

The `buttonTitle` and `modalTitle` props are also available in the `Web3Button` config since we show a `ConnectWallet` button
if you don't have a connected wallet:

```javascript
<Web3Button
  connectWalletProps={{
    buttonTitle: "Connect to claim",
    modalTitle: "Pick a wallet",
  }}
  contractAddress="contract-address"
  action={(contract) => contract?.erc1155.claim(0, 1)}
>
  Claim Factory
</Web3Button>
```
