---
"thirdweb": patch
---

**Add account deletion support when unlinking profiles**

Added optional `allowAccountDeletion` parameter to `useUnlinkProfile` hook and `unlinkProfile` function. When set to `true`, this allows deleting the entire account when unlinking the last profile associated with it.

**React Hook Example:**

```tsx
import { useUnlinkProfile } from "thirdweb/react";

const { mutate: unlinkProfile } = useUnlinkProfile();

const handleUnlink = () => {
  unlinkProfile({
    client,
    profileToUnlink: connectedProfiles[0],
    allowAccountDeletion: true, // Delete account if last profile
  });
};
```

**Direct Function Example:**

```ts
import { unlinkProfile } from "thirdweb/wallets/in-app";

const updatedProfiles = await unlinkProfile({
  client,
  profileToUnlink: profiles[0],
  allowAccountDeletion: true, // Delete account if last profile
});
```
