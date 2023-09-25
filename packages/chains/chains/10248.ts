import type { Chain } from "../src/types";
export default {
  "chainId": 10248,
  "chain": "0XTade Chain",
  "name": "0XTade",
  "rpc": [
    "https://0xtade.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node.0xtchain.com"
  ],
  "slug": "0xtade",
  "faucets": [],
  "nativeCurrency": {
    "name": "0XT",
    "symbol": "0XT",
    "decimals": 18
  },
  "infoURL": "https://www.0xtrade.finance/",
  "shortName": "0xt",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "0xtrade Scan",
      "url": "https://www.0xtscan.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;