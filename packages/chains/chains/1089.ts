import type { Chain } from "../src/types";
export default {
  "chainId": 1089,
  "chain": "Humans",
  "name": "Humans.ai Mainnet",
  "rpc": [
    "https://humans-ai.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://jsonrpc.humans.nodestake.top",
    "https://humans-mainnet-evm.itrocket.net:443",
    "https://humans-evm-rpc.staketab.org:443",
    "https://evm.humans.stakepool.dev.br",
    "https://mainnet-humans-evm.konsortech.xyz",
    "https://evm-rpc.mainnet.humans.zone"
  ],
  "slug": "humans-ai",
  "icon": {
    "url": "ipfs://QmU83haX3TNifDDjBx6RP6ByqES1Kg9VqeJC87X9ipKyCS",
    "width": 386,
    "height": 397,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "HEART",
    "symbol": "HEART",
    "decimals": 18
  },
  "infoURL": "https://humans.ai",
  "shortName": "humans",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "explorer.guru",
      "url": "https://humans.explorers.guru",
      "standard": "none"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;