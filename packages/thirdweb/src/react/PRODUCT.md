# BridgeEmbed 2.0 — **Product Specification (Revised)**

**Version:** 1.0  
**Updated:** 30 May 2025  
**Author:** Product Team, thirdweb

---

## 1 · Purpose

BridgeEmbed is a drop-in replacement for PayEmbed that unlocks multi-hop cross-chain payments, token swaps, and fiat on-ramp flows by building on the new Bridge.\* API layer.
Developers should adopt the widget with zero code changes to existing PayEmbed integrations (same props & callbacks) while gaining:

- Swap, bridge, or transfer any crypto asset to any asset on the desired chain.
- Accept fiat (card/Apple Pay/Google Pay) via on-ramp partners and settle in the target token.
- Support three payment contexts—funding a wallet, paying a seller, or funding a transaction.
- Automatic route discovery, optimisation, and step-by-step execution via Bridge.routes, quote, prepare, and status.

### Goal

| Success Criteria  | Description                                                                                                     |
| ----------------- | --------------------------------------------------------------------------------------------------------------- |
| Drop-in upgrade   | Swap `<PayEmbed … />` for `<BridgeEmbed … />` and see identical behaviour for same-chain / same-token payments. |
| Multi-hop routing | Fund USDC on Base using an NZD credit card, or swap MATIC→ETH→USDC across chains in one flow.                   |
| Unified UX        | All three modes share one cohesive flow (quote → route preview → step runner → success).                        |
| Fast integration  | ≤ 5-minute copy-paste setup, props-only—no back-end work.                                                       |

### 3 modes to cover different use cases

| Mode                  | Typical Use-case                                                    | Destination of Funds                         |
| --------------------- | ------------------------------------------------------------------- | -------------------------------------------- |
| fund_wallet (default) | User acquires Token X for their own wallet.                         | Connected wallet                             |
| direct_payment        | User buys a product; seller requires Token Y on Chain C.            | Seller address                               |
| transaction           | dApp needs to cover value/erc20Value of a prepared on-chain action. | Connected wallet, then transaction broadcast |

BridgeEmbed 2.0 is the successor to **PayEmbed** and delivers a **modular, cross-platform hook library and UI component** for fiat / crypto on-ramping, token swaps, bridging, and direct payments.  
Developers can import:

| Layer                      | What it contains                                                         | Platform variants               |
| -------------------------- | ------------------------------------------------------------------------ | ------------------------------- |
| **Core hooks & utilities** | Logic, data-fetching, state machines, type helpers                       | **Shared** (single TS codebase) |
| **Core UI components**     | Payment-method picker, route preview, step runner, error & success views | **Web / React Native**          |
| **Higher-level flows**     | `<BridgeOrchestrator />`, `<DirectPayment />`, `<TransactionPayment />`  | **Web / React Native**          |
| **Turn-key widget**        | `<BridgeEmbed />` (switches flow by `mode` prop)                         | **Web / React Native**          |

This structure keeps one business-logic layer while letting each platform ship native UX.

---

## 2 · High-Level Goals

| Goal                      | Success Criteria                                                                              |
| ------------------------- | --------------------------------------------------------------------------------------------- |
| **Drop-in replacement**   | Existing PayEmbed users swap imports; same props still work.                                  |
| **Modularity**            | Apps may import only `useBridgeQuote` or `<PaymentMethodSelector />` without the full widget. |
| **Cross-platform parity** | Web and React Native share ≥ 90 % of code via core hooks; UI feels native on each platform.   |
| **Robust error UX**       | Every failure surfaces the underlying Bridge API message and offers a **Retry** action.       |

---

## 3 · Package & File Structure

```
packages/thirdweb/src/react/
 ├─ core/        # shared TS logic & hooks
 │   └─ src/
 │       ├─ hooks/
 │       ├─ machines/         # XState or equivalent
 │       └─ utils/
 ├─ web/         # React (DOM) components
 │   └─ components/
 └─ native/          # React Native components
     └─ components/
```

---

## 4 · Key Exports

### 4.1 Hooks (core)

| Hook                       | Responsibility                                                             |
| -------------------------- | -------------------------------------------------------------------------- |
| `usePaymentMethods()`      | Detect connected wallet balances, other-wallet option, available on-ramps. |
| `useBridgeRoutes(params)`  | Thin wrapper over `Bridge.routes/quote`; caches and re-tries.              |
| `useBridgePrepare(params)` | Call `Bridge.prepare`, returns signed tx set & metadata.                   |
| `useStepExecutor(steps)`   | Drive sequential execution + status polling, emits progress/error events.  |
| `useBridgeError()`         | Provide typed error object with `.code`, `.message`, `.retry()` helper.    |

### 4.2 Core UI Components

| Component               | Props                            | Web / RN notes                                |
| ----------------------- | -------------------------------- | --------------------------------------------- |
| `PaymentMethodSelector` | `methods`, `onSelect`            | Web: dropdown / wallet list; RN: ActionSheet. |
| `RoutePreview`          | `route`, `onConfirm`             | Shows hops, fees, ETA.                        |
| `StepRunner`            | `steps`, `onComplete`, `onError` | Progress bar + per-step status.               |
| `ErrorBanner`           | `error`                          | Always shows retry CTA.                       |
| `SuccessScreen`         | `receipt`                        | Shows final tx hash, share buttons.           |

### 4.3 Higher-Level Components

| Name                     | Mode encapsulated  |
| ------------------------ | ------------------ |
| `<BridgeOrchestrator />` | `"fund_wallet"`    |
| `<DirectPayment />`      | `"direct_payment"` |
| `<TransactionPayment />` | `"transaction"`    |

### 4.4 Turn-key Widget

```tsx
import { BridgeEmbed } from "thirdweb/react";
```

EXACT Same prop surface as `<PayEmbed />` for this one, should be a drop replacement with no code changes.

---

## 5 · User Flows

_All flows share the same state machine; UI differs by platform._

1. **Requirement Resolution** – derive target token/chain/amount.
2. **Method Selection** – `PaymentMethodSelector`.
3. **Quote & Route** – `useBridgeRoutes` → show `RoutePreview`.
4. **Confirm** – user approves (wallet popup or on-ramp).
5. **Execute Steps** – `StepRunner` driven by `useStepExecutor`.
6. **Success** – `SuccessScreen` with receipts.
7. **Error & Retry** – Any failure shows `ErrorBanner`; calling `.retry()` re-enters machine at the failed state (idempotent by design).

## 6. UX & UI Requirements

- Responsive (mobile-first; desktop ≤ 480 px width).
- Single modal with internal stepper—no new windows.
- Progress feedback: percent bar + "Step 2 / 4: Swapping MATIC → USDC".
- Retry / resume: if closed mid-flow, reopening fetches Bridge.status and resumes.
- Theming: inherits PayEmbed theme prop (light/dark & accent).
- Localization: reuse existing i18n keys; add new strings.

---

## 7 · Error Handling Guidelines

- **Surface origin:** Display `error.message` from Bridge/on-ramp APIs; prepend user-friendly context ("Swap failed – ").
- **Retry always available:** `StepRunner` pauses; user can press **Retry** (calls hook's `.retry()`) or **Cancel**.
- **Automatic back-off:** Core hooks implement exponential back-off for transient network errors.
- **Developer visibility:** All hooks throw typed errors so host apps can catch & log if using components piecemeal.

---

## 8 · Cross-Platform Parity Requirements

| Feature           | Web                                      | React Native                                           |
| ----------------- | ---------------------------------------- | ------------------------------------------------------ |
| Wallet connectors | MetaMask, Coinbase Wallet, WalletConnect | WalletConnect, MetaMask Mobile Deeplink, in-app wallet |
| Fiat on-ramp UI   | window popup (Stripe, Ramp)              | Safari/Chrome Custom Tab / In-App Browser              |
| Step progress     | Horizontal stepper with overall progress | Vertical list with checkmarks                          |

The **state machine & hooks are identical**; only presentation components differ.
