---
"thirdweb": minor
---

### `getContractMetadata()` now returns a record with `unknown` values instead of `any`.

before:
```ts
const metadata = await getContractMetadata({ contract });
metadata // Record<string, any>
metadata.name; // string
metadata.symbol; // string
```

after:
```ts
const metadata = await getContractMetadata({ contract });
metadata // Record<string, unknown>
metadata.name; // string | null
metadata.symbol; // string | null
```


Metadata is not (and was never) strictly defined outside of `name` and `symbol` and may contain any type of data in the record.
This is not a runtime change but it may break type inference in existing apps that relied on the previous return type.

**Recommended fix:**
You *should* type-guard any key you access from "metadata".
```ts
const metadata = await getContractMetadata({ contract });
if ("foo" in metadata && typeof metadata.foo === "string") {
  metadata.foo; // string
}
```

**Quick fix:**
If adding type assertions is not something you can do in the short term you can also assert the type directly.
_This is as "unsafe" as the type was before._

```ts
const metadata = await getContractMetadata({ contract });
const foo = metadata.foo as string;
```

