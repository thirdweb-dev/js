import type { Chain } from "../src/types";
export default {
  "chain": "Rikeza",
  "chainId": 12715,
  "explorers": [
    {
      "name": "Rikeza Blockchain explorer",
      "url": "https://testnet.rikscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://rikeza.io",
  "name": "Rikeza Network Testnet",
  "nativeCurrency": {
    "name": "Rikeza",
    "symbol": "RIK",
    "decimals": 18
  },
  "networkId": 12715,
  "rpc": [
    "https://12715.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.rikscan.com"
  ],
  "shortName": "tRIK",
  "slip44": 1,
  "slug": "rikeza-network-testnet",
  "testnet": true,
  "title": "Rikeza Network Testnet"
} as const satisfies Chain;