import type { Chain } from "../src/types";
export default {
  "chain": "ERAM",
  "chainId": 721529,
  "explorers": [
    {
      "name": "Eramscan",
      "url": "https://eramscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmQyu82MtGVLYMwCc5rseNXDV12V3UUX7iNq8q86SyeaPh",
    "width": 258,
    "height": 258,
    "format": "png"
  },
  "infoURL": "http://doc.eramscan.com/",
  "name": "ERAM Mainnet",
  "nativeCurrency": {
    "name": "ERAM",
    "symbol": "ERAM",
    "decimals": 18
  },
  "networkId": 721529,
  "rpc": [
    "https://721529.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.eramscan.com"
  ],
  "shortName": "ERAM",
  "slug": "eram",
  "testnet": false
} as const satisfies Chain;