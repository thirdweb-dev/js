# TokenSelector Component Port

This document describes the porting of the TokenSelector component from `apps/dashboard` to `apps/playground-web`.

## Components Ported

### 1. Types (`src/lib/types.ts`)
- `TokenMetadata` - Type definition for token metadata from bridge API
- `ChainMetadata` - Type definition for chain metadata from chains API

### 2. Hooks

#### `src/hooks/useAllChainsData.ts`
- Fetches chain data from `api.thirdweb.com/chains`
- Uses `x-client-id` header with `NEXT_PUBLIC_THIRDWEB_CLIENT_ID`
- Returns maps for efficient chain lookups by ID, name, and slug

#### `src/hooks/useTokensData.ts`
- Fetches token data from `bridge.thirdweb.com/tokens`
- Uses `x-client-id` header with `NEXT_PUBLIC_THIRDWEB_CLIENT_ID`
- Supports filtering by chain ID
- Configurable enable/disable state

### 3. UI Components

#### `src/components/ui/select-with-search.tsx`
- Search-enabled select component
- Custom search function support
- Custom option rendering
- Based on Radix UI Popover and Shadcn components

#### `src/components/ui/TokenSelector.tsx`
- Main TokenSelector component
- Integrates with chains and tokens hooks
- Shows token icons, symbols, and addresses
- Supports native token injection
- Uses existing Shadcn Select for now (can be upgraded to SelectWithSearch)

### 4. Utilities (`src/lib/utils.ts`)
- `replaceIpfsUrl()` - Converts IPFS URLs to HTTP gateway URLs
- `fallbackChainIcon` - Default chain icon as base64 SVG

### 5. Demo Page (`src/app/token-selector-demo/page.tsx`)
- Example usage of TokenSelector component
- Chain selection integration
- Shows selected token details

## API Integration

### Environment Variables Required
```env
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=your_client_id_here
```

### API Endpoints Used

1. **Chains API**: `https://api.thirdweb.com/v1/chains`
   - Headers: `x-client-id: ${NEXT_PUBLIC_THIRDWEB_CLIENT_ID}`
   - Returns: Array of chain metadata

2. **Tokens API**: `https://bridge.thirdweb.com/v1/tokens`
   - Headers: `x-client-id: ${NEXT_PUBLIC_THIRDWEB_CLIENT_ID}`
   - Query params: `chainId` (optional), `limit=1000`
   - Returns: Array of token metadata

## Current Status

✅ **Completed:**
- Type definitions ported
- API hooks created with proper authentication
- Basic TokenSelector component structure
- Utility functions for IPFS and icons
- Demo page structure

⚠️ **Needs Completion:**
- Fix TypeScript configuration issues (React types not found)
- Complete SelectWithSearch component (lucide-react icon issues)
- Test API connectivity with proper environment variables
- Add proper error handling and loading states
- Style refinements to match dashboard exactly

## Usage Example

```tsx
import { TokenSelector } from '@/components/ui/TokenSelector';
import { THIRDWEB_CLIENT } from '@/lib/client';

function MyComponent() {
  const [selectedToken, setSelectedToken] = useState();

  return (
    <TokenSelector
      chainId={1} // Ethereum
      client={THIRDWEB_CLIENT}
      selectedToken={selectedToken}
      onChange={setSelectedToken}
      addNativeTokenIfMissing={true}
      placeholder="Select a token"
    />
  );
}
```

## Next Steps

1. Fix TypeScript configuration in playground-web
2. Resolve lucide-react icon imports
3. Test with actual API endpoints
4. Add proper error boundaries and loading states
5. Integrate into existing playground-web navigation
6. Add comprehensive documentation

The core architecture and data fetching logic has been successfully ported from the dashboard app, maintaining the same API patterns and authentication mechanisms.