# BridgeEmbed 2.0 — Engineering Task List

All tasks below are **actionable check-boxes** that an AI coding agent can tick off sequentially. Follow milestones in order; each item should result in one or more concise commits / PRs.

---

## 🗂️ Milestone 1 · Folder Structure & Scaffolding

TECH_SPEC §2, §2.1

> Goal: establish empty folder skeletons for shared logic and platform UI layers.

### Tasks

- [x] Create directory `core/hooks/` with `.keep` placeholder.
- [x] Create directory `core/machines/` with `.keep`.
- [x] Create directory `core/utils/` with `.keep`.
- [x] Create directory `core/errors/` with `.keep`.
- [x] Create directory `core/types/` with `.keep`.
- [x] Create directory `core/adapters/` with `.keep`.
- [x] Create directory `web/components/` with `.keep`.
- [x] Create directory `web/flows/` with `.keep`.
- [x] Create directory `native/components/` with `.keep`.
- [x] Create directory `native/flows/` with `.keep`.

Acceptance ✅: running `pnpm build` still succeeds (no new source yet).

---

## ⚙️ Milestone 2 · Error Normalisation Helpers

TECH_SPEC §6

> Goal: convert raw `ApiError` instances from the Bridge SDK (see `bridge/types/Errors.ts`) into UI-friendly domain errors.

### Tasks

- [x] Add `core/errors/mapBridgeError.ts` exporting `mapBridgeError(e: ApiError): ApiError` (initially returns the same error; will evolve).
- [x] Unit-test `mapBridgeError` with at least three representative `ApiError.code` cases.
- [x] Export a typed helper `isRetryable(code: ApiError["code"]): boolean` alongside the map (treat `INTERNAL_SERVER_ERROR` & `UNKNOWN_ERROR` as retryable).

Acceptance ✅: Vitest suite green (`pnpm test:dev mapBridgeError`); typing passes.

---

## 🔌 Milestone 3 · Dependency Adapters

TECH_SPEC §13

> Goal: define inversion interfaces and provide default Web / RN implementations.

### Core Interface Definitions (`core/adapters/`)

- [x] `WindowAdapter` – `open(url: string): Promise<void>`
- ~~[x] `StorageAdapter` – `get(key)`, `set(key,value)`, `delete(key)` async methods~~ (using existing `AsyncStorage` from `utils/storage`)

### Default Web Implementations (`web/adapters/`)

- [x] `window` wrapper implementing `WindowAdapter`.
- ~~[x] LocalStorage wrapper implementing `StorageAdapter`.~~ (using existing `webLocalStorage`)

### Default RN Implementations (`native/adapters/`)

- [x] `Linking.openURL` wrapper (`WindowAdapter`).
- ~~[x] AsyncStorage wrapper (`StorageAdapter`).~~ (using existing `nativeLocalStorage`)

### Tests

- [x] Web adapter unit tests with vitest mocks for each browser API.

Acceptance ✅: All interfaces compile, Web tests pass (`pnpm test:dev adapters`).

---

## 🔄 Milestone 4 · Payment State Machine (XState 5)

TECH_SPEC §4.1

> Goal: scaffold the deterministic state machine driving every flow with improved field naming and discriminated union PaymentMethod type.

### State Machine Flow

The payment machine follows a linear progression through 8 states, with error handling and retry capabilities at each step:

```
┌─────────────────┐    REQUIREMENTS_RESOLVED    ┌─────────────────┐
│ resolveRequire- │ ──────────────────────────→ │ methodSelection │
│     ments       │                             │                 │
└─────────────────┘                             └─────────────────┘
         │                                               │
         │                                               │ PAYMENT_METHOD_SELECTED
         │                                               │ (wallet or fiat + data)
         │                                               ▼
         │                                       ┌─────────────────┐
         │                                       │      quote      │
         │                                       └─────────────────┘
         │                                               │
         │                                               │ QUOTE_RECEIVED
         │                                               ▼
         │                                       ┌─────────────────┐
         │                                       │     preview     │
         │                                       └─────────────────┘
         │                                               │
         │                                               │ ROUTE_CONFIRMED
         │                                               ▼
         │                                       ┌─────────────────┐
         │                                       │     prepare     │
         │                                       └─────────────────┘
         │                                               │
         │                                               │ STEPS_PREPARED
         │                                               ▼
         │                                       ┌─────────────────┐
         │                                       │     execute     │
         │                                       └─────────────────┘
         │                                               │
         │                                               │ EXECUTION_COMPLETE
         │                                               ▼
         │                                       ┌─────────────────┐
         │                                       │     success     │
         │                                       └─────────────────┘
         │                                               │
         │ ERROR_OCCURRED                                │ RESET
         │ (from any state)                              │
         ▼                                               ▼
┌─────────────────┐    RETRY                    ┌─────────────────┐
│      error      │ ──────────────────────────→ │ resolveRequire- │
│                 │                             │     ments       │
└─────────────────┘ ←─────────────────────────── └─────────────────┘
                           RESET
```

**Key Flow Characteristics:**

1. **Linear Progression**: Each state transitions to the next in sequence when successful
2. **Error Recovery**: Any state can transition to `error` state via `ERROR_OCCURRED` event
3. **Retry Logic**: From `error` state, `RETRY` returns to `resolveRequirements` (UI layer handles resume logic based on `retryState`)
4. **Reset Capability**: `RESET` event returns to initial state from `error` or `success`
5. **Type Safety**: `PaymentMethod` discriminated union ensures wallet/fiat data is validated

**State Responsibilities:**

- **resolveRequirements**: Determine destination chain, token, and amount
- **methodSelection**: Choose payment method with complete configuration
- **quote**: Fetch routing options from Bridge SDK
- **preview**: Display route details for user confirmation
- **prepare**: Prepare transaction steps for execution
- **execute**: Execute prepared steps (signatures, broadcasts, etc.)
- **success**: Payment completed successfully
- **error**: Handle errors with retry capabilities

### Tasks

- [x] ~~Add dev dependency `@xstate/fsm`.~~ **Updated**: Migrated to full XState v5 library for better TypeScript support and new features.
- [x] In `core/machines/paymentMachine.ts`, define context & eight states (`resolveRequirements`, `methodSelection`, `quote`, `preview`, `prepare`, `execute`, `success`, `error`) with:
  - **Updated field names**: `destinationChainId` (number), `destinationTokenAddress`, `destinationAmount`
  - **Discriminated union PaymentMethod**: `{ type: "wallet", originChainId, originTokenAddress }` or `{ type: "fiat", currency }`
  - **Simplified events**: Single `PAYMENT_METHOD_SELECTED` event that includes all required data for the selected method
- [x] Wire minimal transitions with streamlined methodSelection flow (single event with complete method data).
- [x] Create `core/utils/persist.ts` with `saveSnapshot`, `loadSnapshot` that use injected AsyncStorage and support discriminated union structure.
- [x] Unit-test happy-path transition sequence including wallet and fiat payment method flows with type safety.

Acceptance ✅: Machine file compiles; Vitest model test green (`pnpm test:dev paymentMachine`) - 8 tests covering core flow and error handling.

---

## 📚 Milestone 5 · Core Data Hooks (Logic Only)

PRODUCT §4.1, TECH_SPEC §5

> Goal: implement framework-agnostic data hooks.

### Setup

- [x] Ensure `@tanstack/react-query` peer already in workspace; if not, add.

### Hook Tasks

- [x] `usePaymentMethods()` – returns available payment method list (mock stub: returns `["wallet","fiat"]`).
- [x] `useBridgeRoutes(params)` – wraps `Bridge.routes()`; includes retry + cache key generation.
- [x] `useBridgePrepare(route)` – delegates to `Bridge.Buy.prepare` / etc. depending on route kind.
- [ ] `useStepExecutor(steps)` – sequentially executes steps; includes batching + in-app signer optimisation (TECH_SPEC §9).
- [x] `useBridgeError()` – consumes `mapBridgeError` & `isRetryable`.

### 🛠️ Sub-Milestone 5.1 · Step Executor Hook

`core/hooks/useStepExecutor.ts`

**High-level flow (from PRODUCT §5 & TECH_SPEC §9)**

1. Receive **prepared quote** (result of `useBridgePrepare`) containing `steps` ― each step has a `transactions[]` array.
2. If **onramp is configured**, open the payment URL first and wait for completion before proceeding with transactions.
3. UI shows a full route preview; on user confirmation we enter **execution mode** handled by this hook.
4. For every transaction **in order**:
   1. Convert the raw Bridge transaction object to a wallet-specific `PreparedTransaction` via existing `prepareTransaction()` util.
   2. Call `account.sendTransaction(preparedTx)` where `account = wallet.getAccount()` supplied via params.
   3. Capture & emit the resulting transaction hash.
   4. Poll `Bridge.status({ hash, chainId })` until status `"completed"` (exponential back-off, 1 → 2 → 4 → ... max 16 s).

**Public API**

```ts
const {
  currentStep, // RouteStep | undefined
  currentTxIndex, // number | undefined
  progress, // 0-100 number (includes onramp if configured)
  isExecuting, // boolean
  error, // ApiError | undefined
  start, // () => void
  cancel, // () => void  (sets state to cancelled, caller decides UI)
  retry, // () => void  (restarts from failing tx)
} = useStepExecutor({
  steps, // RouteStep[] from Bridge.prepare
  wallet, // Wallet instance (has getAccount())
  windowAdapter, // WindowAdapter for on-ramp links
  client, // ThirdwebClient for API calls
  onramp: {
    // Optional onramp configuration
    paymentUrl, // URL to open for payment
    sessionId, // Onramp session ID for polling
  },
  onComplete: (completedStatuses) => {
    // Called when all steps complete successfully - receives array of completed status results
    // completedStatuses contains all Bridge.status and Onramp.status responses with status: "COMPLETED"
    // Show next UI step, navigate, etc.
  },
});
```

**Execution rules**

- **Onramp first**: If onramp is configured, it executes before any transactions
- **Sequential**: never execute next tx before previous is `completed`.
- **Batch optimisation**: if `account.sendBatchTransaction` exists **and** all pending tx are on same chain → batch them.
- **In-app signer**: if `isInAppSigner(wallet)` returns true, hook auto-confirms silently (no extra UI prompt).
- **Retry** uses `mapBridgeError` – only allowed when `isRetryable(code)`.
- Emits React Query mutations for each tx so UI can subscribe.

### ❑ Sub-tasks

- [x] Define `StepExecutorOptions` & return type.
- [x] Flatten `RouteStep[]` → `BridgeTx[]` util.
- [x] Implement execution loop with batching & signer optimisation.
- [x] Integrate on-ramp polling path.
- [x] Expose progress calculation (completedTx / totalTx).
- [x] Handle cancellation & cleanup (abort polling timers).
- [x] Unit tests:
  - [x] Happy-path multi-tx execution (wallet signer).
  - [x] Batching path (`sendBatchTransaction`).
  - [x] In-app signer auto-execution.
  - [x] Retryable network error mid-flow.
  - [x] On-ramp flow polling completes.
  - [x] Cancellation stops further polling.

Acceptance ✅: `useStepExecutor.test.ts` green; lint & build pass. Ensure no unhandled promises, and timers are cleared on unmount.

### Tests

- [x] Unit tests for each hook with mocked Bridge SDK + adapters.

Acceptance ✅: All hook tests green (`pnpm test:dev useStepExecutor`); type-check passes.

---

## 🔳 Milestone 6 · Tier-0 Primitive Audit & Gaps

TECH_SPEC §8.1

> Goal: catalogue existing components.

### Tasks

- [x] Find all the core UI components for web under src/react/web/ui/components
- [x] Find all the prebuilt components for web under src/react/web/ui/prebuilt
- [x] Find all the re-used components for web under src/react/web/ui
- [x] Generate markdown table of discovered components under `src/react/components.md`, categorized by Core vs prebuilt vs re-used components and mark the number of ocurrences for each

Acceptance ✅: Storybook renders all re-used components without errors.

---

## ✅ Milestone 7: Bridge Flow Components & XState v5 Migration (COMPLETED)

**Goal**: Create working screen-to-screen navigation using dummy data, migrate to XState v5, and establish proper component patterns.

### 🔄 **Phase 1: XState v5 Migration**

**Tasks Executed:**

- [x] **Migrated from @xstate/fsm to full XState v5**
  - Updated `paymentMachine.ts` to use XState v5's `setup()` function with proper type definitions
  - Converted to named actions for better type safety
  - Updated `FundWallet.tsx` to use `useMachine` hook instead of `useActorRef` + `useSelector`
  - Updated package dependencies: removed `@xstate/fsm`, kept full `xstate` v5.19.4
  - Updated tests to use XState v5 API with `createActor()` pattern
  - **Result**: All 8 tests passing, enhanced TypeScript support, modern API usage

**Learning**: XState v5 provides superior TypeScript support and the `useMachine` hook is simpler than the useActorRef + useSelector pattern for basic usage.

### 🎨 **Phase 2: RoutePreview Story Enhancement**

**Tasks Executed:**

- [x] **Enhanced RoutePreview.stories.tsx with comprehensive dummy data**
  - Added realistic 3-step transaction flow (approve → bridge → confirm)
  - Created multiple story variations: WithComplexRoute, FastAndCheap
  - Added light and dark theme variants for all stories
  - Included realistic route details: fees, timing estimates, token amounts, chain information
  - Fixed TypeScript errors by ensuring dummy data conformed to DummyRoute interface

### 🔄 **Phase 3: Component Rename & Architecture**

**Tasks Executed:**

- [x] **Renamed FundWallet → BridgeOrchestrator with comprehensive updates**
  - Updated component files: `FundWallet.tsx` → `BridgeOrchestrator.tsx`
  - Updated props: `FundWalletProps` → `BridgeOrchestratorProps`
  - Updated storybook files with better documentation
  - Updated all documentation: TASK_LIST.md, PRODUCT.md, TECH_SPEC.md
  - Updated factory function names: `createFundWalletFlow()` → `createBridgeOrchestratorFlow()`
  - Cleaned up old files

### 💰 **Phase 4: New FundWallet Component Creation**

**Tasks Executed:**

- [x] **Created interactive FundWallet component for fund_wallet mode**
  - Large editable amount input with dynamic font sizing and validation
  - Token icon, symbol and chain icon with visual indicators
  - Dollar value display using real token price data
  - Continue button that sends "REQUIREMENTS_RESOLVED" event
  - Proper accessibility with keyboard navigation support
  - Integration with BridgeOrchestrator state machine

**Features:**

- Dynamic amount input with width and font size adjustment
- Real-time validation and button state management
- Token and chain display with placeholder icons
- USD price calculation using `token.priceUsd`
- Click-to-focus input wrapper for better UX

### 🏗️ **Phase 5: Real Types Migration**

**Tasks Executed:**

- [x] **Replaced all dummy types with real Bridge SDK types**
  - `DummyChain` → `Chain` from `../../../../chains/types.js`
  - `DummyToken` → `Token` from `../../../../bridge/types/Token.js`
  - `DummyClient` → `ThirdwebClient` from `../../../../client/client.js`
  - Updated all component props and examples to use real type structures
  - Enhanced functionality with real price data (`token.priceUsd`)
  - Added proper type safety throughout components

### 🎯 **Phase 6: Best Practices Implementation**

**Tasks Executed:**

- [x] **Implemented proper thirdweb patterns**
  - Used `defineChain(chainId)` helper instead of manual chain object construction
  - Made `ThirdwebClient` a required prop in `BridgeOrchestrator` for dependency injection
  - Updated storybook to use `storyClient` from utils instead of dummy client objects
  - Simplified chain creation: `defineChain(1)` vs manual RPC configuration
  - Centralized client configuration for consistency

### 📚 **Phase 7: Storybook Pattern Compliance**

**Tasks Executed:**

- [x] **Updated all stories to follow ErrorBanner.stories.tsx pattern**
  - Created proper wrapper components with theme props
  - Used `CustomThemeProvider` with theme parameter
  - Added comprehensive story variants (Light/Dark for all examples)
  - Implemented proper `argTypes` for theme control
  - Added background parameters for better visual testing

### 🧪 **Technical Verification**

- [x] **Build & Test Success**: All builds passing, 8/8 payment machine tests ✓
- [x] **TypeScript Compliance**: Full type safety with real SDK types
- [x] **Component Integration**: FundWallet properly integrated with BridgeOrchestrator
- [x] **Storybook Ready**: All components with comprehensive stories

---

### 🎓 **Key Learnings & Best Practices**

#### **1. Storybook Patterns**

```typescript
// ✅ Correct Pattern (follow ErrorBanner.stories.tsx)
interface ComponentWithThemeProps extends ComponentProps {
  theme: "light" | "dark" | Theme;
}

const ComponentWithTheme = (props: ComponentWithThemeProps) => {
  const { theme, ...componentProps } = props;
  return (
    <CustomThemeProvider theme={theme}>
      <Component {...componentProps} />
    </CustomThemeProvider>
  );
};
```

**Rule**: Always follow existing established patterns instead of creating custom wrapper solutions.

#### **2. Type System Usage**

```typescript
// ❌ Wrong: Dummy types
type DummyChain = { id: number; name: string };

// ✅ Correct: Real SDK types
import type { Chain } from "../../../../chains/types.js";
import type { Token } from "../../../../bridge/types/Token.js";
```

**Rule**: Use real types from the SDK from the beginning - don't create dummy types as placeholders.

#### **3. Chain Creation**

```typescript
// ❌ Wrong: Manual construction
chain: {
  id: 1,
  name: "Ethereum",
  rpc: "https://ethereum.blockpi.network/v1/rpc/public",
} as Chain

// ✅ Correct: Helper function
import { defineChain } from "../../chains/utils.js";
chain: defineChain(1)  // Auto-gets metadata, RPC, icons
```

**Rule**: Use `defineChain(chainId)` helper for automatic chain metadata instead of manual object construction.

#### **4. Dependency Injection**

```typescript
// ❌ Wrong: Create client internally
const client = { clientId: "demo", secretKey: undefined } as ThirdwebClient;

// ✅ Correct: Pass as prop
interface BridgeOrchestratorProps {
  client: ThirdwebClient; // Required prop
}
```

**Rule**: ThirdwebClient should be passed as a prop for proper dependency injection, not created internally.

#### **5. Storybook Client Usage**

```typescript
// ❌ Wrong: Dummy client objects
client: { clientId: "demo_client_id", secretKey: undefined } as ThirdwebClient

// ✅ Correct: Use configured storyClient
import { storyClient } from "../utils.js";
client: storyClient
```

**Rule**: Use the pre-configured `storyClient` in storybook stories instead of creating dummy client objects.

#### **6. Design System Spacing**

```typescript
// ❌ Wrong: Hardcoded px values
style={{
  padding: "8px 16px",
  margin: "12px 24px",
}}

// ✅ Correct: Use spacing constants
import { spacing } from "../../../core/design-system/index.js";
style={{
  padding: `${spacing.xs} ${spacing.md}`,  // 8px 16px
  margin: `${spacing.sm} ${spacing.lg}`,   // 12px 24px
}}
```

**Rule**: Always use spacing constants from the design system instead of hardcoded px values for consistent spacing throughout the application.

**Available spacing values:**

- `4xs`: 2px, `3xs`: 4px, `xxs`: 6px, `xs`: 8px, `sm`: 12px, `md`: 16px, `lg`: 24px, `xl`: 32px, `xxl`: 48px, `3xl`: 64px

**Rule**: Use the simple `useMachine` hook for most cases unless you specifically need the actor pattern for complex state management.

---

### 🚀 **Milestone 7 Achievements**

✅ **XState v5 Migration**: Modern state management with enhanced TypeScript support  
✅ **Component Architecture**: Clean separation of concerns with proper props  
✅ **Real Type Integration**: Full SDK type compliance from the start  
✅ **Interactive FundWallet**: Production-ready initial screen for fund_wallet mode  
✅ **Best Practices**: Follows established thirdweb patterns for chains, clients, and storybook  
✅ **Comprehensive Testing**: All builds and tests passing throughout development

**Result**: A solid foundation for Bridge components using modern patterns, real types, and proper dependency management.

---

## Milestone 7: PaymentSelection Real Data Implementation (COMPLETED)

### Goals

- Update PaymentSelection component to show real route data instead of dummy payment methods
- Integrate with Bridge.routes API to fetch available origin tokens for a given destination token
- Display available origin tokens as payment options with proper UI

### Implementation Summary

#### 1. Enhanced usePaymentMethods Hook

- **Updated API**: Now accepts `{ destinationToken: Token, client: ThirdwebClient }`
- **Real Data Fetching**: Uses `useQuery` to fetch routes via `Bridge.routes()` API
- **Data Transformation**: Groups routes by origin token to avoid duplicates
- **Return Format**:
  - `walletMethods`: Array of origin tokens with route data
  - `fiatMethods`: Static fiat payment options
  - Standard query state: `isLoading`, `error`, `isSuccess`, etc.

#### 2. PaymentSelection Component Updates

- **New Props**: Added required `client: ThirdwebClient` prop
- **Loading States**: Added skeleton loading while fetching routes
- **Real Token Display**: Shows actual origin tokens from Bridge API
- **UI Improvements**:
  - Token + chain icons via TokenAndChain component
  - Token symbol and chain name display
  - Limited to top 5 most popular routes
- **Error Handling**: Proper error propagation via onError callback

#### 3. Storybook Integration

- **Updated Stories**: Added required props (destinationToken, client)
- **Multiple Examples**: Different destination tokens (Ethereum USDC, Arbitrum USDC)
- **Proper Theme Handling**: Following established ErrorBanner.stories.tsx pattern

#### 4. Type Safety Improvements

- **Chain Handling**: Used `defineChain()` instead of `getCachedChain()` for better type safety
- **Proper Fallbacks**: Chain name with fallback to `Chain ${id}` format
- **PaymentMethod Integration**: Proper creation of wallet payment methods with origin token data

### Key Learnings Added

**#7 Chain Type Safety**: When displaying chain names, use `defineChain(chainId)` for better type safety rather than `getCachedChain()` which can return limited chain objects.

### Technical Verification

- ✅ Build passing (all TypeScript errors resolved)
- ✅ Proper error handling for API failures
- ✅ Loading states implemented
- ✅ Storybook stories working with real data examples
- ✅ Integration with existing BridgeOrchestrator component

### Integration Notes

- **BridgeOrchestrator**: Updated to pass `client` prop to PaymentSelection
- **State Machine**: PaymentSelection properly creates PaymentMethod objects that integrate with existing payment machine
- **Route Data**: Real routes provide origin token information for wallet-based payments
- **Fallback**: Fiat payment option always available regardless of route availability

---

## Milestone 8.1: PaymentSelection 2-Step Flow Refinement (COMPLETED)

### Goals

- Refine PaymentSelection component to implement a 2-step user flow
- Step 1: Show connected wallets, connect wallet option, and pay with fiat option
- Step 2a: If wallet selected → show available tokens using usePaymentMethods hook
- Step 2b: If fiat selected → show onramp provider selection (Coinbase, Stripe, Transak)

### Implementation Summary

#### 1. 2-Step Flow Architecture

- **Step Management**: Added internal state management with discriminated union Step type
- **Navigation Logic**: Proper back button handling that adapts to current step
- **Dynamic Titles**: Step-appropriate header titles ("Choose Payment Method" → "Select Token" → "Select Payment Provider")

#### 2. Step 1: Wallet & Fiat Selection

- **Connected Wallets Display**: Shows all connected wallets with wallet icons, names, and addresses
- **Connect Another Wallet**: Prominent button with dashed border and plus icon (placeholder for wallet connection modal)
- **Pay with Fiat**: Single option to proceed to onramp provider selection
- **Visual Design**: Consistent button styling with proper theming and spacing

#### 3. Step 2a: Token Selection (Existing Functionality)

- **Real Data Integration**: Uses existing usePaymentMethods hook with selected wallet context
- **Loading States**: Skeleton loading while fetching available routes
- **Token Display**: Shows origin tokens with amounts, balances, and proper token/chain icons
- **Empty States**: Helpful messaging when no tokens available with guidance to try different wallet

#### 4. Step 2b: Fiat Provider Selection

- **Three Providers**: Coinbase, Stripe, and Transak options
- **Provider Branding**: Custom colored containers with provider initials (temporary until real icons added)
- **Provider Descriptions**: Brief descriptive text for each provider
- **PaymentMethod Creation**: Proper creation of fiat PaymentMethod objects with selected provider

#### 5. Technical Implementation

- **Type Safety**: Proper TypeScript handling for wallet selection and payment method creation
- **Error Handling**: Graceful error handling with proper user feedback
- **Hook Integration**: Seamless integration with existing usePaymentMethods, useConnectedWallets, and useActiveWallet hooks
- **State Management**: Clean internal state management without affecting parent components

#### 6. Storybook Updates

- **Enhanced Documentation**: Comprehensive descriptions of the 2-step flow
- **Multiple Stories**: Examples showcasing different scenarios and configurations
- **Story Descriptions**: Detailed explanations of each step and interaction flow
- **Theme Support**: Full light/dark theme support with proper backgrounds

### Key Features Implemented

✅ **Connected Wallets Display**: Shows all connected wallets with proper identification  
✅ **Connect Wallet Integration**: Placeholder for wallet connection modal integration  
✅ **Fiat Provider Selection**: Full onramp provider selection (Coinbase, Stripe, Transak)  
✅ **Dynamic Navigation**: Step-aware back button and title handling  
✅ **Real Token Integration**: Uses existing usePaymentMethods hook for token selection  
✅ **Loading & Error States**: Proper loading states and error handling throughout  
✅ **Type Safety**: Full TypeScript compliance with proper error handling  
✅ **Storybook Documentation**: Comprehensive stories showcasing the full flow

### Integration Notes

- **BridgeOrchestrator**: No changes needed - already passes required `client` prop
- **Payment Machine**: PaymentSelection creates proper PaymentMethod objects that integrate seamlessly
- **Existing Hooks**: Leverages useConnectedWallets, useActiveWallet, and usePaymentMethods without modifications
- **Theme System**: Uses existing design system tokens and follows established patterns

### Technical Verification

- ✅ Build passing (all TypeScript errors resolved)
- ✅ Proper error handling for wallet selection and payment method creation
- ✅ Loading states implemented for token fetching
- ✅ Storybook stories working with enhanced documentation
- ✅ Integration with existing state machine and components

**Result**: A polished 2-step payment selection flow that provides clear wallet and fiat payment options while maintaining seamless integration with the existing Bridge system architecture.

---

## 🏗️ Milestone 8 · Tier-2 Composite Screens

TECH_SPEC §8.3

### Tasks (put all new components in src/react/web/ui/Bridge)

- [x] Fetch available origin tokens when destination token is selected
- [x] `PaymentSelection`- show list of available origin tokens and fiat payment method.
- [x] `RoutePreview` – shows hops, fees, ETA, provider logos ◦ props `{ route, onConfirm, onBack }`.
- [x] update `PaymentSelection` to show a 2 step screen - first screen shows the list of connected wallets, a button to connect another wallet, and a pay with debit card button. If clicking a wallet -> goes into showing the list of tokens available using the usePaymentMethods hooks (what we show right now), if clicking pay with debit card - shows a button for each onramp provider we have: "coinbase", "stripe" and "transak"
- [x] `StepRunner` – Handle different types of BridgePrepareResult quotes. All crypto quotes will have explicit 'steps' with transactions to execute. There is a special case for onramp, where we need to FIRST do the onramp (open payment link, poll for status) and THEN execute the transactions inside 'steps' (steps can be empty array as well).
- [x] `SuccessScreen` – final receipt view with success icon & simple icon animation.
- [x] `ErrorBanner` – inline banner with retry handler ◦ props `{ error, onRetry }`.

Acceptance ✅: Storybook stories interactive; tests pass (`pnpm test:dev composite`).

---

## 🚦 Milestone 9 · Tier-3 Flow Components

TECH_SPEC §8.4

### Tasks

- [x] `<FundWallet />` – uses passed in token; destination = connected wallet.
- [x] `<DirectPayment />` – adds seller address prop & summary line.
- [ ] `<TransactionPayment />` – accepts preparedTransaction with value or erc20Value; signs + broadcasts at end of the flow.
- [ ] Provide factory helpers (`createBridgeOrchestratorFlow()` etc.) for tests.
- [ ] Flow tests: ensure correct sequence of screens for happy path.

Acceptance ✅: Flows render & test pass (`pnpm test:dev flows`) in Storybook.

---

## 📦 Milestone 10 · `<BridgeEmbed />` Widget Container

TECH_SPEC §8.5

### Tasks

- [ ] Implement `BridgeEmbed.tsx` that selects one of the three flows by `mode` prop.
- [ ] Ensure prop surface matches legacy `<PayEmbed />` (same names & defaults).
- [ ] Internally inject platform-specific default adapters via `BridgeEmbedProvider`.
- [ ] Storybook example embedding widget inside modal.

Acceptance ✅: Legacy integration tests pass unchanged.

---

## 🧪 Milestone 11 · Cross-Layer Testing & Coverage

TECH_SPEC §10, §14

### Tasks

- [ ] Reach ≥90 % unit test coverage for `core/` & `web/flows/`.
- [ ] Add Chromatic visual regression run for all components.
- [ ] Playwright integration tests for Web dummy dApp (happy path & retry).
- [ ] Detox smoke test for RN widget.

Acceptance ✅: CI coverage (`pnpm test:dev --coverage`) & E2E jobs green.

---

## 🚀 Milestone 12 · CI, Linting & Release Prep

### Tasks

- [ ] Extend GitHub Actions to include size-limit check.
- [ ] Add `format:check` script using Biome; ensure pipeline runs `biome check --apply`.
- [ ] Generate `CHANGELOG.md` entry for `
