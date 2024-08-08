---
"thirdweb": minor
---

Adds useProfiles hook to fetch linked profiles for the current wallet.

```jsx
 import { useProfiles } from "thirdweb/react";

 const { data: profiles } = useProfiles();

 console.log("Type:", profiles[0].type); // "discord"
 console.log("Email:", profiles[0].email); // "john.doe@example.com"
```
