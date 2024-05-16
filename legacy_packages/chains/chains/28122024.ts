import type { Chain } from "../src/types";
export default {
  "chain": "Ancient8",
  "chainId": 28122024,
  "explorers": [
    {
      "name": "scan-testnet",
      "url": "https://scanv2-testnet.ancient8.gg",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://bafkreievnqg3xjokaty4kfbxxbrzm5v5y7exbaaia2txrh4sfgrqsalfym",
    "width": 128,
    "height": 128,
    "format": "png"
  },
  "infoURL": "https://ancient8.gg/",
  "name": "Ancient8 Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 28122024,
  "rpc": [
    "https://28122024.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpcv2-testnet.ancient8.gg"
  ],
  "shortName": "a8",
  "slip44": 1,
  "slug": "ancient8-testnet",
  "testnet": true
} as const satisfies Chain;