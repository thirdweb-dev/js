---
"thirdweb": minor
---

Adds LoyaltyCard extensions and support for ERC721 deployment.

```ts
import { deployERC721Contract } from "thirdweb/deploys";

const loyaltyCardContractAddress = await deployERC721Contract({
    chain: "your-chain-id", // replace with your chain ID
    client: yourThirdwebClient, // replace with your Thirdweb client instance
    account: yourAccount, // replace with your account details
    type: "LoyaltyCard",
    params: {
        name: "MyLoyaltyCard",
        symbol: "LOYAL",
        description: "A loyalty card NFT contract",
        image: "path/to/image.png", // replace with your image path
        defaultAdmin: "0xYourAdminAddress", // replace with your admin address
        royaltyRecipient: "0xYourRoyaltyRecipient", // replace with your royalty recipient address
        royaltyBps: 500n, // 5% royalty
        trustedForwarders: ["0xTrustedForwarderAddress"], // replace with your trusted forwarder addresses
        saleRecipient: "0xYourSaleRecipient", // replace with your sale recipient address
        platformFeeBps: 200n, // 2% platform fee
        platformFeeRecipient: "0xYourPlatformFeeRecipient", // replace with your platform fee recipient address
    },
});

```
