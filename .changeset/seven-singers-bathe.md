---
"thirdweb": minor
---

Add option to customize ViewAssets tabs

When you click on "View Assets", by default the "Tokens" tab is shown first. If you want to show the "NFTs" tab first, set this prop to true
```tsx
<ConnectButton
  client={client}
  detailsModal={{
    swapAssetTabsPositions: true,
  }}
/>
```