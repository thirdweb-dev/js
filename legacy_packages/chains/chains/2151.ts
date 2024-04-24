import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 2151,
  "explorers": [
    {
      "name": "BOASCAN",
      "url": "https://boascan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://docs.bosagora.org",
  "name": "BOSagora Mainnet",
  "nativeCurrency": {
    "name": "BOSAGORA",
    "symbol": "BOA",
    "decimals": 18
  },
  "networkId": 2151,
  "rpc": [
    "https://2151.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.bosagora.org",
    "https://rpc.bosagora.org"
  ],
  "shortName": "boa",
  "slug": "bosagora",
  "testnet": false
} as const satisfies Chain;