import type { Chain } from "../types";
export default {
  "chain": "RBD",
  "chainId": 5869,
  "explorers": [
    {
      "name": "wegoscan2",
      "url": "https://scan2.wegochain.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.wegochain.io",
  "name": "Wegochain Rubidium Mainnet",
  "nativeCurrency": {
    "name": "Rubid",
    "symbol": "RBD",
    "decimals": 18
  },
  "networkId": 5869,
  "rpc": [
    "https://wegochain-rubidium.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://5869.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://proxy.wegochain.io",
    "http://wallet.wegochain.io:7764"
  ],
  "shortName": "rbd",
  "slug": "wegochain-rubidium",
  "testnet": false
} as const satisfies Chain;