import type { Chain } from "../src/types";
export default {
  "chain": "CuckooAI",
  "chainId": 1200,
  "explorers": [
    {
      "name": "Cuckoo Chain Explorer",
      "url": "https://mainnet-scan.cuckoo.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmZjVDfk56DjqkCPymaweJJaj9ASGjjgcwJ95XsFDzj9us",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://cuckoo.network",
  "name": "Cuckoo Chain",
  "nativeCurrency": {
    "name": "CuckooAI",
    "symbol": "CAI",
    "decimals": 18
  },
  "networkId": 1200,
  "rpc": [
    "https://1200.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.cuckoo.network",
    "wss://mainnet-rpc.cuckoo.network"
  ],
  "shortName": "cai",
  "slug": "cuckoo-chain",
  "testnet": false,
  "title": "Cuckoo Chain"
} as const satisfies Chain;