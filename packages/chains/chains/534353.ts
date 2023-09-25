import type { Chain } from "../src/types";
export default {
  "chainId": 534353,
  "chain": "ETH",
  "name": "Scroll Alpha Testnet",
  "rpc": [
    "https://scroll-alpha-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://alpha-rpc.scroll.io/l2"
  ],
  "slug": "scroll-alpha-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://scroll.io",
  "shortName": "scr-alpha",
  "testnet": true,
  "status": "deprecated",
  "redFlags": [],
  "explorers": [
    {
      "name": "Scroll Alpha Testnet Block Explorer",
      "url": "https://alpha-blockscout.scroll.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;