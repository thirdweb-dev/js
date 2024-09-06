---
"thirdweb": minor
---

Adds social profile retrieval for Farcaster, Lens, and ENS.

```ts
import { getSocialProfiles } from "thirdweb/social";
const profiles = await getSocialProfiles({
  address: "0x...",
  client,
});
```

```json
[
    {
      "type": "ens",
      "name": "joenrv.eth",
      "avatar": "ipfs://bafybeic2wvtpv5hpdyeuy6o77yd5fp2ndfygppd6drdxvtfd2jouijn72m",
      "metadata": {
        "name": "joenrv.eth"
      }
    },
    {
      "type": "farcaster",
      "name": "joaquim",
      "bio": "Eng Lead @ thirdweb",
      "avatar": "https://lh3.googleusercontent.com/EUELPFJzdDNcc3qSaEMekh0_W16acnS8MSvWizt-7HPaQhfJsNFC5HA0W4NKcy6CN9zmV7d4Crqg2B8qM9BpiveqVTl2GPBQ16Ax2IQ",
      "metadata": {
        "fid": 2735,
        "bio": "Eng Lead @ thirdweb",
        "pfp": "https://lh3.googleusercontent.com/EUELPFJzdDNcc3qSaEMekh0_W16acnS8MSvWizt-7HPaQhfJsNFC5HA0W4NKcy6CN9zmV7d4Crqg2B8qM9BpiveqVTl2GPBQ16Ax2IQ",
        "username": "joaquim",
        "addresses": [
          "0x2247d5d238d0f9d37184d8332ae0289d1ad9991b",
          "0xf7970369310b541b8a84086c8c1c81d3beb85e0e"
        ]
      }
    },
    {
      "type": "lens",
      "name": "joaquim",
      "bio": "Lead engineer @thirdweb",
      "avatar": "https://ik.imagekit.io/lens/media-snapshot/557708cc7581172234133c10d473058ace362c5f547fa86cee5be2abe1478e5b.png",
      "metadata": {
        "name": "joaquim",
        "bio": "Lead engineer @thirdweb",
        "picture": "https://ik.imagekit.io/lens/media-snapshot/557708cc7581172234133c10d473058ace362c5f547fa86cee5be2abe1478e5b.png"
      }
    }
  ]
```

```tsx
import { useSocialProfiles } from "thirdweb/react";
const { data: profiles } = useSocialProfiles({
  client,
  address: "0x...",
});
```


