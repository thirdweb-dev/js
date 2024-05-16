import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 999999999,
  "explorers": [
    {
      "name": "Zora Sepolia Testnet Network Explorer",
      "url": "https://sepolia.explorer.zora.energy",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://zora.energy",
  "name": "Zora Sepolia Testnet",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 999999999,
  "rpc": [
    "https://999999999.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia.rpc.zora.energy"
  ],
  "shortName": "zsep",
  "slip44": 1,
  "slug": "zora-sepolia-testnet",
  "testnet": true
} as const satisfies Chain;