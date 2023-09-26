import type { Chain } from "../src/types";
export default {
  "name": "Scroll Sepolia Testnet",
  "chain": "ETH",
  "status": "active",
  "rpc": [
    "https://scroll-sepolia-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia-rpc.scroll.io",
    "https://rpc.ankr.com/scroll_sepolia_testnet",
    "https://scroll-sepolia.chainstacklabs.com",
    "https://scroll-testnet-public.unifra.io"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "infoURL": "https://scroll.io",
  "shortName": "scr-sepolia",
  "chainId": 534351,
  "networkId": 534351,
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
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://scroll.io/bridge"
      }
    ]
  },
  "testnet": true,
  "slug": "scroll-sepolia-testnet"
} as const satisfies Chain;