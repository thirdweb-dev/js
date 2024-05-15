import type { Chain } from "../src/types";
export default {
  "chain": "WP",
  "chainId": 260693,
  "explorers": [
    {
      "name": "Whalepass Explorer",
      "url": "https://polkadot.js.org/apps/?rpc=wss://fraa-flashbox-2684-rpc.a.stagenet.tanssi.network",
      "standard": "EIP3091",
      "icon": {
        "url": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMTUgMTUgMTQwIDE0MCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgMTcwIDE3MDsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8c3R5bGUgdHlwZT0idGV4dC9jc3MiPi5iZ3tmaWxsOiByZ2JhKDE2MCwgMTYwLCAxNjAsIDAuMjUpfTwvc3R5bGU+CjxnPjxjaXJjbGUgY2xhc3M9ImJnIiBjeD0iODUiIGN5PSI4NSIgcj0iNzAiLz48L2c+Cjwvc3ZnPgo=",
        "width": 83,
        "height": 83,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmbYKZ1MuDa1hzwLGjdCZGapuhV7C9uyRDPJWD994qbocY/generic-icon.png",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "name": "Whalepass Testnet",
  "nativeCurrency": {
    "name": "Whalepass",
    "symbol": "WP",
    "decimals": 18
  },
  "networkId": 260693,
  "redFlags": [],
  "rpc": [
    "https://260693.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://fraa-flashbox-2684-rpc.a.stagenet.tanssi.network"
  ],
  "shortName": "wptest",
  "slug": "whalepass-testnet",
  "testnet": true
} as const satisfies Chain;