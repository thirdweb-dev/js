# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Package Management

- Use `pnpm install` (or `pnpm install --ignore-scripts` on Windows)
- Monorepo managed with Turborepo and pnpm workspaces

### Building

```bash
# Build all packages
pnpm build

# Build specific packages with dependencies
turbo run build --filter=./packages/*

# Development with watch mode
pnpm dev                    # Core thirdweb package
pnpm dashboard              # Run dashboard + dependencies
pnpm playground             # Run playground + dependencies
pnpm portal                 # Run portal docs + dependencies
```

### Testing

```bash
# Run all tests
pnpm test

# Interactive testing (thirdweb package)
cd packages/thirdweb && pnpm test:devr

# Test specific file
pnpm test:dev <path-to-test-file>

# E2E testing (dashboard)
cd apps/dashboard && pnpm playwright
```

### Code Quality

```bash
# Lint all packages
pnpm lint

# Auto-fix linting issues
pnpm fix

# Format code
turbo run format

# Biome is the primary linter/formatter
```

### Development Workflow

```bash
# Start development server for dashboard
pnpm dashboard

# Start playground for SDK testing
pnpm playground

# Generate changeset for releases
pnpm changeset

# Version packages
pnpm version-packages
```

## Repository Architecture

### Monorepo Structure

This is a Turborepo monorepo with the main thirdweb v5 SDK consolidated into `/packages/thirdweb/`. Legacy packages are in `/legacy_packages/`.

### Core Package (`/packages/thirdweb/`)

**Main Modules:**

- `client/` - ThirdwebClient foundation
- `chains/` - 50+ supported blockchain definitions
- `contract/` - Contract interaction with automatic ABI resolution
- `transaction/` - Transaction management and execution
- `wallets/` - Comprehensive wallet integration system
- `extensions/` - Modular contract extensions (ERC20, ERC721, etc.)
- `auth/` - SIWE authentication and signature verification
- `pay/` - Fiat and crypto payment infrastructure
- `storage/` - IPFS integration for decentralized storage
- `rpc/` - Low-level blockchain communication

**Exports Structure:**
The SDK uses modular exports from `src/exports/` including:

- `thirdweb.ts` - Core client and utilities
- `chains.ts` - Chain definitions
- `wallets.ts` - Wallet connectors
- `react.ts` - React hooks and components
- `extensions/` - Contract standards and protocols

### Applications (`/apps/`)

- **dashboard** - Web-based developer console (Next.js, Chakra UI)
- **playground-web** - Interactive SDK testing environment
- **portal** - Documentation site with MDX
- **nebula** - Account abstraction and smart wallet management
- **wallet-ui** - Wallet interface and testing

### Key Packages (`/packages/`)

- **thirdweb** - Main SDK (TypeScript, React, React Native)
- **engine** - thirdweb Engine API client
- **insight** - Analytics and data APIs
- **nebula** - Account abstraction client
- **service-utils** - Shared utilities across services

## Development Practices

### GitHub Workflow & Pull Requests

- **PR titles**: Must start with affected workspace in brackets (e.g. `[SDK]`, `[Dashboard]`, `[Portal]`, `[Playground]`)
- **PR descriptions**: Begin with one-sentence summary, add checklist of changes, reference issues with `Fixes #123`
- **Commits**: Keep small and topical – one logical change per commit
- **Branch naming**: Use `area/brief-topic` format (e.g. `sdk/fix-gas-estimate`). Avoid personal names
- **Reviews**: Request at least one core maintainer review. Do not self-merge unless sole package owner
- **CI requirements**: All checks (type-check, Biome, tests) must pass before merging

### Code Quality & Formatting

- **Biome**: Primary linter/formatter (rules in `biome.json`)
- **Pre-commit**: Run `pnpm biome check --apply` before committing
- **Build verification**: Run `pnpm build` after each file change to ensure everything builds
- Avoid editor-specific configs; rely on shared settings

### TypeScript Guidelines

- **Style**: Write idiomatic TypeScript with explicit function declarations and return types
- **File structure**: Limit each file to one stateless, single-responsibility function for clarity
- **Types**: Re-use shared types from `@/types` or local `types.ts` barrels
- **Interfaces vs Types**: Prefer type aliases over interface except for nominal shapes
- **Type safety**: Avoid `any` and `unknown` unless unavoidable; narrow generics when possible
- **Architecture**: Choose composition over inheritance; leverage utility types (`Partial`, `Pick`, etc.)

### Testing Strategy

- **Co-location**: Place tests alongside code: `foo.ts` ↔ `foo.test.ts`
- **Test approach**: Use real function invocations with stub data; avoid brittle mocks
- **Network mocking**: Use Mock Service Worker (MSW) for fetch/HTTP call interception
- **Test quality**: Keep tests deterministic and side-effect free
- **Running tests**: `cd packages/thirdweb && pnpm test:dev <filename>`
- **Test accounts**: Predefined accounts in `test/src/test-wallets.ts`
- **Chain forking**: Use `FORKED_ETHEREUM_CHAIN` for mainnet interactions, `ANVIL_CHAIN` for isolated tests

### SDK Development (`packages/thirdweb`)

#### Public API Guidelines
- **Exports**: Export everything via `exports/` directory, grouped by feature
- **Documentation**: Every public symbol must have comprehensive TSDoc with:
  - At least one `@example` block that compiles
  - Custom annotation tags (`@beta`, `@internal`, `@experimental`)
- **Comments**: Comment only ambiguous logic; avoid restating TypeScript in prose

#### Performance Optimization
- **Lazy loading**: Load heavy dependencies inside async paths to keep initial bundle lean:
  ```typescript
  const { jsPDF } = await import("jspdf");
  ```
- **Bundle budgets**: Track via `package.json#size-limit`
- **Dependencies**: De-duplicate across packages through pnpm workspace hoisting

### Dashboard & Playground Development

#### UI Component Standards
- **Core components**: Import primitives from `@/components/ui/*` (Button, Input, Select, Tabs, Card, Sidebar, Badge, Separator)
- **Navigation**: Use `NavLink` for internal navigation with automatic active states
- **Organization**: Group feature-specific components under `feature/components/*` with barrel `index.ts`

#### Styling Conventions
- **CSS framework**: Tailwind CSS only – no inline styles or CSS modules
- **Class merging**: Use `cn()` from `@/lib/utils` for conditional logic
- **Design tokens**: Use design system tokens (backgrounds: `bg-card`, borders: `border-border`, muted text: `text-muted-foreground`)
- **Component API**: Expose `className` prop on root element for overrides

#### Component Architecture
- **Server Components** (Node edge):
  - Start files with `import "server-only";`
  - Read cookies/headers with `next/headers`
  - Access server-only environment variables
  - Perform heavy data fetching
  - Implement redirect logic with `redirect()` from `next/navigation`
- **Client Components** (browser):
  - Begin files with `'use client';`
  - Handle interactive UI with React hooks (`useState`, `useEffect`, React Query, wallet hooks)
  - Access browser APIs (`localStorage`, `window`, `IntersectionObserver`)
  - Support fast transitions with prefetched data

#### Data Fetching Patterns
- **Server Side**:
  - Always call `getAuthToken()` to retrieve JWT from cookies
  - Use `Authorization: Bearer` header – never embed tokens in URLs
  - Return typed results (`Project[]`, `User[]`) – avoid `any`
- **Client Side**:
  - Wrap calls in React Query (`@tanstack/react-query`)
  - Use descriptive, stable `queryKeys` for cache hits
  - Configure `staleTime`/`cacheTime` based on freshness (default ≥ 60s)
  - Keep tokens secret via internal API routes or server actions

#### Analytics Event Guidelines
- **When to add**: Only create events that answer clear product/business questions
- **Check duplicates**: Review `src/@/analytics/report.ts` first
- **Naming**: 
  - Event name: human-readable `<subject> <verb>` (e.g. "contract deployed")
  - Function: `report<Subject><Verb>` (PascalCase)
- **Template**:
  ```typescript
  /**
   * ### Why do we need to report this event?
   * - Tracks number of contracts deployed
   *
   * ### Who is responsible for this event?
   * @username
   */
  export function reportContractDeployed(properties: {
    address: string;
    chainId: number;
  }) {
    posthog.capture("contract deployed", properties);
  }
  ```
- **Client-side only**: Never import `posthog-js` in server components
- **Changes**: Inform **#eng-core-services** before renaming/removing events

### Extension Development

- Extensions follow modular pattern in `src/extensions/`
- Auto-generated contracts from ABI definitions
- Composable functions with TypeScript safety
- Support for read/write operations

### Wallet Architecture

- Unified `Wallet` and `Account` interfaces
- Support for in-app wallets (social/email login)
- Smart wallets with account abstraction
- EIP-1193, EIP-5792, EIP-7702 standard support

## Contribution Workflow

1. **Fork and Clone**: Create fork, clone, create feature branch
2. **Install**: `pnpm install` (use `--ignore-scripts` on Windows)
3. **Develop**: Use appropriate dev commands above
4. **Test**: Write unit tests, run linting, test on demo apps
5. **Changeset**: Run `pnpm changeset` for semantic versioning
6. **PR**: Submit pull request to main branch

### Release Testing

Comment `/release-pr` on PR to trigger dev release to npm for testing.

### Changeset Guidelines

Each change in `packages/*` should contain a changeset for the appropriate package with the appropriate version bump:
- **patch**: Changes that don't impact the public API
- **minor**: Any new/modified public API
- **major**: Breaking changes (surface prominently in PR descriptions)

### Documentation Standards

- For new UI components, add Storybook stories (`*.stories.tsx`) alongside the code
- Surface breaking changes prominently in PR descriptions
- Keep documentation focused on developer experience and practical usage

## Multi-Platform Support

The SDK supports:

- **Web**: React hooks and components
- **React Native**: Mobile-specific exports and components
- **Node.js**: Server-side functionality
- **Framework Adapters**: Wagmi, Ethers compatibility layers

Key files:

- `src/exports/react.native.ts` - React Native specific exports
- `packages/react-native-adapter/` - Mobile platform shims
- `packages/wagmi-adapter/` - Wagmi ecosystem integration
