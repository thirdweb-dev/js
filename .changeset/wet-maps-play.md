---
"thirdweb": minor
---

# New `useFetchWithPayment()` React Hook

Added a new React hook that wraps the native fetch API to automatically handle 402 Payment Required responses using the x402 payment protocol.

## Features

- **Automatic Payment Handling**: Automatically detects 402 responses, creates payment headers, and retries requests
- **Built-in UI**: Shows an error modal with retry and fund wallet options when payment fails
- **Sign In Flow**: Prompts users to connect their wallet if not connected, then automatically retries the payment
- **Insufficient Funds Flow**: Integrates BuyWidget to help users top up their wallet directly in the modal
- **Customizable**: Supports theming, custom payment selectors, BuyWidget customization, and ConnectModal customization
- **Opt-out Modal**: Can disable the modal to handle errors manually

## Basic Usage

The hook automatically parses JSON responses by default.

```tsx
import { useFetchWithPayment } from "thirdweb/react";
import { createThirdwebClient } from "thirdweb";

const client = createThirdwebClient({ clientId: "your-client-id" });

function MyComponent() {
  const { fetchWithPayment, isPending } = useFetchWithPayment(client);

  const handleApiCall = async () => {
    // Response is automatically parsed as JSON by default
    const data = await fetchWithPayment(
      "https://api.example.com/paid-endpoint"
    );
    console.log(data);
  };

  return (
    <button onClick={handleApiCall} disabled={isPending}>
      {isPending ? "Loading..." : "Make Paid API Call"}
    </button>
  );
}
```

## Customize Response Parsing

By default, responses are parsed as JSON. You can customize this with the `parseAs` option:

```tsx
// Parse as text instead of JSON
const { fetchWithPayment } = useFetchWithPayment(client, {
  parseAs: "text",
});

// Or get the raw Response object
const { fetchWithPayment } = useFetchWithPayment(client, {
  parseAs: "raw",
});
```

## Customize Theme & Payment Options

```tsx
const { fetchWithPayment } = useFetchWithPayment(client, {
  maxValue: 5000000n, // 5 USDC in base units
  theme: "light",
  paymentRequirementsSelector: (requirements) => {
    // Custom logic to select preferred payment method
    return requirements[0];
  },
});
```

## Customize Fund Wallet Widget

```tsx
const { fetchWithPayment } = useFetchWithPayment(client, {
  fundWalletOptions: {
    title: "Add Funds",
    description: "You need more tokens to complete this payment",
    buttonLabel: "Get Tokens",
  },
});
```

## Customize Connect Modal

```tsx
const { fetchWithPayment } = useFetchWithPayment(client, {
  connectOptions: {
    wallets: [inAppWallet(), createWallet("io.metamask")],
    title: "Sign in to continue",
    showThirdwebBranding: false,
  },
});
```

## Disable Modal (Handle Errors Manually)

```tsx
const { fetchWithPayment, error } = useFetchWithPayment(client, {
  showErrorModal: false,
});

// Handle the error manually
if (error) {
  console.error("Payment failed:", error);
}
```
