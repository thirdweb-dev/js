import type { Chain } from "../src/types";
export default {
  "chain": "CMP",
  "chainId": 256256,
  "explorers": [
    {
      "name": "Mainnet Scan",
      "url": "https://mainnet.scan.caduceus.foundation",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://caduceus.foundation/",
  "name": "CMP-Mainnet",
  "nativeCurrency": {
    "name": "Caduceus Token",
    "symbol": "CMP",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://cmp.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.block.caduceus.foundation",
    "wss://mainnet.block.caduceus.foundation"
  ],
  "shortName": "cmp-mainnet",
  "slug": "cmp",
  "testnet": false
} as const satisfies Chain;