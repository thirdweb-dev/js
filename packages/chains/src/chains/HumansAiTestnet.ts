import type { Chain } from "../types";
export default {
  "chain": "Humans Testnet",
  "chainId": 4139,
  "explorers": [],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmX6XuoQDTTjYqAmdNJiieLDZSwHHyUx44yQb4E3tmHmEA",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://humans.ai",
  "name": "Humans.ai Testnet",
  "nativeCurrency": {
    "name": "HEART",
    "symbol": "HEART",
    "decimals": 18
  },
  "networkId": 4139,
  "rpc": [
    "https://humans-ai-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://4139.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-rpc.testnet.humans.zone"
  ],
  "shortName": "humans_testnet",
  "slug": "humans-ai-testnet",
  "testnet": true
} as const satisfies Chain;