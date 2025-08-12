# API Endpoint Components

This directory contains components for rendering API endpoint documentation with integrated parameter sections and collapsible accordions.

## Components

### `ApiEndpoint` (Server Component)

Renders API endpoint documentation with request/response examples and integrated parameter sections. Takes a manually constructed `ApiEndpointMeta` object. Uses the existing `Details` client component for collapsible parameter sections.

### `OpenApiEndpoint` (Server Component)

Server component that fetches and renders API endpoint documentation from an OpenAPI specification. Uses Next.js caching for 1-hour cache duration and includes built-in Suspense boundaries.

## Usage

### Using OpenApiEndpoint

```tsx
import { OpenApiEndpoint } from "@/components/Document/APIEndpointMeta";

// Basic usage with built-in Suspense
<OpenApiEndpoint
  specUrl="https://api.example.com/openapi.json"
  path="/users/{id}"
  method="GET"
/>

// Using default thirdweb API spec
<OpenApiEndpoint
  path="/v1/contracts/{chainId}/{address}/read"
  method="POST"
/>

// With custom request body override
<OpenApiEndpoint
  path="/v1/contracts/{chainId}/{address}/write"
  method="POST"
  requestBodyOverride={{
    method: "function transfer(address to, uint256 amount)",
    params: ["0x742d35Cc6634C0532925a3b8D404fddF4f2C3F00", "1000000000000000000"]
  }}
/>

// With custom response example override
<OpenApiEndpoint
  path="/v1/wallets/{address}/balance"
  method="GET"
  responseExampleOverride={{
    "200": JSON.stringify({
      balance: "1.5",
      symbol: "ETH",
      decimals: 18,
      chainId: 1
    }, null, 2),
    "404": JSON.stringify({
      error: "Wallet not found"
    }, null, 2)
  }}
/>

// With both overrides
<OpenApiEndpoint
  path="/v1/contracts/{chainId}/{address}/read"
  method="POST"
  requestBodyOverride={{
    method: "function balanceOf(address owner)",
    params: ["0x123..."]
  }}
  responseExampleOverride={{
    "200": JSON.stringify({
      result: "1000000000000000000"
    }, null, 2)
  }}
/>
```

### Using ApiEndpoint (manual)

```tsx
import { ApiEndpoint } from "@/components/Document/APIEndpointMeta";

const metadata = {
	title: "Get User",
	description: "Retrieve a user by ID",
	path: "/users/{id}",
	origin: "https://api.example.com",
	method: "GET" as const,
	request: {
		pathParameters: [
			{
				name: "id",
				required: true,
				description: "User ID",
				example: "123",
			},
		],
		headers: [],
		queryParameters: [],
		bodyParameters: [],
	},
	responseExamples: {
		"200": JSON.stringify({ id: "123", name: "John Doe" }, null, 2),
	},
};

<ApiEndpoint metadata={metadata} />;
```

## Features

- **Server-side rendering**: `OpenApiEndpoint` is a server component for better performance
- **Next.js caching**: OpenAPI specs are cached for 1 hour using Next.js `fetch` cache
- **Built-in Suspense**: Automatic loading states with Suspense boundaries
- **Request examples**: Automatically generates fetch and curl examples
- **Smart response examples**: Recursively generates examples from OpenAPI schemas when no explicit examples exist
- **Parameter extraction**: Extracts path, header, query, and body parameters from OpenAPI specs
- **Integrated parameter display**: Parameters are shown within the Request card for better organization
- **Collapsible parameter sections**: Each parameter category (Headers, Path, Query, Body) is collapsible
- **Inline parameter view**: Parameters are displayed inline with clear visual hierarchy
- **Schema-aware generation**: Handles complex nested objects, arrays, and various data types
- **Circular reference protection**: Prevents infinite recursion in self-referencing schemas
- **Format-aware examples**: Generates appropriate examples for dates, emails, URLs, etc.
- **Custom overrides**: Override request body and response examples with custom data
- **Flexible customization**: Maintain OpenAPI structure while customizing specific examples
- **Error handling**: Graceful error handling for invalid specs or missing endpoints
- **TypeScript support**: Full TypeScript support with proper type definitions

## UI/UX Improvements

### Integrated Parameter Display

Parameters are now displayed within the Request card, creating a more cohesive experience:

- Code examples appear at the top
- Parameter sections appear below the code, within the same bordered card
- Creates a single, unified Request section

### Collapsible Parameter Categories

Each parameter type is now a collapsible section:

- **Headers** - Authentication and request headers
- **Path Parameters** - URL path variables
- **Query Parameters** - URL query string parameters
- **Request Body** - POST/PUT request body parameters

Each section shows:

- Parameter count badge
- Expandable/collapsible chevron icon
- Hover effects for better interactivity

### Inline Parameter Display

When expanded, parameters are shown inline with:

- Parameter name in monospace font
- Type badge (string, number, etc.)
- Required indicator for mandatory parameters
- Description and example values
- Clean, card-based layout with proper spacing

## Custom Overrides

The component supports two optional props for customizing examples:

### `requestBodyOverride?: Record<string, any>`

Completely replaces the request body parameters extracted from the OpenAPI spec. Useful when you want to show specific examples that differ from the generic schema.

```tsx
// Override with blockchain-specific examples
<OpenApiEndpoint
	path="/v1/contracts/{chainId}/{address}/write"
	requestBodyOverride={{
		method: "function transfer(address to, uint256 amount)",
		params: [
			"0x742d35Cc6634C0532925a3b8D404fddF4f2C3F00",
			"1000000000000000000",
		],
	}}
/>
```

### `responseExampleOverride?: Record<string, string>`

Replaces the response examples with custom JSON strings. The keys should be HTTP status codes.

```tsx
// Override with custom response format
<OpenApiEndpoint
	path="/v1/wallets/{address}/balance"
	responseExampleOverride={{
		"200": JSON.stringify(
			{
				balance: "1.5",
				symbol: "ETH",
				decimals: 18,
				chainId: 1,
			},
			null,
			2,
		),
		"404": JSON.stringify(
			{
				error: "Wallet not found",
			},
			null,
			2,
		),
	}}
/>
```

## Smart Example Generation

The `generateExampleFromSchema` function intelligently creates response examples by:

1. **Using explicit examples** when available from the schema
2. **Handling all OpenAPI types**: string, number, integer, boolean, array, object, null
3. **Format-specific examples**: Generates realistic examples for date-time, email, URL formats
4. **Nested object support**: Recursively processes complex nested structures
5. **Array handling**: Creates arrays with appropriate item examples
6. **Schema composition**: Supports `allOf`, `oneOf`, `anyOf` schema patterns
7. **Circular reference detection**: Prevents infinite loops in self-referencing schemas
8. **Required vs optional properties**: Always includes required properties, selectively includes optional ones

## Architecture

- **`OpenApiEndpoint`**: Server component with built-in Suspense that fetches and transforms OpenAPI specs
- **`ApiEndpoint`**: Server component that displays the formatted endpoint documentation
- **`ParameterSection`**: Server component that wraps parameters in the existing `Details` component
- **`Details`**: Existing client component that provides collapsible accordion functionality
- **`InlineParameterItem`**: Inline parameter display with clean visual hierarchy
- **`generateExampleFromSchema`**: Recursive utility that creates realistic examples from OpenAPI schemas

The server component approach provides better performance by:

- Fetching data at build time or on the server
- Reducing client-side JavaScript bundle size
- Utilizing Next.js built-in caching mechanisms
- Enabling static generation when possible

The `Details` client component provides interactive features:

- Collapsible parameter sections with built-in accordion functionality
- Hover effects and animations
- State management for expanded/collapsed sections
- Anchor link support for deep linking
