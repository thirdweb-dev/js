import type { Chain } from "../src/types";
export default {
  "chainId": 666301171999,
  "chain": "IPDC",
  "name": "PDC Mainnet",
  "rpc": [
    "https://pdc.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.ipdc.io/"
  ],
  "slug": "pdc",
  "faucets": [],
  "nativeCurrency": {
    "name": "PDC",
    "symbol": "PDC",
    "decimals": 18
  },
  "infoURL": "https://ipdc.io",
  "shortName": "ipdc",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "ipdcscan",
      "url": "https://scan.ipdc.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;