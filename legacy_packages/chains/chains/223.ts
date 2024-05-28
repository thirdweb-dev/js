import type { Chain } from "../src/types";
export default {
  "chain": "B2",
  "chainId": 223,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.bsquared.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.bsquared.network",
  "name": "B2 Mainnet",
  "nativeCurrency": {
    "name": "Bitcoin",
    "symbol": "BTC",
    "decimals": 18
  },
  "networkId": 223,
  "parent": {
    "type": "L2",
    "chain": "eip155-213",
    "bridges": [
      {
        "url": "https://www.bsquared.network/bridge"
      }
    ]
  },
  "rpc": [
    "https://223.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.b2-rpc.com",
    "https://rpc.bsquared.network",
    "https://b2-mainnet.alt.technology",
    "https://b2-mainnet-public.s.chainbase.com"
  ],
  "shortName": "B2-mainnet",
  "slug": "b2",
  "testnet": false,
  "title": "B2 Mainnet"
} as const satisfies Chain;