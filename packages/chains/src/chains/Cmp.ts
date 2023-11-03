import type { Chain } from "../types";
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
  "infoURL": "https://caduceus.foundation/",
  "name": "CMP-Mainnet",
  "nativeCurrency": {
    "name": "Caduceus Token",
    "symbol": "CMP",
    "decimals": 18
  },
  "networkId": 256256,
  "rpc": [
    "https://cmp.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://256256.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.block.caduceus.foundation",
    "wss://mainnet.block.caduceus.foundation"
  ],
  "shortName": "cmp-mainnet",
  "slug": "cmp",
  "testnet": false
} as const satisfies Chain;