import type { Chain } from "../src/types";
export default {
  "name": "PAWCHAIN Testnet",
  "chain": "PAW",
  "rpc": [
    "https://pawchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://pawchainx.com/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "PAW",
    "symbol": "PAW",
    "decimals": 18
  },
  "infoURL": "https://pawchainx.com/",
  "shortName": "PAW",
  "chainId": 542,
  "networkId": 542,
  "explorers": [
    {
      "name": "PAWCHAIN Testnet",
      "url": "https://pawscan.io",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "pawchain-testnet"
} as const satisfies Chain;