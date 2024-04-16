import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 1612127,
  "explorers": [
    {
      "name": "PlayFi Block Explorer",
      "url": "https://albireo-explorer.playfi.ai",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.playfi.ai/",
  "name": "PlayFi Albireo Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 1612127,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://portal.playfi.ai/bridge"
      }
    ]
  },
  "rpc": [
    "https://1612127.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://albireo-rpc.playfi.ai"
  ],
  "shortName": "alberio",
  "slip44": 1,
  "slug": "playfi-albireo-testnet",
  "testnet": true
} as const satisfies Chain;