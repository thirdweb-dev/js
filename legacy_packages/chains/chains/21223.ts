import type { Chain } from "../src/types";
export default {
  "chain": "DCpay",
  "chainId": 21223,
  "explorers": [
    {
      "name": "DCpay Mainnet Explorer",
      "url": "https://mainnet.dcpay.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://dcpay.io",
  "name": "DCpay Mainnet",
  "nativeCurrency": {
    "name": "DCP",
    "symbol": "DCP",
    "decimals": 18
  },
  "networkId": 21223,
  "rpc": [
    "https://21223.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.dcpay.io"
  ],
  "shortName": "DCPm",
  "slug": "dcpay",
  "testnet": false
} as const satisfies Chain;