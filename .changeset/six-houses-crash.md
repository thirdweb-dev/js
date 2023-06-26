---
"@thirdweb-dev/react-native": patch
---

[ReactNative] Export more components for easy development

- IconTextButton
  Component that renders an icon and a text inside a button with border:

```javascript
<IconTextButton
  mt="xs"
  text="Switch Accounts"
  icon={<SwitchIcon height={10} width={10} />}
  onPress={() => {}}
/>
```

- NetworkButton: Used to render a Network

```javascript
<NetworkButton
  chainIconUrl={chain?.icon?.url || ""}
  chainName={chain?.name || "Unknown Network"}
  onPress={onChangeNetworkPress}
/>
```

- Exported all icons from the assets folder for external use
