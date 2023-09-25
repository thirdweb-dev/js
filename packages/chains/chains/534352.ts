import type { Chain } from "../src/types";
export default {
  "chainId": 534352,
  "chain": "ETH",
  "name": "Scroll",
  "rpc": [
    "https://scroll.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.scroll.io"
  ],
  "slug": "scroll",
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://scroll.io",
  "shortName": "scr",
  "testnet": false,
  "status": "incubating",
  "redFlags": [],
  "explorers": [
    {
      "name": "Scroll Mainnet Block Explorer",
      "url": "https://blockscout.scroll.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;