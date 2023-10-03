import type { Chain } from "../src/types";
export default {
  "chain": "0XTade Chain",
  "chainId": 10248,
  "explorers": [
    {
      "name": "0xtrade Scan",
      "url": "https://www.0xtscan.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://www.0xtrade.finance/",
  "name": "0XTade",
  "nativeCurrency": {
    "name": "0XT",
    "symbol": "0XT",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://0xtade.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node.0xtchain.com"
  ],
  "shortName": "0xt",
  "slug": "0xtade",
  "testnet": false
} as const satisfies Chain;