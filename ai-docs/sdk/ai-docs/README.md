## Documentation Generation Plan

> This README tracks the step‑by‑step plan (and progress) for writing AI‑facing documentation for the **Thirdweb JS SDK** that lives under `ai-docs/sdk/ai-docs`. Every major task is represented by a checkbox so work can be paused and resumed at any time.

### Phase 1 — Preparation

- [x] 1. **Inventory public API surface**
  - crawl `packages/thirdweb/src` and record exported symbols from `exports/*` entrypoints
- [ ] 2. **Design doc‑file layout**
  - decide filename conventions (`components/`, `hooks/`, `classes/`, `types/`, etc.) and cross‑linking strategy
- [x] 3. **Pick documentation template**
  - introduction
  - signature table (props / params / returns)
  - example‑in‑context snippet
  - related links

### Phase 2 — Core Building‑Blocks

- [ ] 4. **`ThirdwebClient` class** (core HTTP / RPC client)
- [ ] 5. **`createThirdwebClient` helper & configuration schema**
- [ ] 6. **`useActiveAccount` React hook**
- [ ] 7. **Wallet connection React components (`ConnectButton`, etc.)**
- [ ] 8. **Transaction helpers (`prepareContractCall`, `sendTransaction`, etc.)**
- [ ] 9. **`Contract` abstraction & frequently‑used methods**

### Phase 3 — Supporting Modules

- [ ] 10. **Storage / File upload APIs**
- [ ] 11. **Auth module (`login`, `logout`, `validateSession`)**
- [ ] 12. **Gas & Pay utilities**
- [ ] 13. **Chain / Network constants & helpers**
- [ ] 14. **Analytics / Insight utilities**

### Phase 4 — Reference & Indexes

- [ ] 15. **Generate master index file listing all doc pages**
- [ ] 16. **Write contribution guidelines for keeping docs up‑to‑date**
- [ ] 17. **Quality pass: lint markdown, verify code samples compile**

---

Each completed task should result in one or more Markdown files added under `ai-docs/sdk/ai-docs/` following the agreed‑upon template. Keep this checklist updated as progress is made.
