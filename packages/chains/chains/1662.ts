import type { Chain } from "../src/types";
export default {
  "chain": "LQC",
  "chainId": 1662,
  "explorers": [
    {
      "name": "Liquichain Mainnet",
      "url": "https://mainnet.liquichain.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://liquichain.io/",
  "name": "Liquichain",
  "nativeCurrency": {
    "name": "Licoin",
    "symbol": "LCN",
    "decimals": 18
  },
  "networkId": 1662,
  "redFlags": [
    "reusedChainId"
  ],
  "rpc": [],
  "shortName": "Liquichain",
  "slug": "liquichain",
  "testnet": false
} as const satisfies Chain;