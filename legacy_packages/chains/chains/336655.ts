import type { Chain } from "../src/types";
export default {
  "chain": "UPchain",
  "chainId": 336655,
  "explorers": [
    {
      "name": "UPchain Testnet Explorer",
      "url": "https://explorer-testnet.uniport.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet-testnet.uniport.network"
  ],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "infoURL": "https://uniport.network",
  "name": "UPchain Testnet",
  "nativeCurrency": {
    "name": "UBTC",
    "symbol": "UBTC",
    "decimals": 18
  },
  "networkId": 336655,
  "rpc": [
    "https://336655.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.uniport.network"
  ],
  "shortName": "UPchain-testnet",
  "slug": "upchain-testnet",
  "testnet": true
} as const satisfies Chain;