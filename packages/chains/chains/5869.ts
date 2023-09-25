import type { Chain } from "../src/types";
export default {
  "chainId": 5869,
  "chain": "RBD",
  "name": "Wegochain Rubidium Mainnet",
  "rpc": [
    "https://wegochain-rubidium.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://proxy.wegochain.io",
    "http://wallet.wegochain.io:7764"
  ],
  "slug": "wegochain-rubidium",
  "faucets": [],
  "nativeCurrency": {
    "name": "Rubid",
    "symbol": "RBD",
    "decimals": 18
  },
  "infoURL": "https://www.wegochain.io",
  "shortName": "rbd",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "wegoscan2",
      "url": "https://scan2.wegochain.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;