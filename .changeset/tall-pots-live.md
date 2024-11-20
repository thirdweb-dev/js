---
"thirdweb": minor
---

# Breaking change

We are making the following changes to the NFT component to provide better performance and fine-grain control over their internal fetching logic.
Moreover, you no longer have to wrap React.Suspense around said components!

### Old

```tsx
<NFT>
  <React.Suspense fallback={"Loading stuff..."}>
    <NFT.Media />
    <NFT.Name />
    <NFT.Description />
  </React.Suspense>
</NFT>
```

### New

The new version comes with 2 new props: `loadingComponent` and `fallbackComponent`.
Basically, `loadingComponent` takes in a component and show it _while the internal fetching is being done_
`fallbackComponent` takes in a component and show it _once the data is failed to be resolved_

```tsx
<NFTProvider contract={contract} tokenId={0n}>
    <NFTMedia
      loadingComponent={<span>Loading NFT Image</span>}
      fallbackComponent={<span>Failed to load NFT</span>}
    />
    <NFTDescription
      loadingComponent={<span>Loading NFT Description</span>}
      fallbackComponent={<span>Failed to load NFT Description</span>}
    />
</NFT>
```
