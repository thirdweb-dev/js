import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 534351,
  "explorers": [
    {
      "name": "Scroll Sepolia Etherscan",
      "url": "https://sepolia.scrollscan.dev",
      "standard": "EIP3091"
    },
    {
      "name": "Scroll Sepolia Blockscout",
      "url": "https://sepolia-blockscout.scroll.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "infoURL": "https://scroll.io",
  "name": "Scroll Sepolia Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://scroll-sepolia-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia-rpc.scroll.io",
    "https://rpc.ankr.com/scroll_sepolia_testnet",
    "https://scroll-sepolia.chainstacklabs.com",
    "https://scroll-testnet-public.unifra.io"
  ],
  "shortName": "scr-sepolia",
  "slug": "scroll-sepolia-testnet",
  "status": "active",
  "testnet": true
} as const satisfies Chain;