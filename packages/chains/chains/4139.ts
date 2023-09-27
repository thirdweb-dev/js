import type { Chain } from "../src/types";
export default {
  "name": "Humans.ai Testnet",
  "chain": "Humans Testnet",
  "rpc": [
    "https://humans-ai-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evm-rpc.testnet.humans.zone"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "HEART",
    "symbol": "HEART",
    "decimals": 18
  },
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://humans.ai",
  "shortName": "humans_testnet",
  "chainId": 4139,
  "networkId": 4139,
  "icon": {
    "url": "ipfs://QmX6XuoQDTTjYqAmdNJiieLDZSwHHyUx44yQb4E3tmHmEA",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "testnet": true,
  "slug": "humans-ai-testnet"
} as const satisfies Chain;