---
"thirdweb": minor
---

Enhanced Engine functionality with server wallet management, search transactions and batch transaction support:

- Added `Engine.createServerWallet()` to create a new server wallet with a custom label

  ```ts
  import { Engine } from "thirdweb";

  const serverWallet = await Engine.createServerWallet({
    client,
    label: "My Server Wallet",
  });
  console.log(serverWallet.address);
  console.log(serverWallet.smartAccountAddress);
  ```

- Added `Engine.getServerWallets()` to list all existing server wallets

  ```ts
  import { Engine } from "thirdweb";

  const serverWallets = await Engine.getServerWallets({
    client,
  });
  console.log(serverWallets);
  ```

- Added `Engine.searchTransactions()` to search for transactions by various filters (id, chainId, from address, etc.)

  ```ts
  // Search by transaction IDs
  const transactions = await Engine.searchTransactions({
    client,
    filters: [
      {
        field: "id",
        values: ["1", "2", "3"],
      },
    ],
  });

  // Search by chain ID and sender address
  const transactions = await Engine.searchTransactions({
    client,
    filters: [
      {
        filters: [
          {
            field: "from",
            values: ["0x1234567890123456789012345678901234567890"],
          },
          {
            field: "chainId",
            values: ["8453"],
          },
        ],
        operation: "AND",
      },
    ],
    pageSize: 100,
    page: 0,
  });
  ```

- Added `serverWallet.enqueueBatchTransaction()` to enqueue multiple transactions in a single batch

  ```ts
  // Prepare multiple transactions
  const transaction1 = claimTo({
    contract,
    to: firstRecipient,
    quantity: 1n,
  });
  const transaction2 = claimTo({
    contract,
    to: secondRecipient,
    quantity: 1n,
  });

  // Enqueue as a batch
  const { transactionId } = await serverWallet.enqueueBatchTransaction({
    transactions: [transaction1, transaction2],
  });

  // Wait for batch completion
  const { transactionHash } = await Engine.waitForTransactionHash({
    client,
    transactionId,
  });
  ```

- Improved server wallet transaction handling with better error reporting
