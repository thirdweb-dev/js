# thirdweb API OpenAPI TypeScript wrapper

This package is a thin OpenAPI wrapper for the thirdweb API

## Configuration

```ts
import { configure } from "@thirdweb-dev/api";

// call this once at the startup of your application
configure({
  secretKey: "<PROJECT_SECRET_KEY>",
});
```

## Example Usage

```ts
import { writeContract } from "@thirdweb-dev/api";

const result = await writeContract({
  headers: {
    "x-secret-key": "<PROJECT-SECRET-KEY>",
  },
  body: {
    from: "0x1234567891234567891234567891234567891234",
    chainId: "1",
    calls: [
      {
        contractAddress: "0x1234567890123456789012345678901234567890",
        method: "function transfer(address to, uint256 amount)",
        params: [
          "0x1234567890123456789012345678901234567890",
          "1000000000000000000",
        ],
      },
    ],
  },
});
```

This package was autogenerated from the [thirdweb openAPI spec](https://api.thirdweb.com/reference) using [@hey-api/openapi-ts](https://github.com/hey-api/openapi-ts)
