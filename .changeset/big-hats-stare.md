---
"@thirdweb-dev/react-native": patch
---

Sets correct UI types for some React Native components

Type composition in some components was being done incorrectly, which made
types be `any`, which in turn hide some typescript issues easily recognizable
by our linter.
