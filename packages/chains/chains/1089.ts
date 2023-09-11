import type { Chain } from "../src/types";
export default {
  "name": "Humans.ai Mainnet",
  "chain": "Humans",
  "rpc": [
    "https://humans-ai.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://jsonrpc.humans.nodestake.top",
    "https://humans-mainnet-evm.itrocket.net:443",
    "https://humans-evm-rpc.staketab.org:443",
    "https://evm.humans.stakepool.dev.br",
    "https://mainnet-humans-evm.konsortech.xyz",
    "https://evm-rpc.mainnet.humans.zone"
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
  "shortName": "humans",
  "chainId": 1089,
  "networkId": 1089,
  "icon": {
    "url": "ipfs://QmU83haX3TNifDDjBx6RP6ByqES1Kg9VqeJC87X9ipKyCS",
    "width": 386,
    "height": 397,
    "format": "png"
  },
  "explorers": [
    {
      "name": "explorer.guru",
      "url": "https://humans.explorers.guru",
      "icon": {
        "url": "ipfs://QmU83haX3TNifDDjBx6RP6ByqES1Kg9VqeJC87X9ipKyCS",
        "width": 386,
        "height": 397,
        "format": "png"
      },
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "humans-ai"
} as const satisfies Chain;