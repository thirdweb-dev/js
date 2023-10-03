import type { Chain } from "../src/types";
export default {
  "chain": "Humans",
  "chainId": 1089,
  "explorers": [
    {
      "name": "explorer.guru",
      "url": "https://humans.explorers.guru",
      "standard": "none"
    }
  ],
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
  "name": "Humans.ai Mainnet",
  "nativeCurrency": {
    "name": "HEART",
    "symbol": "HEART",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://humans-ai.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://jsonrpc.humans.nodestake.top",
    "https://humans-mainnet-evm.itrocket.net:443",
    "https://humans-evm-rpc.staketab.org:443",
    "https://evm.humans.stakepool.dev.br",
    "https://mainnet-humans-evm.konsortech.xyz",
    "https://evm-rpc.mainnet.humans.zone"
  ],
  "shortName": "humans",
  "slug": "humans-ai",
  "testnet": false
} as const satisfies Chain;