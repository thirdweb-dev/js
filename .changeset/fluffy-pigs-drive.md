---
"thirdweb": minor
---

Enhanced SDK Bridge functionality with the following key updates:

1. **Breaking Change:** Standardized parameter naming in bridge functions:
   - Changed `buyAmountWei` to `amount` in Buy functions
   - Changed `sellAmountWei` to `amount` in Sell functions
   
   Example:
   ```ts
   // Before
   const buyQuote = await buy.quote({
     originChainId: 1,
     originTokenAddress: NATIVE_TOKEN_ADDRESS,
     destinationChainId: 10,
     destinationTokenAddress: NATIVE_TOKEN_ADDRESS,
     buyAmountWei: toWei("0.01"),
     client: thirdwebClient,
   });
   
   // After
   const buyQuote = await buy.quote({
     originChainId: 1,
     originTokenAddress: NATIVE_TOKEN_ADDRESS,
     destinationChainId: 10,
     destinationTokenAddress: NATIVE_TOKEN_ADDRESS,
     amount: toWei("0.01"),
     client: thirdwebClient,
   });
   ```

2. **Enhanced Quote Structure:** Added `steps` array to buy/sell quote responses with detailed token information:
   ```ts
   // Steps contains detailed information about each step in a cross-chain transaction
   steps: [
     {
       originToken: {
         chainId: 1,
         address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
         symbol: "ETH",
         name: "Ethereum",
         decimals: 18,
         priceUsd: 2000,
         iconUri: "https://..."
       },
       destinationToken: {
         chainId: 10,
         address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
         symbol: "ETH",
         name: "Ethereum",
         decimals: 18,
         priceUsd: 2000,
         iconUri: "https://..."
       },
       originAmount: 1000000000000000000n,
       destinationAmount: 9980000000000000000n,
       estimatedExecutionTimeMs: 1000,
       transactions: [/* transactions for this step */]
     }
   ]
   ```

3. **Added Purchase Data Support:** Added optional `purchaseData` parameter to Buy and Sell functions:
   ```ts
   // Example with purchaseData
   const quote = await buy.prepare({
     originChainId: 1,
     originTokenAddress: NATIVE_TOKEN_ADDRESS,
     destinationChainId: 10,
     destinationTokenAddress: NATIVE_TOKEN_ADDRESS,
     amount: toWei("0.01"),
     sender: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
     receiver: "0x2a4f24F935Eb178e3e7BA9B53A5Ee6d8407C0709",
     purchaseData: {
       foo: "bar",
     },
     client: thirdwebClient,
   });
   ```

4. **Enhanced Status Responses:** Status responses now include the `purchaseData` field that was provided during the initial transaction:
   ```ts
   // Status response includes purchaseData
   {
     status: "COMPLETED",
     // ...other status fields
     purchaseData: {
       foo: "bar"
     }
   }
   ```

5. **Updated API Interactions:** Changed from query parameters to JSON body for prepare functions to accommodate complex data.