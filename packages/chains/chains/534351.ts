import type { Chain } from "../src/types";
export default {
  "chainId": 534351,
  "chain": "ETH",
  "name": "Scroll Sepolia Testnet",
  "rpc": [
    "https://scroll-sepolia-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia-rpc.scroll.io",
    "https://rpc.ankr.com/scroll_sepolia_testnet",
    "https://scroll-sepolia.chainstacklabs.com",
    "https://scroll-testnet-public.unifra.io"
  ],
  "slug": "scroll-sepolia-testnet",
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://scroll.io",
  "shortName": "scr-sepolia",
  "testnet": true,
  "status": "active",
  "redFlags": [],
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
  "features": []
} as const satisfies Chain;