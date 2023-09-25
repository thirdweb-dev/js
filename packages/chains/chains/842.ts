import type { Chain } from "../src/types";
export default {
  "chainId": 842,
  "chain": "Tara",
  "name": "Taraxa Testnet",
  "rpc": [
    "https://taraxa-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.taraxa.io/"
  ],
  "slug": "taraxa-testnet",
  "icon": {
    "url": "ipfs://QmQhdktNyBeXmCaVuQpi1B4yXheSUKrJA17L4wpECKzG5D",
    "width": 310,
    "height": 310,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Tara",
    "symbol": "TARA",
    "decimals": 18
  },
  "infoURL": "https://taraxa.io",
  "shortName": "taratest",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Taraxa Explorer",
      "url": "https://explorer.testnet.taraxa.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;