---
"@thirdweb-dev/react-core": patch
---

Add `useCreateSessionKey` and `useRevokeSessionKey` hooks

```
const Component = () => {
    const {
      mutate: createSessionKey,
      isLoading,
      error,
    } = useCreateSessionKey();

    if (error) {
      console.error("failed to create session key", error);
    }

    return (
      <button
        disabled={isLoading}
        onClick={() => createSessionKey(
          "0x...",
          {
            approvedCallTargets: ["0x..."], // the addresses of contracts that the session key can call
            nativeTokenLimitPerTransaction: 0.1, // the maximum amount of native token (in ETH) that the session key can spend per transaction
            startDate: new Date(), // the date when the session key becomes active
            expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // the date when the session key expires
          }
         )}
      >
        Create Session Key
      </button>
    );
};
```
