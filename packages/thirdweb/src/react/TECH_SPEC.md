# BridgeEmbed 2.0 — **Technical Specification**

**Version:** 1.0  
**Updated:** 30 May 2025  
**Author:** Engineering / Architecture Team, thirdweb

---

## 1 · Overview

BridgeEmbed 2.0 is a **cross-platform payment and asset-bridging widget** that replaces PayEmbed while unlocking multi-hop bridging, token swaps, and fiat on-ramping.  
This document describes the **technical architecture, folder structure, component catalogue, hooks, utilities, error strategy, theming, and testing philosophy** required to implement the product specification (`PRODUCT.md`).  
It is written for junior-to-mid engineers new to the codebase, with explicit naming conventions and patterns to follow.

Key principles:

- **Single shared business-logic layer** (`core/`) reused by Web and React Native.
- **Dependency inversion** for all platform-specific interactions (window pop-ups, deeplinks, analytics, etc.).
- **Strict component layering:** low-level primitives → composite UI → flow components → widget.
- **Typed errors & deterministic state machine** for predictable retries and resumability.
- **100 % test coverage of critical Web paths**, colocated unit tests, and XState model tests.
- **Zero global React context** — all dependencies are passed explicitly via **props** (prop-drilling) to maximise traceability and testability.

---

## 2 · Folder Structure

```
packages/thirdweb/src/react/
├─ core/               # Shared TypeScript logic
│  ├─ hooks/           # React hooks (pure, no platform code)
│  ├─ machines/        # State-machine definitions (XState)
│  ├─ utils/           # Pure helpers (formatting, math, caches)
│  ├─ errors/          # Typed error classes & factories
│  ├─ types/           # Shared types & interfaces (re-exported from `bridge/`)
│  └─ adapters/        # Dependency-inversion interfaces & default impls
├─ web/                # DOM-specific UI
│  ├─ components/      # **Only** low-level primitives live here (already present)
│  └─ flows/           # Composite & flow components (to be created)
├─ native/             # React Native UI
│  ├─ components/      # RN low-level primitives (already present)
│  └─ flows/           # Composite & flow components (to be created)
└─ TECH_SPEC.md        # <––  ***YOU ARE HERE***
```

### 2.1 Naming & Mirroring Rules

- Every file created under `web/flows/` must have a 1-for-1 counterpart under `native/flows/` with identical **name, export, and test file**.
- Shared logic **never** imports from `web/` or `native/`. Platform layers may import from `core/`.
- Test files live next to the SUT (`Something.test.tsx`). Jest is configured for `web` & `native` targets.

---

## 3 · External Dependencies

The widget consumes the **Bridge SDK** located **in the same monorepo** (`packages/thirdweb/src/bridge`). **Always import via relative paths** to retain bundle-tooling benefits and avoid accidental external resolution:

```ts
// ✅ Correct – relative import from react/core files
import * as Bridge from "../../bridge/index.js";

// ❌ Never do this
import * as Bridge from "thirdweb/bridge";
```

Only the following Bridge namespace members are consumed directly in hooks; all others remain encapsulated:

- `Bridge.routes()` — path-finding & quote generation
- `Bridge.status()` — polling of prepared routes / actions
- `Bridge.Buy.prepare / Bridge.Sell.prepare / Bridge.Transfer.prepare / Bridge.Onramp.prepare` — executed inside `useBridgePrepare`
- `Bridge.chains()` — one-time chain metadata cache

Types imported & re-exported in `core/types/`:

- `Quote`, `PreparedQuote`, `Route`, `RouteStep`, `RouteQuoteStep`, `RouteTransaction`, `Status`, `Token`, `Chain`, `ApiError`, `Action`.

---

## 4 · Architecture & State Management

### 4.1 State Machine (`machines/paymentMachine.ts`)

We use **XState 5** to model the end-to-end flow. The machine is **platform-agnostic**, receives adapters via **context**, and exposes typed events/actions consumed by hooks.

States:

1. `resolveRequirements` → derive destination chain/token/amount.
2. `methodSelection` → user picks payment method.
3. `quote` → fetch quotes via `useBridgeRoutes`.
4. `preview` → show `RoutePreview`; wait for confirmation.
5. `prepare` → sign & prepare via `useBridgePrepare`.
6. `execute` → run sequenced steps with `useStepExecutor`.
7. `success` → route completed; show `SuccessScreen`.
8. `error` → sub-state handling (`retryable`, `fatal`).

Each state stores a **canonical snapshot** in localStorage / AsyncStorage (`core/utils/persist.ts`) so the flow can resume if the modal closes unexpectedly.

### 4.2 Dependency Injection via Props (No Context)

Rather than React context, **every component receives its dependencies through props**.

These props are threaded down to all child flows and low-level components. Shared hooks accept an `options` parameter containing references to the same adapters so that hooks remain pure and testable.

---

## 5 · Hooks

All hooks use **React Query**—`useQuery` for data-fetching, `useMutation` for state-changing actions. The `queryClient` instance is provided by the host application; BridgeEmbed does **not** create its own provider.

| Hook                      | Query / Mutation | Behaviour                                                                            |
| ------------------------- | ---------------- | ------------------------------------------------------------------------------------ |
| `usePaymentMethods()`     | `useQuery`       | Detects available payment methods.                                                   |
| `useBridgeRoutes(params)` | `useQuery`       | Fetch & cache routes; auto-retries.                                                  |
| `useBridgePrepare(route)` | `useMutation`    | Prepares on-chain steps.                                                             |
| `useStepExecutor(steps)`  | `useMutation`    | Executes steps sequentially; internally uses `useQuery` polling for `Bridge.status`. |
| `useBridgeError()`        | pure fn          | Normalises errors.                                                                   |

> **Batching & Auto-execution:** Inside `useStepExecutor` we inspect `account.sendBatchTransaction` and `isInAppSigner` (see _Execution Optimisations_ §9) to minimise user confirmations.

---

## 6 · Error Handling

```
class BridgeError extends Error {
  code: "NETWORK" | "INSUFFICIENT_FUNDS" | "USER_REJECTED" | "UNKNOWN" | ... ;
  data?: unknown;
  retry: () => Promise<void>;
}
```

- For every Bridge SDK error we map to a domain error code in `core/errors/mapBridgeError.ts`.
- The `.retry()` function is **bound** to the failing action & machine snapshot. UI components always expose a **Retry** CTA.
- Errors bubble up to the provider's `onError?(e)` callback for host app logging.

---

## 7 · Theme, Design Tokens & Styling

- Use `useCustomTheme()` from existing catalog; it returns `{ colors, typography, radius, spacing, iconSize }`.
- **Never hard-code sizes**; use constants `FONT_SIZE.md`, `ICON_SIZE.lg`, `RADIUS.default`, etc. (Existing tokens live in `web/components/basic.tsx` & friends.)
- Composite components accept optional `className` / `style` overrides but **no inline colour overrides** to preserve theme integrity.
- All Web styles use **CSS-in-JS (emotion)** already configured. RN uses `StyleSheet.create`.

---

## 8 · Component Catalogue

We now break the catalogue into **three layers**:

1. **Tier-0 Primitives** – Already present (`Container`, `Text`, `Button`, `Spinner`, `Icon`, etc.) plus prebuilt rows.
2. **Tier-1 Building Blocks** – Small, reusable composites (new): `TokenRow`, `WalletRow`, `ChainRow`, `StepConnectorArrow`, etc.
3. **Tier-2 Composite Screens** – `PaymentMethodSelector`, `RoutePreview`, `StepRunner`, `ErrorBanner`, `SuccessScreen`.
4. **Tier-3 Flows** – `<BridgeOrchestrator />`, `<DirectPayment />`, `<TransactionPayment />`.
5. **Tier-4 Widget** – `<BridgeEmbed />` (mode selector).

#### 8.1 Tier-0 Primitives (existing & prebuilt)

| Category      | Web Source                                        | RN Source                |
| ------------- | ------------------------------------------------- | ------------------------ |
| Layout        | `components/Container.tsx`                        | `components/view.tsx`    |
| Typography    | `components/text.tsx`                             | `components/text.tsx`    |
| Spacing       | `components/Spacer.tsx`                           | `components/spacer.tsx`  |
| Icons         | `components/ChainIcon.tsx`, `TokenIcon.tsx`, etc. | same                     |
| Buttons       | `components/buttons.tsx`                          | `components/button.tsx`  |
| Prebuilt rows | `web/ui/prebuilt/*/*`                             | `native/ui/prebuilt/*/*` |

#### 8.2 Tier-1 Building Blocks (new)

| Component                    | Purpose                                       |
| ---------------------------- | --------------------------------------------- |
| `TokenRow`                   | Show token icon, symbol, amount.              |
| `WalletRow` (already exists) | Display address / ENS & chain.                |
| `ChainRow`                   | Chain icon + name badge.                      |
| `StepIndicator`              | Visual status (pending / completed / failed). |

These live under `web/flows/building-blocks/` and mirrored in `native/...`.

#### 8.3 Tier-2 Composite Screens

| Component               | File                        | Props                                                            | Notes                                                  |
| ----------------------- | --------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------ |
| `PaymentMethodSelector` | `PaymentMethodSelector.tsx` | `{ methods: PaymentMethod[]; onSelect(m: PaymentMethod): void }` | Web = dropdown list; RN = ActionSheet.                 |
| `RoutePreview`          | `RoutePreview.tsx`          | `{ route: Route; onConfirm(): void; onBack(): void }`            | Shows hops, fees, ETA, fiat cost, provider logos.      |
| `StepRunner`            | `StepRunner.tsx`            | `{ steps: RouteStep[]; onComplete(): void; onError(e): void }`   | Horizontal bar (Web) / vertical list (RN).             |
| `ErrorBanner`           | `ErrorBanner.tsx`           | `{ error: BridgeError; onRetry(): void }`                        | Inline banner under modal header.                      |
| `SuccessScreen`         | `SuccessScreen.tsx`         | `{ receipt: PreparedQuote; onClose(): void }`                    | Confetti 🎉 emitted via adapter to avoid DOM coupling. |

All composites import low-level primitives only; never call Bridge SDK directly.

#### 8.4 Tier-3 Flow Components

| Name                     | Mode               | Description                                                               |
| ------------------------ | ------------------ | ------------------------------------------------------------------------- |
| `<BridgeOrchestrator />` | `"fund_wallet"`    | Simplest flow; destination = connected wallet.                            |
| `<DirectPayment />`      | `"direct_payment"` | Adds seller address prop; shows seller summary in preview.                |
| `<TransactionPayment />` | `"transaction"`    | Accepts serialized transaction & `erc20Value`; signs & broadcasts at end. |

Each exports both named component **and** factory: `createBridgeOrchestratorFlow(config)`. Factories are helpful for test stubs.

### 8.5 Widget Container

`BridgeEmbed` is **presentation-agnostic**. It renders the selected flow inline; host apps decide whether to house it in a modal, drawer, or page:

```tsx
import { BridgeEmbed } from "thirdweb/react";

function Checkout() {
  return (
    <Modal>
      <BridgeEmbed mode="direct_payment" {...props} />
    </Modal>
  );
}
```

No platform-specific modal logic is embedded.

---

## 9 · Execution Optimisations

To minimise user confirmations:

1. **In-App Signer Automation** – If `isInAppSigner({ wallet })` returns `true`, `useStepExecutor` automatically calls `submit()` for each prepared step as soon as the previous one succeeds; no UI prompt is rendered.
2. **Batching Transactions** – When `account.sendBatchTransaction` exists and all pending actions are on the **same chain**, hooks combine the ERC-20 `approve` and primary swap/bridge transaction into a single batched request, mirroring logic from `OnRampScreen.tsx` (`canBatch`).

Both optimisations emit analytics events (`trackPayEvent`) reflecting whether automation/batching was used.

---

## 10 · Testing Strategy (Web-Only)

- **Unit tests (Jest + Testing Library)** for shared hooks (`core/hooks`) and Web components (`web/flows`).
- **Component snapshots** via Storybook for Tier-1 & Tier-2 composites.
- **State-machine model tests** validate all transitions using XState testing utils.

React Native components are **not** covered by automated tests in this phase.

---

## 11 · Build, Lint, Format

- **Biome** (`biome.json`) handles linting _and_ formatting. CI runs `biome check --apply`.
- Tree-shaking: ensure `core/` stays framework-free; use `export type`.
- Package exports configured per platform in `package.json#exports`.

---

## 12 · CI & Linting

- ESLint & Prettier already configured. Rules: **no-unused-vars**, strict-null-checks.
- GitHub Actions pipeline runs: `pnpm test && pnpm build && pnpm format:check`.
- Add **bundle-size check** for `BridgeEmbed` via `size-limit`.

---

## 13 · Dependency Inversion & Adapters

Create interfaces in `core/adapters/` so shared code never touches platform APIs.

| Interface         | Methods                            | Default Web Impl               | RN Impl                 |
| ----------------- | ---------------------------------- | ------------------------------ | ----------------------- |
| `WindowAdapter`   | `open(url: string): Promise<void>` | `window.open()`                | `Linking.openURL()`     |
| `SignerAdapter`   | `sign(tx): Promise<SignedTx>`      | Injected from ethers.js wallet | WalletConnect signer    |
| `StorageAdapter`  | `get`, `set`, `delete`             | `localStorage`                 | `AsyncStorage`          |
| `ConfettiAdapter` | `fire(): void`                     | canvas-confetti                | `react-native-confetti` |

Adapters are provided via `BridgeEmbedProvider`; defaults are determined by platform entry file.

---

## 14 · Testing Strategy

- **Unit tests** for every hook & util using Jest + `@testing-library/react`
  - Hooks: mock all adapters via `createTestContext`.
  - Error mapping: snapshot test codes ↔ messages.
- **Component tests** for every composite UI using Storybook stories as fixtures.
- **State-machine model tests** in `core/machines/__tests__/paymentMachine.test.ts` covering all happy & error paths.
- Web widget **integration tests** with Playwright launching a dummy dApp.
- RN widget **E2E tests** with Detox.

Test files are named `<Original>.test.ts(x)` and live **next to** their source.

---

## 15 · Build, Packaging & Tree-Shaking

- The React package already emits ESM + CJS builds. Ensure new files use `export type` to avoid type erasure overhead.
- `core/` must have **zero React JSX** so it can be tree-shaken for non-widget consumers (e.g., just hooks).
- Web & RN entry points defined in `package.json#exports`.

---

## 16 · CI & Linting

- ESLint & Prettier already configured. Rules: **no-unused-vars**, strict-null-checks.
- GitHub Actions pipeline runs: `pnpm test && pnpm build && pnpm format:check`.
- Add **bundle-size check** for `BridgeEmbed` via `size-limit`.

---

## 17 · Execution Minimisation

To minimise user confirmations:

1. **In-App Signer Automation** – If `isInAppSigner({ wallet })` returns `true`, `useStepExecutor` automatically calls `submit()` for each prepared step as soon as the previous one succeeds; no UI prompt is rendered.
2. **Batching Transactions** – When `account.sendBatchTransaction` exists and all pending actions are on the **same chain**, hooks combine the ERC-20 `approve` and primary swap/bridge transaction into a single batched request, mirroring logic from `OnRampScreen.tsx` (`canBatch`).

Both optimisations emit analytics events (`trackPayEvent`) reflecting whether automation/batching was used.

---

## 18 · Future Work

- Ledger & Trezor hardware-wallet support via new `SignerAdapter`.
- Dynamic gas-sponsor integration (meta-tx) in `useBridgePrepare`.
- Accessibility audit; ARIA attributes & screen-reader flow.

---

> **Contact**: #bridge-embed-engineering Slack channel for questions or PR reviews.
