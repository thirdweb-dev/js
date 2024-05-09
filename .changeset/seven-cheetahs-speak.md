---
"thirdweb": patch
---

Makes multiple bugfixes on the deployPublishedContract code path

- Contracts with no constructor can now deploy as abi inputs defaults to `[]` when encoding the parameters
- Properly finds contract versions when specified
- Defaults to standard deployment if no deployType is specified
