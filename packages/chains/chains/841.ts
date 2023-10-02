import type { Chain } from "../src/types";
export default {
  "chain": "Tara",
  "chainId": 841,
  "explorers": [
    {
      "name": "Taraxa Explorer",
      "url": "https://explorer.mainnet.taraxa.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmQhdktNyBeXmCaVuQpi1B4yXheSUKrJA17L4wpECKzG5D",
    "width": 310,
    "height": 310,
    "format": "png"
  },
  "infoURL": "https://taraxa.io",
  "name": "Taraxa Mainnet",
  "nativeCurrency": {
    "name": "Tara",
    "symbol": "TARA",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://taraxa.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mainnet.taraxa.io/"
  ],
  "shortName": "tara",
  "slug": "taraxa",
  "testnet": false
} as const satisfies Chain;