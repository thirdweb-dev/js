---
"@thirdweb-dev/wagmi-adapter": patch
---

Fix `getProvider` reading the last active chain from storage

`switchChain` persists the active chain under `thirdweb:active-chain` as a JSON-serialized `Chain` object, and `connect` reads it back with `JSON.parse(...)`. `getProvider` instead parsed the same value with `Number(...)`, which produces `NaN` for the stored object. Because `NaN` is falsy, `getProvider` silently fell back to chain `1` instead of the user's last active chain when auto-connecting. It now parses the value the same way `connect` does.
