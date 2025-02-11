# @thirdweb-dev/aws-kms-wallet

This package provides AWS KMS wallet functionality for thirdweb SDK.

## Installation

```bash
npm install @thirdweb-dev/aws-kms-wallet
```

## Usage

```typescript
import { getAwsKmsAccount } from "@thirdweb-dev/aws-kms-wallet";
import { ThirdwebClient } from "thirdweb";

const client = new ThirdwebClient({
  // your client config
});

const account = await getAwsKmsAccount({
  keyId: "your-kms-key-id",
  config: {
    // your AWS KMS config
    region: "us-east-1",
  },
  client,
});

// Use the account for transactions, signing messages, etc.
const tx = await account.sendTransaction({
  // transaction details
});
```

## Requirements

- Node.js 18+
- AWS KMS key with ECC_SECG_P256K1 key spec
- AWS credentials configured in your environment

## License

Apache-2.0
