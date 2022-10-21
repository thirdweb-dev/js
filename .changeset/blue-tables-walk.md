---
"@thirdweb-dev/react": minor
---

Gnosis Safe and Magic Link connectors are no longer included in the default export. They are now available as named exports instead.

## Gnosis Safe

### Connector

```diff
- import { GnosisSafeConnector } from "@thirdweb-dev/react";
+ import { GnosisSafeConnector } from "@thirdweb-dev/react/evm/connectors/gnosis-safe";
```

### Hook

```diff
- import { useGnosis } from "@thirdweb-dev/react";
+ import { useGnosis } from "@thirdweb-dev/react/evm/connectors/gnosis-safe";
```

## Magic Link

### Connector

```diff
- import { MagicLink } from "@thirdweb-dev/react";
+ import { MagicConnector } from "@thirdweb-dev/react/evm/connectors/magic";
```

### Hook

```diff
- import { useMagic } from "@thirdweb-dev/react";
+ import { useMagic } from "@thirdweb-dev/react/evm/connectors/magic";
```
