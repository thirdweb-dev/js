import type { Chain } from "../src/types";
export default {
  "chain": "CuckooAI",
  "chainId": 1210,
  "explorers": [
    {
      "name": "Cuckoo Sepolia Explorer",
      "url": "https://testnet-scan.cuckoo.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://cuckoo.network/portal/faucet/"
  ],
  "icon": {
    "url": "ipfs://QmZjVDfk56DjqkCPymaweJJaj9ASGjjgcwJ95XsFDzj9us",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://cuckoo.network",
  "name": "Cuckoo Sepolia",
  "nativeCurrency": {
    "name": "CuckooAI",
    "symbol": "CAI",
    "decimals": 18
  },
  "networkId": 1210,
  "rpc": [
    "https://1210.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.cuckoo.network",
    "wss://testnet-rpc.cuckoo.network"
  ],
  "shortName": "caisepolia",
  "slug": "cuckoo-sepolia",
  "testnet": true,
  "title": "Cuckoo AI Testnet Sepolia"
} as const satisfies Chain;