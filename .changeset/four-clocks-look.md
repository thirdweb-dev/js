---
"thirdweb": minor
---

ConnectButton and ConnectEmbed components for React Native

## ConnectButton and ConnectEmbed components for React Native

Same behavior as the web, you can use these prebuilt components to quickly provide wallet connection flows to your users.

You can use it the same way as you would in the web, with the same supported properties and configuration flags.

```ts
import { ConnectButton } from "thirdweb/react";

<ConnectButton
    client={client}
/>
```

and same for ConnectEmbed


```ts
import { ConnectEmbed } from "thirdweb/react";

<ConnectEmbed
    client={client}
/>
```
