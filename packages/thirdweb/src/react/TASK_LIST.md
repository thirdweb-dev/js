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

- [x] Add dev dependency `@xstate/fsm`.
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
  onComplete: () => {
    // Called when all steps complete successfully
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

## 🧱 Milestone 7 · Tier-1 Building Blocks

TECH_SPEC §8.2

### Tasks (Web then mirror to RN)

- [ ] `TokenRow` – icon, symbol, formatted amount, onClick optional.
- [ ] `ChainRow` – chain icon + name badge.
- [ ] `StepIndicator` – renders ⏳ / ✅ / ❌ icons per step state.
- [ ] Mirror each component into `native/flows/building-blocks/` with identical props & snapshot tests.
- [ ] Add Storybook stories for every state permutation.

Acceptance ✅: Vitest snapshot tests (`pnpm test:dev building-blocks`) & Chromatic snapshots pass.

---

## 🏗️ Milestone 8 · Tier-2 Composite Screens

TECH_SPEC §8.3

### Tasks (Web & RN parity)

- [ ] `PaymentMethodSelector` – Web dropdown / RN ActionSheet ◦ props `{ methods, onSelect }`.
- [ ] `RoutePreview` – shows hops, fees, ETA, provider logos ◦ props `{ route, onConfirm, onBack }`.
- [ ] `StepRunner` – horizontal (Web) / vertical (RN) progress ◦ props `{ steps, onComplete, onError }`.
- [ ] `ErrorBanner` – inline banner with retry handler ◦ props `{ error, onRetry }`.
- [ ] `SuccessScreen` – final receipt view with success icon & fade-in transition (no confetti).
- [ ] Snapshot & interaction unit tests for each screen.

Acceptance ✅: Storybook stories interactive; tests pass (`pnpm test:dev composite`).

---

## 🚦 Milestone 9 · Tier-3 Flow Components

TECH_SPEC §8.4

### Tasks

- [ ] `<FundWallet />` – uses paymentMachine; destination = connected wallet.
- [ ] `<DirectPayment />` – adds seller address prop & summary line.
- [ ] `<TransactionPayment />` – accepts serialised tx & erc20Value; signs + broadcasts at end.
- [ ] Provide factory helpers (`createFundWalletFlow()` etc.) for tests.
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
- [ ] Generate `CHANGELOG.md` entry for `v1.0.0` (Keep-a-Changelog style).
- [ ] Publish canary `next` tag to npm (manual approval).

Acceptance ✅: Tag published; pipeline green.

---

## 🌱 Milestone 13 · Backlog / Future Enhancements

Unscheduled, track separately:

- [ ] Hardware-wallet signer adapters (Ledger, Trezor)
- [ ] Meta-transaction sponsor support (`useBridgePrepare` enhancement)
- [ ] Accessibility audit (ARIA, screen-reader)
- [ ] Dark-mode token review
