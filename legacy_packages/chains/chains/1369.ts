import type { Chain } from "../src/types";
export default {
  "chain": "ZAFIC",
  "chainId": 1369,
  "explorers": [
    {
      "name": "zafirium-explorer",
      "url": "https://explorer.zakumi.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.zakumi.io",
  "name": "Zafirium Mainnet",
  "nativeCurrency": {
    "name": "Zakumi Chain Native Token",
    "symbol": "ZAFIC",
    "decimals": 18
  },
  "networkId": 1369,
  "rpc": [
    "https://1369.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.zakumi.io"
  ],
  "shortName": "zafic",
  "slug": "zafirium",
  "testnet": false
} as const satisfies Chain;