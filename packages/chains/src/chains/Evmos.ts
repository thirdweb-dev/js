import type { Chain } from "../types";
export default {
  "chain": "Evmos",
  "chainId": 9001,
  "explorers": [
    {
      "name": "Evmos Explorer (Escan)",
      "url": "https://escan.live",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmeZW6VKUFTbz7PPW8PmDR3ZHa6osYPLBFPnW8T5LSU49c",
        "width": 400,
        "height": 400,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmeZW6VKUFTbz7PPW8PmDR3ZHa6osYPLBFPnW8T5LSU49c",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://evmos.org",
  "name": "Evmos",
  "nativeCurrency": {
    "name": "Evmos",
    "symbol": "EVMOS",
    "decimals": 18
  },
  "networkId": 9001,
  "rpc": [
    "https://evmos.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://9001.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evmos.lava.build",
    "wss://evmos.lava.build/websocket",
    "https://evmos-evm.publicnode.com",
    "wss://evmos-evm.publicnode.com"
  ],
  "shortName": "evmos",
  "slug": "evmos",
  "testnet": false
} as const satisfies Chain;