import type { Chain } from "../src/types";
export default {
  "chain": "DGS",
  "chainId": 6363,
  "explorers": [],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmRiAUu3xV5uiX6Nk1iXD5w6qjki5ugGFETRVavzJ2h5QF",
    "width": 370,
    "height": 320,
    "format": "png"
  },
  "name": "Digit Soul Smart Chain",
  "nativeCurrency": {
    "name": "Digit Coin",
    "symbol": "DGC",
    "decimals": 18
  },
  "networkId": 6363,
  "rpc": [
    "https://digit-soul-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://6363.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dsc-rpc.digitsoul.co.th"
  ],
  "shortName": "DGS",
  "slug": "digit-soul-smart-chain",
  "testnet": false
} as const satisfies Chain;