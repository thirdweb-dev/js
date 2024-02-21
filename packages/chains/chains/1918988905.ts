import type { Chain } from "../src/types";
export default {
  "chain": "RARI-T",
  "chainId": 1918988905,
  "explorers": [],
  "faucets": [],
  "features": [],
  "infoURL": "https://rarichain.org/",
  "name": "RARIchain Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 1918988905,
  "redFlags": [],
  "rpc": [
    "https://1918988905.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.rpc.rarichain.org/http"
  ],
  "shortName": "eth",
  "slug": "rarichain-testnet",
  "testnet": true
} as const satisfies Chain;