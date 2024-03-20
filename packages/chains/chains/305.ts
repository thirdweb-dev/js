import type { Chain } from "../src/types";
export default {
  "chain": "ZKSats",
  "chainId": 305,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.zksats.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmaopiJuCSxRKZJHDkCu9w77x2HEmbNb3QeLC1SUavehEE",
        "width": 3072,
        "height": 3072,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmaopiJuCSxRKZJHDkCu9w77x2HEmbNb3QeLC1SUavehEE",
    "width": 3072,
    "height": 3072,
    "format": "png"
  },
  "infoURL": "https://zksats.io",
  "name": "ZKSats Mainnet",
  "nativeCurrency": {
    "name": "BTC",
    "symbol": "BTC",
    "decimals": 18
  },
  "networkId": 305,
  "rpc": [
    "https://305.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.zksats.io"
  ],
  "shortName": "ZKSats-Mainnet",
  "slug": "zksats",
  "testnet": false,
  "title": "ZKSats Mainnet"
} as const satisfies Chain;