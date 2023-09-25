import type { Chain } from "../src/types";
export default {
  "chainId": 9001,
  "chain": "Evmos",
  "name": "Evmos",
  "rpc": [
    "https://evmos.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://evmos-evm.publicnode.com",
    "wss://evmos-evm.publicnode.com"
  ],
  "slug": "evmos",
  "icon": {
    "url": "ipfs://QmeZW6VKUFTbz7PPW8PmDR3ZHa6osYPLBFPnW8T5LSU49c",
    "width": 400,
    "height": 400,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Evmos",
    "symbol": "EVMOS",
    "decimals": 18
  },
  "infoURL": "https://evmos.org",
  "shortName": "evmos",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Evmos Explorer (Escan)",
      "url": "https://escan.live",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;