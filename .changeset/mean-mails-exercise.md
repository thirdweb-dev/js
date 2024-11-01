---
"thirdweb": minor
---

Allow to customize the display order of Asset tabs

When you click on "View Assets", by default the "Tokens" tab is shown first. 

If you want to show the "NFTs" tab first, change the order of the asset tabs to: ["nft", "token"]

Note: If an empty array is passed, the [View Funds] button will be hidden

```tsx
<ConnectButton
  client={client}
  detailsModal={{
    assetTabs: ["nft", "token"],
  }}
/>
```