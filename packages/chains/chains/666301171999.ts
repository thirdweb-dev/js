import type { Chain } from "../src/types";
export default {
  "chain": "IPDC",
  "chainId": 666301171999,
  "explorers": [
    {
      "name": "ipdcscan",
      "url": "https://scan.ipdc.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://ipdc.io",
  "name": "PDC Mainnet",
  "nativeCurrency": {
    "name": "PDC",
    "symbol": "PDC",
    "decimals": 18
  },
  "networkId": 666301171999,
  "rpc": [
    "https://666301171999.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.ipdc.io/"
  ],
  "shortName": "ipdc",
  "slug": "pdc",
  "testnet": false
} as const satisfies Chain;