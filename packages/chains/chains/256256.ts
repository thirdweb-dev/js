import type { Chain } from "../src/types";
export default {
  "chainId": 256256,
  "chain": "CMP",
  "name": "CMP-Mainnet",
  "rpc": [
    "https://cmp.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.block.caduceus.foundation",
    "wss://mainnet.block.caduceus.foundation"
  ],
  "slug": "cmp",
  "faucets": [],
  "nativeCurrency": {
    "name": "Caduceus Token",
    "symbol": "CMP",
    "decimals": 18
  },
  "infoURL": "https://caduceus.foundation/",
  "shortName": "cmp-mainnet",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Mainnet Scan",
      "url": "https://mainnet.scan.caduceus.foundation",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;