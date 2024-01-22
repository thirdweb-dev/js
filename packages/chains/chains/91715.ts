import type { Chain } from "../src/types";
export default {
  "chain": "Combo",
  "chainId": 91715,
  "explorers": [
    {
      "name": "combotrace explorer",
      "url": "https://combotrace-testnet.nodereal.io",
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
  "name": "Combo Testnet",
  "nativeCurrency": {
    "name": "BNB Chain Native Token",
    "symbol": "tcBNB",
    "decimals": 18
  },
  "networkId": 91715,
  "rpc": [
    "https://combo-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://91715.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://test-rpc.combonetwork.io"
  ],
  "shortName": "combo-testnet",
  "slug": "combo-testnet",
  "testnet": true
} as const satisfies Chain;