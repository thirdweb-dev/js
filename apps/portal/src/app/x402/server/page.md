import {
	Tabs,
	TabsList,
	TabsTrigger,
	TabsContent,
	DocImage,
	createMetadata,
	Stack,
	GithubTemplateCard,
} from "@doc";
import { Steps, Step } from "@doc";
import PaymentFlow from "./x402-protocol-flow.png";

export const metadata = createMetadata({
	image: {
		title: "x402 Server",
		icon: "payments",
	},
	title: "x402 Server",
	description:
		"Accept x402 payments in your APIs from any x402-compatible client.",
});

# Server Side

Accept x402 payments in your APIs using any x402-compatible client. Your server can verify and settle payments using thirdweb's facilitator service or any custom facilitator.

## Payment Flow

The x402 protocol follows this flow:

<DocImage src={PaymentFlow} alt="x402 Protocol Flow" />

1. **Client Request** - Client makes a request to your API
2. **Payment Required** - Server responds with 402 and payment requirements
3. **Client Signs** - Client signs payment authorization
4. **Paid Request** - Client retries with payment header
5. **Verify & Settle** - Server verifies and settles the payment
6. **Success** - Server returns the protected content

## Exact vs Upto Payment Schemes

The thirdweb x402 client/server stack supports two payment schemes: `exact` and `upto`.

- `exact` - The client pays the exact amount specified in the payment requirements.
- `upto` - The client pays any amount up to the specified maximum amount.

By default, the payment scheme is `exact`. You can specify the payment scheme in the `settlePayment()` or `verifyPayment()` arguments.

### Exact Payment Scheme

Use `settlePayment()` to verify and settle the payment in one step. This is the default and simplest approach:

```typescript
const result = await settlePayment({
	resourceUrl: "https://api.example.com/premium-content",
	method: "GET",
	paymentData,
	payTo: "0x1234567890123456789012345678901234567890",
	network: arbitrum,
	price: "$0.10",
	facilitator: thirdwebFacilitator,
});

if (result.status === 200) {
	// Payment settled, do the paid work
	return Response.json({ data: "premium content" });
}
```

### Upto Payment Scheme

With the `upto` payment scheme, you can charge only what the client actually uses, and can also settle multiple times up to the authorized maximum amount. Use `verifyPayment()` first to verify the payment is valid for the maximum amount, do the work, then `settlePayment()`:

- Ensures the payment for the maximum amount is valid before doing the expensive work
- The final price can be dynamic based on the work performed
- The payment authorization is valid for the maximum amount, until expiration
- The merchant can settle multiple times up to the authorized maximum amount using the same signed payment payload

This is great for AI apis that need to charge based on the token usage for example. For a fully working example check out [this x402 ai inference example](https://github.com/thirdweb-example/x402-ai-inference).

<Stack>
	<GithubTemplateCard
		title="x402 AI Inference Example"
		description="A fully working example of charging for AI inference with x402"
		href="https://github.com/thirdweb-example/x402-ai-inference"
	/>
</Stack>

Here's a high level example of how to use the `upto` payment scheme with a dynamic price based on the token usage. First we verify the payment is valid for the max payable amount and then settle the payment based on the actual usage.

```typescript
const paymentArgs = {
	resourceUrl: "https://api.example.com/premium-content",
	method: "GET",
	paymentData,
	payTo: "0x1234567890123456789012345678901234567890",
	network: arbitrum,
	scheme: "upto", // enables dynamic pricing
	price: "$0.10", // max payable amount
	minPrice: "$0.01", // min payable amount
	facilitator: thirdwebFacilitator,
};

// First verify the payment is valid for the max amount
const verifyResult = await verifyPayment(paymentArgs);

if (verifyResult.status !== 200) {
	return Response.json(verifyResult.responseBody, {
		status: verifyResult.status,
		headers: verifyResult.responseHeaders,
	});
}

// Do the expensive work that requires payment
const { answer, tokensUsed } = await callExpensiveAIModel();

// Now settle the payment based on actual usage
const pricePerTokenUsed = 0.00001; // ex: $0.00001 per AI model token used
const settleResult = await settlePayment({
	...paymentArgs,
	price: tokensUsed * pricePerTokenUsed, // adjust final price based on usage
});

return Response.json(answer);
```

You can call verifyPayment() and settlePayment() multiple times using the same paymentData, as long as its still valid. `verifyPayment()` will check that:
 - Allowance is still valid and greater than the min payable amount
 - Balance is still valid and greater than the min payable amount
 - Payment is still valid for the expiration time.

 If any of these checks fail, `verifyPayment()` will return a 402 response requiring a new payment authorization.

`wrapFetchWithPayment()` and `useFetchWithPayment()` will automatically handle the caching and re-use of the payment data for you, so you don't need to have any additional state or storage on the backend.

## Signature expiration configuration

You can configure the expiration of the payment signature in the `routeConfig` parameter of the `settlePayment()` or `verifyPayment()` functions.

```typescript
const result = await verifyPayment({
	...paymentArgs,
	routeConfig: {
		maxTimeoutSeconds: 60 * 60 * 24, // 24 hours
	},
});
```

## Price and Token Configuration

You can specify prices in multiple ways:

### USD String

This will default to using USDC on the specified network.

```typescript
network: polygon, // or any other EVM chain
price: "$0.10" // 10 cents in USDC
```

### ERC20 Token

You can use any ERC20 token that supports the ERC-2612 permit or ERC-3009 sign with authorization.

Simply pass the amount in base units and the token address.

```typescript
const result = await settlePayment({
	...paymentArgs,
	network: arbitrum,
	price: {
		amount: "1000000000000000", // Amount in base units (0.001 tokens with 18 decimals)
		asset: {
			address: "0xf01E52B0BAC3E147f6CAf956a64586865A0aA928", // Token address
		},
	},
});
```

### Native Token

Payments in native tokens are not currently supported.

## Dedicated Endpoint Examples

Protect individual API endpoints with x402 payments:

<Tabs defaultValue="nextjs">
  <TabsList>
    <TabsTrigger value="nextjs">Next.js</TabsTrigger>
    <TabsTrigger value="express">Express</TabsTrigger>
    <TabsTrigger value="hono">Hono</TabsTrigger>
  </TabsList>

  <TabsContent value="nextjs">
    ```typescript
    // app/api/premium-content/route.ts
    import { settlePayment, facilitator } from "thirdweb/x402";
    import { createThirdwebClient } from "thirdweb";
    import { arbitrumSepolia } from "thirdweb/chains";

    const client = createThirdwebClient({
      secretKey: process.env.THIRDWEB_SECRET_KEY,
    });

    const thirdwebFacilitator = facilitator({
      client,
      serverWalletAddress: "0x1234567890123456789012345678901234567890",
    });

    export async function GET(request: Request) {
      const paymentData = request.headers.get("PAYMENT-SIGNATURE") || request.headers.get("X-PAYMENT");

      // Verify and process the payment
      const result = await settlePayment({
        resourceUrl: "https://api.example.com/premium-content",
        method: "GET",
        paymentData,
        payTo: "0x1234567890123456789012345678901234567890",
        network: arbitrumSepolia,
        price: "$0.10", // or { amount: "100000", asset: { address: "0x...", decimals: 6 } }
        facilitator: thirdwebFacilitator,
        routeConfig: {
          description: "Access to premium API content",
          mimeType: "application/json",
          maxTimeoutSeconds: 60 * 60, // 1 hour signature expiration
        },
      });

      if (result.status === 200) {
        // Payment verified and settled successfully
        return Response.json({ data: "premium content" });
      } else {
        // Payment required
        return Response.json(result.responseBody, {
          status: result.status,
          headers: result.responseHeaders,
        });
      }
    }
    ```

  </TabsContent>

  <TabsContent value="express">
    ```typescript
    // server.ts
    import express from "express";
    import { settlePayment, facilitator } from "thirdweb/x402";
    import { createThirdwebClient } from "thirdweb";
    import { arbitrumSepolia } from "thirdweb/chains";

    const client = createThirdwebClient({
      secretKey: process.env.THIRDWEB_SECRET_KEY,
    });

    const thirdwebFacilitator = facilitator({
      client,
      serverWalletAddress: "0x1234567890123456789012345678901234567890",
    });

    const app = express();

    app.get("/api/premium", async (req, res) => {
      const result = await settlePayment({
        resourceUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
        method: req.method,
        paymentData: req.headers["x-payment"],
        payTo: "0x1234567890123456789012345678901234567890",
        network: arbitrumSepolia,
        price: "$0.05",
        facilitator: thirdwebFacilitator,
        routeConfig: {
          description: "Access to premium content",
          mimeType: "application/json",
          maxTimeoutSeconds: 60 * 60, // 1 hour signature expiration
        },
      });

      if (result.status === 200) {
        // Set payment receipt headers
        Object.entries(result.responseHeaders).forEach(([key, value]) => {
          res.setHeader(key, value);
        });
        res.json({ message: "This is premium content!" });
      } else {
        res.status(result.status)
           .set(result.responseHeaders)
           .json(result.responseBody);
      }
    });

    app.listen(3000);
    ```

  </TabsContent>

  <TabsContent value="hono">
    ```typescript
    // server.ts
    import { Hono } from "hono";
    import { settlePayment, facilitator } from "thirdweb/x402";
    import { createThirdwebClient } from "thirdweb";
    import { arbitrumSepolia } from "thirdweb/chains";

    const client = createThirdwebClient({
      secretKey: process.env.THIRDWEB_SECRET_KEY,
    });

    const thirdwebFacilitator = facilitator({
      client,
      serverWalletAddress: "0x1234567890123456789012345678901234567890",
    });

    const app = new Hono();

    app.get("/api/premium", async (c) => {
      const result = await settlePayment({
        resourceUrl: new URL(c.req.url).toString(),
        method: c.req.method,
        paymentData: c.req.header("x-payment"),
        payTo: "0x1234567890123456789012345678901234567890",
        network: arbitrumSepolia,
        price: "$0.05",
        facilitator: thirdwebFacilitator,
        routeConfig: {
          description: "Access to premium content",
          mimeType: "application/json",
          maxTimeoutSeconds: 60 * 60, // 1 hour signature expiration
        },
      });

      if (result.status === 200) {
        return c.json(
          { message: "This is premium content!" },
          { headers: result.responseHeaders }
        );
      } else {
        return c.json(result.responseBody, {
          status: result.status,
          headers: result.responseHeaders,
        });
      }
    });

    export default app;
    ```

  </TabsContent>
</Tabs>

## Middleware Examples

Protect multiple endpoints with a shared middleware:

<Tabs defaultValue="nextjs">
  <TabsList>
    <TabsTrigger value="nextjs">Next.js</TabsTrigger>
    <TabsTrigger value="express">Express</TabsTrigger>
    <TabsTrigger value="hono">Hono</TabsTrigger>
  </TabsList>

  <TabsContent value="nextjs">
    ```typescript
    // middleware.ts
    import { NextResponse } from "next/server";
    import type { NextRequest } from "next/server";
    import { settlePayment, facilitator } from "thirdweb/x402";
    import { createThirdwebClient } from "thirdweb";
    import { arbitrumSepolia } from "thirdweb/chains";

    const client = createThirdwebClient({
      secretKey: process.env.THIRDWEB_SECRET_KEY,
    });

    const thirdwebFacilitator = facilitator({
      client,
      serverWalletAddress: "0x1234567890123456789012345678901234567890",
    });

    export async function middleware(request: NextRequest) {
      const method = request.method.toUpperCase();
      const resourceUrl = request.nextUrl.toString();
      const paymentData = request.headers.get("PAYMENT-SIGNATURE") || request.headers.get("X-PAYMENT");

      const result = await settlePayment({
        resourceUrl,
        method,
        paymentData,
        payTo: "0x1234567890123456789012345678901234567890",
        network: arbitrumSepolia,
        price: "$0.01",
        routeConfig: {
          description: "Access to paid content",
          mimeType: "application/json",
          maxTimeoutSeconds: 60 * 60, // 1 hour signature expiration
        },
        facilitator: thirdwebFacilitator,
      });

      if (result.status === 200) {
        // Payment successful, continue to the route
        const response = NextResponse.next();
        // Set payment receipt headers
        for (const [key, value] of Object.entries(result.responseHeaders)) {
          response.headers.set(key, value);
        }
        return response;
      }

      // Payment required
      return NextResponse.json(result.responseBody, {
        status: result.status,
        headers: result.responseHeaders,
      });
    }

    // Configure which paths the middleware should run on
    export const config = {
      matcher: ["/api/paid/:path*"],
    };
    ```

  </TabsContent>

  <TabsContent value="express">
    ```typescript
    // middleware.ts
    import { settlePayment, facilitator } from "thirdweb/x402";
    import { createThirdwebClient } from "thirdweb";
    import { arbitrumSepolia } from "thirdweb/chains";

    const client = createThirdwebClient({
      secretKey: process.env.THIRDWEB_SECRET_KEY,
    });

    const thirdwebFacilitator = facilitator({
      client,
      serverWalletAddress: "0x1234567890123456789012345678901234567890",
    });

    export async function paymentMiddleware(req, res, next) {
      const result = await settlePayment({
        resourceUrl: `${req.protocol}://${req.get('host')}${req.originalUrl}`,
        method: req.method,
        paymentData: req.headers["x-payment"],
        payTo: "0x1234567890123456789012345678901234567890",
        network: arbitrumSepolia,
        price: "$0.05",
        facilitator: thirdwebFacilitator,
        routeConfig: {
          description: "Access to paid content",
          mimeType: "application/json",
          maxTimeoutSeconds: 60 * 60, // 1 hour signature expiration
        },
      });

      if (result.status === 200) {
        // Set payment receipt headers and continue
        Object.entries(result.responseHeaders).forEach(([key, value]) => {
          res.setHeader(key, value);
        });
        next();
      } else {
        // Return payment required response
        res.status(result.status)
           .set(result.responseHeaders)
           .json(result.responseBody);
      }
    }

    // Usage
    app.get("/api/premium", paymentMiddleware, (req, res) => {
      res.json({ message: "This is premium content!" });
    });
    ```

  </TabsContent>

  <TabsContent value="hono">
    ```typescript
    // middleware.ts
    import type { Context, Next } from "hono";
    import { settlePayment, facilitator } from "thirdweb/x402";
    import { createThirdwebClient } from "thirdweb";
    import { arbitrumSepolia } from "thirdweb/chains";

    const client = createThirdwebClient({
      secretKey: process.env.THIRDWEB_SECRET_KEY,
    });

    const thirdwebFacilitator = facilitator({
      client,
      serverWalletAddress: "0x1234567890123456789012345678901234567890",
    });

    export async function paymentMiddleware(c: Context, next: Next) {
      const result = await settlePayment({
        resourceUrl: new URL(c.req.url).toString(),
        method: c.req.method,
        paymentData: c.req.header("x-payment"),
        payTo: "0x1234567890123456789012345678901234567890",
        network: arbitrumSepolia,
        price: "$0.05",
        facilitator: thirdwebFacilitator,
        routeConfig: {
          description: "Access to paid content",
          mimeType: "application/json",
          maxTimeoutSeconds: 60 * 60, // 1 hour signature expiration
        },
      });

      if (result.status === 200) {
        // Set payment receipt headers and continue
        Object.entries(result.responseHeaders).forEach(([key, value]) => {
          c.header(key, value);
        });
        await next();
      } else {
        return c.json(result.responseBody, {
          status: result.status,
          headers: result.responseHeaders,
        });
      }
    }

    // Usage
    app.get("/api/premium", paymentMiddleware, (c) => {
      return c.json({ message: "This is premium content!" });
    });
    ```

  </TabsContent>
</Tabs>
