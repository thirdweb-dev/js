## Installation

```bash
npm install thirdweb
```

## Usage

```typescript
// Import everything
import { Login } from "thirdweb";

// Or import specific parts
import { login, createAuthHandler } from "thirdweb";
```

## Client-Side Authentication

The client-side authentication system provides methods for handling user authentication in the browser.

### Basic Usage

```typescript
import { Login } from "thirdweb/login";

// Email login
const result = await Login.Client.login({
  type: "email",
  email: "user@example.com",
  client: thirdwebClient,
});

// Handle OTP verification
if (result.status === "requires_otp") {
  const account = await result.verifyOtp("123456");
}

// Phone login
const result = await Login.Client.login({
  type: "phone",
  phoneNumber: "+1234567890",
  client: thirdwebClient,
});

// Wallet login
const result = await Login.Client.login({
  type: "wallet",
  wallet: userWallet,
  chain: selectedChain,
  client: thirdwebClient,
});

// JWT login
const result = await Login.Client.login({
  type: "jwt",
  jwt: "your-jwt-token",
  client: thirdwebClient,
});
```

### Authentication Options

```typescript
type LoginOptions = {
  client: ThirdwebClient;
  options?: {
    sponsorGas?: boolean;      // Enable gas sponsorship
    redirectUrl?: string;      // Custom redirect URL
    passkeyDomain?: string;    // Domain for passkey authentication
    storage?: AsyncStorage;    // Custom storage implementation
  };
  baseURL?: string;           // Base URL for your authentication server
};
```

### Authenticated Account Features

Once authenticated, you get access to the following features:

```typescript
const account = await Login.Client.login({...});

// Get JWT token
const jwt = await account.getJWT();

// Send a transaction
await account.sendTransaction(transaction);

// Send batch transactions
await account.sendBatchTransaction([transaction1, transaction2]);

// Sign messages
await account.signMessage(message);

// Sign typed data
await account.signTypedData(typedData);

// Logout
await account.logout();
```

## Server-Side Authentication

The server-side authentication system provides utilities for handling authentication on the server.

### Basic Setup

```typescript
import { Login } from "thirdweb/login";

// Initialize the server-side authentication handler
const authHandler = Login.Server.createAuthHandler({
  // Your configuration options
});
```

### Framework Integrations

The package provides built-in integrations for popular frameworks:

```typescript
import { Login } from "thirdweb/login";

// Express.js integration
app.all("/api/auth/*", Login.Server.toNodeHandler(authHandler));

// Next.js integration
// /app/api/auth/[...all]/route.ts
export const { GET, POST } = Login.Server.toNextJsHandler(authHandler);


// Hono integration
import { Hono } from "hono";
import { serve } from "@hono/node-server"
 
const app = new Hono();
 
app.on(["GET", "POST"], "/api/auth/**", (c) => authHandler.handler(c.req.raw));
 
serve(app);
```

### Required Endpoints

The server implements the following endpoints:

1. `/api/auth/payload` - Generate authentication payload
2. `/api/auth/login` - Handle login requests
3. `/api/auth/logout` - Handle logout requests
4. `/api/auth/is-logged-in` - Verify authentication status

(You can change the base path (`/api/auth`) by passing the `basePath` option to the `createAuthHandler` function.)

### Server-Side Features

- JWT validation and generation
- Session management
- Authentication state verification
- Secure token storage
- Rate limiting support
- Framework integrations

## Security Considerations

- JWT tokens are automatically refreshed when expired
- Sensitive operations require proper authentication
- Session management is handled securely
- Gas sponsorship can be enabled for better UX

## Best Practices

1. Always use HTTPS for authentication endpoints
2. Implement proper error handling
3. Use secure storage for sensitive data
4. Implement rate limiting for authentication attempts
5. Keep JWT tokens secure and handle them properly

## Error Handling

The login system provides detailed error messages for various scenarios:
- Invalid credentials
- Expired tokens
- Network issues
- Invalid authentication methods

## TypeScript Support

Full TypeScript support is included with proper type definitions for all authentication methods and responses.

## API Reference

### Client Exports

- `login(options: LoginOptions)`: Initiates the login process
- `LoginParams`: Type definition for login options

### Server Exports

- `createAuthHandler(options: CreateAuthHandlerOptions)`: Creates an authentication handler
- `toNodeHandler(handler)`: Converts auth handler to be used in Node.js servers (e.g. Express, Fastify, etc.)
- `toNextJsHandler(handler)`: Converts auth handler to Next.js API route handler
