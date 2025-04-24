# AI Documentation Generation Plan & Progress — Thirdweb JS SDK

This file summarizes the process, structure, and best practices for generating AI‑facing documentation for the Thirdweb JS SDK. Use this as a reference or template for future AI agent coders.

---

## 1. Project Structure & Goals

- **Goal:** Write clear, example‑driven markdown docs for all public SDK APIs, types, components, and hooks.
- **Location:** All docs live under `ai-docs/sdk/ai-docs/` (e.g. `components/`, `functions/`, `types/`, `extensions/`, `hooks/`).
- **Audience:** Future AI agents and developers who need up‑to‑date, code‑generation‑ready API docs.

## 2. Documentation Plan (Phased Checklist)

### Phase 1 — Preparation

- [x] Inventory public API surface (crawl exports, record symbols)
- [x] Pick documentation template (intro, signature, example, related)
- [x] Design doc‑file layout (by type: components, hooks, types, etc.)

### Phase 2 — Core Building‑Blocks

- [x] ThirdwebClient type (core client object)
- [x] createThirdwebClient helper & config schema
- [x] useActiveAccount React hook
- [x] Wallet connection React components (ConnectButton, etc.)
- [x] PayEmbed component (thirdweb Pay)
- [x] Transaction helpers (prepareContractCall, sendTransaction, readContract, etc.)
- [x] Extensions for ERC721, ERC1155, ERC20, ERC4337 (overview, helpers, events)
- [ ] React hooks for extensions (e.g. useMint, useBalance, etc.)

### Phase 3 — Supporting Modules

- [ ] Storage / File upload APIs
- [ ] Auth module (login, logout, validateSession)
- [ ] Gas & Pay utilities
- [ ] Chain / Network constants & helpers
- [ ] Analytics / Insight utilities

### Phase 4 — Reference & Indexes

- [ ] Generate master index file listing all doc pages
- [ ] Write contribution guidelines for keeping docs up‑to‑date
- [ ] Quality pass: lint markdown, verify code samples compile

---

## 3. Documentation Template (for each file)

````md
# <Symbol Name>

## Description

_A concise, one‑sentence description, followed by context._

## Usage

```ts
// Example usage here
```
````

## Signature

```ts
// Function/type/component signature
```

## Example

```ts
// Complete, realistic code sample
```

## Related

- Links to other docs or external resources

```

---

## 4. Example Documented Entities

### Types
- **Chain**: EVM chain config, used in all contract/network helpers. [See: `types/Chain.md`]
- **Wallet**: Abstracts user's signing mechanism, supports EOA, smart wallets, etc. [See: `types/Wallet.md`]
- **ThirdwebClient**: Core SDK client object, required for all actions.

### Functions
- **createThirdwebClient**: Factory for client object.
- **prepareContractCall**: Build a transaction for a contract method.
- **sendTransaction**: Broadcast a transaction to the network.
- **readContract**: Stateless eth_call for contract reads.

### Components
- **ConnectButton**: Prebuilt wallet connect UI.
- **PayEmbed**: Prebuilt onramp/payment UI.

### Extensions
- **ERC721, ERC1155, ERC20, ERC4337**: High-level helpers for NFT, token, and account abstraction standards.

---

## 5. Best Practices
- **Each doc file** should:
  - Start with a clear description and context
  - Include a signature and prop/param table
  - Provide at least one realistic, copy‑paste‑ready example
  - Link to related docs and external resources
- **Keep the checklist updated** as you progress
- **Cross-link** between types, helpers, and components for discoverability
- **Favor clarity and brevity**—AI agents will use these for code generation

---

## 6. How to Resume or Extend
- Use the checklist to track progress and resume work
- Add new API surfaces or modules as new checklist items
- Use the template for all new doc files
- Place all new docs under the correct subfolder in `ai-docs/sdk/ai-docs/`

---

_Last updated: [AI agent session]_
```
