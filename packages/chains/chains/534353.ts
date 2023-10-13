import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 534353,
  "explorers": [
    {
      "name": "Scroll Alpha Testnet Block Explorer",
      "url": "https://alpha-blockscout.scroll.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://scroll.io",
  "name": "Scroll Alpha Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://scroll-alpha-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://alpha-rpc.scroll.io/l2"
  ],
  "shortName": "scr-alpha",
  "slug": "scroll-alpha-testnet",
  "status": "deprecated",
  "testnet": true
} as const satisfies Chain;