import type { Chain } from "../src/types";
export default {
  "chain": "AmStar",
  "chainId": 1138,
  "explorers": [
    {
      "name": "amstarscan-testnet",
      "url": "https://testnet.amstarscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://sinso.io",
  "name": "AmStar Testnet",
  "nativeCurrency": {
    "name": "SINSO",
    "symbol": "SINSO",
    "decimals": 18
  },
  "networkId": 1138,
  "rpc": [
    "https://1138.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.amstarscan.com"
  ],
  "shortName": "ASARt",
  "slip44": 1,
  "slug": "amstar-testnet",
  "testnet": true
} as const satisfies Chain;