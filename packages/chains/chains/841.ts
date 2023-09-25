import type { Chain } from "../src/types";
export default {
  "chainId": 841,
  "chain": "Tara",
  "name": "Taraxa Mainnet",
  "rpc": [
    "https://taraxa.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mainnet.taraxa.io/"
  ],
  "slug": "taraxa",
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
  "shortName": "tara",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Taraxa Explorer",
      "url": "https://explorer.mainnet.taraxa.io",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;