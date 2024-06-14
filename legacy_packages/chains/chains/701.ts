import type { Chain } from "../src/types";
export default {
  "chain": "Darwinia Koi",
  "chainId": 701,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://koi-scan.darwinia.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://darwinia.network/",
  "name": "Darwinia Koi Testnet",
  "nativeCurrency": {
    "name": "Koi Network Native Token",
    "symbol": "KRING",
    "decimals": 18
  },
  "networkId": 701,
  "rpc": [
    "https://701.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://koi-rpc.darwinia.network"
  ],
  "shortName": "darwinia-koi",
  "slip44": 1,
  "slug": "darwinia-koi-testnet",
  "testnet": true
} as const satisfies Chain;