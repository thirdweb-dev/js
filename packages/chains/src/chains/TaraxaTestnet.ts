import type { Chain } from "../types";
export default {
  "chain": "Tara",
  "chainId": 842,
  "explorers": [
    {
      "name": "Taraxa Explorer",
      "url": "https://explorer.testnet.taraxa.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmQhdktNyBeXmCaVuQpi1B4yXheSUKrJA17L4wpECKzG5D",
    "width": 310,
    "height": 310,
    "format": "png"
  },
  "infoURL": "https://taraxa.io",
  "name": "Taraxa Testnet",
  "nativeCurrency": {
    "name": "Tara",
    "symbol": "TARA",
    "decimals": 18
  },
  "networkId": 842,
  "rpc": [
    "https://taraxa-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://842.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.testnet.taraxa.io/"
  ],
  "shortName": "taratest",
  "slug": "taraxa-testnet",
  "testnet": true
} as const satisfies Chain;