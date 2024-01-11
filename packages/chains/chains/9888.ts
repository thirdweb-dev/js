import type { Chain } from "../src/types";
export default {
  "chain": "Dogelayer",
  "chainId": 9888,
  "explorers": [
    {
      "name": "Dogelayer mainnet explorer",
      "url": "https://dl-explorer.dogelayer.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://dogelayer.org",
  "name": "Dogelayer Mainnet",
  "nativeCurrency": {
    "name": "Dogecoin",
    "symbol": "DOGE",
    "decimals": 18
  },
  "networkId": 9888,
  "rpc": [
    "https://dogelayer.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://9888.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dl-rpc.dogelayer.org"
  ],
  "shortName": "Dogelayer",
  "slug": "dogelayer",
  "testnet": false
} as const satisfies Chain;