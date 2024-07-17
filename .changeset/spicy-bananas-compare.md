---
"thirdweb": patch
---

Fix chain with custom RPC not used if the chain object is passed in the `chains` prop to `ConnectButton`, `ConnectEmbed` or `PayEmbed` components.

This also fixes dashboard not using custom chain's RPC since it passes the chain object via `chains` prop
