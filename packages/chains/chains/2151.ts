import type { Chain } from "../src/types";
export default {
  "chainId": 2151,
  "chain": "ETH",
  "name": "BOSagora Mainnet",
  "rpc": [
    "https://bosagora.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.bosagora.org",
    "https://rpc.bosagora.org"
  ],
  "slug": "bosagora",
  "icon": {
    "url": "ipfs://QmW3CT4SHmso5dRJdsjR8GL1qmt79HkdAebCn2uNaWXFYh",
    "width": 256,
    "height": 257,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "BOSAGORA",
    "symbol": "BOA",
    "decimals": 18
  },
  "infoURL": "https://docs.bosagora.org",
  "shortName": "boa",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "BOASCAN",
      "url": "https://boascan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;