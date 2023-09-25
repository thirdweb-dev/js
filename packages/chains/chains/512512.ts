import type { Chain } from "../src/types";
export default {
  "chainId": 512512,
  "chain": "CMP",
  "name": "CMP-Testnet",
  "rpc": [
    "https://cmp-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://galaxy.block.caduceus.foundation",
    "wss://galaxy.block.caduceus.foundation"
  ],
  "slug": "cmp-testnet",
  "faucets": [
    "https://dev.caduceus.foundation/testNetwork"
  ],
  "nativeCurrency": {
    "name": "Caduceus Testnet Token",
    "symbol": "CMP",
    "decimals": 18
  },
  "infoURL": "https://caduceus.foundation/",
  "shortName": "cmp",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Galaxy Scan",
      "url": "https://galaxy.scan.caduceus.foundation",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;