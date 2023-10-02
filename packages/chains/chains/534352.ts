import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 534352,
  "explorers": [
    {
      "name": "Scroll Mainnet Block Explorer",
      "url": "https://blockscout.scroll.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://scroll.io",
  "name": "Scroll",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://scroll.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.scroll.io"
  ],
  "shortName": "scr",
  "slug": "scroll",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;