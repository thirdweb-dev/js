import type { Chain } from "../src/types";
export default {
  "chain": "ETMP",
  "chainId": 48,
  "explorers": [
    {
      "name": "etmpscan",
      "url": "https://etmscan.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://etm.network",
  "name": "Ennothem Mainnet Proterozoic",
  "nativeCurrency": {
    "name": "Ennothem",
    "symbol": "ETMP",
    "decimals": 18
  },
  "networkId": 48,
  "rpc": [
    "https://48.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.etm.network"
  ],
  "shortName": "etmp",
  "slug": "ennothem-proterozoic",
  "testnet": false
} as const satisfies Chain;