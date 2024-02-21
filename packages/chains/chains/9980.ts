import type { Chain } from "../src/types";
export default {
  "chain": "Combo",
  "chainId": 9980,
  "explorers": [
    {
      "name": "combotrace explorer",
      "url": "https://combotrace.nodereal.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmRR4v6h6z21BpgS9xY3ExLB4Gkmm3i3dJWQx27oTGifq8",
    "width": 800,
    "height": 693,
    "format": "png"
  },
  "infoURL": "https://combonetwork.io",
  "name": "Combo Mainnet",
  "nativeCurrency": {
    "name": "BNB Chain Native Token",
    "symbol": "BNB",
    "decimals": 18
  },
  "networkId": 9980,
  "rpc": [
    "https://9980.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.combonetwork.io"
  ],
  "shortName": "combo-mainnet",
  "slug": "combo",
  "testnet": false
} as const satisfies Chain;