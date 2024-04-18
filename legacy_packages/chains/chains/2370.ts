import type { Chain } from "../src/types";
export default {
  "chain": "Nexis Network",
  "chainId": 2370,
  "explorers": [
    {
      "name": "Nexis Testnet Explorer",
      "url": "https://evm-testnet.nexscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://evm-faucet.nexis.network"
  ],
  "icon": {
    "url": "ipfs://QmdJwWuMgbhoZhgFM4zWrZne6qs5ktcL1vBLKX12VGgALM",
    "width": 1892,
    "height": 1892,
    "format": "png"
  },
  "infoURL": "https://nexis.network/",
  "name": "Nexis Network Testnet",
  "nativeCurrency": {
    "name": "Nexis",
    "symbol": "NZT",
    "decimals": 18
  },
  "networkId": 2370,
  "rpc": [
    "https://2370.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-testnet.nexis.network"
  ],
  "shortName": "nzt",
  "slug": "nexis-network-testnet",
  "testnet": true
} as const satisfies Chain;