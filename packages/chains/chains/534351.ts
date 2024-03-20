import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 534351,
  "explorers": [
    {
      "name": "Scroll Sepolia Etherscan",
      "url": "https://sepolia.scrollscan.com",
      "standard": "EIP3091"
    },
    {
      "name": "Scroll Sepolia Blockscout",
      "url": "https://sepolia-blockscout.scroll.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://scroll.io",
  "name": "Scroll Sepolia Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 534351,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://sepolia.scroll.io/bridge"
      }
    ]
  },
  "rpc": [
    "https://534351.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia-rpc.scroll.io",
    "https://rpc.ankr.com/scroll_sepolia_testnet",
    "https://scroll-sepolia.chainstacklabs.com",
    "https://scroll-testnet-public.unifra.io"
  ],
  "shortName": "scr-sepolia",
  "slip44": 1,
  "slug": "scroll-sepolia-testnet",
  "status": "active",
  "testnet": true
} as const satisfies Chain;