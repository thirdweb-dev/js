---
"@thirdweb-dev/react": patch
---

- Fix Minor Safari / iOS UI issues

- Adjust Magic Link's social icons UI to match EmbeddedWallet's social icons UI

- expose hook `useEmbeddedWalletUserEmail` for fetching email from connected embeddedWallet. The hook returns the `react-query` query object. See example below:

```tsx
const emailQuery = useEmbeddedWalletUserEmail();

const email = emailQuery.data;
const isFetchingEmail = emailQuery.isFetching;
```
