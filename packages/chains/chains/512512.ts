import type { Chain } from "../src/types";
export default {
  "chain": "CMP",
  "chainId": 512512,
  "explorers": [
    {
      "name": "Galaxy Scan",
      "url": "https://galaxy.scan.caduceus.foundation",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://dev.caduceus.foundation/testNetwork"
  ],
  "features": [],
  "infoURL": "https://caduceus.foundation/",
  "name": "CMP-Testnet",
  "nativeCurrency": {
    "name": "Caduceus Testnet Token",
    "symbol": "CMP",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://cmp-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://galaxy.block.caduceus.foundation",
    "wss://galaxy.block.caduceus.foundation"
  ],
  "shortName": "cmp",
  "slug": "cmp-testnet",
  "testnet": true
} as const satisfies Chain;