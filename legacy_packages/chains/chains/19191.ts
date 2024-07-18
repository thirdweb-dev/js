import type { Chain } from "../src/types";
export default {
  "chain": "blockx",
  "chainId": 19191,
  "explorers": [
    {
      "name": "BlockX EVM Explorer (Blockscout)",
      "url": "https://explorer.blockxnet.com",
      "standard": "EIP3091"
    },
    {
      "name": "BlockX Cosmos Explorer (Ping)",
      "url": "https://ping.blockxnet.com/blockx",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://ping.blockxnet.com/blockx/faucet"
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "infoURL": "https://www.blockxnet.com/",
  "name": "BlockX Mainnet",
  "nativeCurrency": {
    "name": "BCXT",
    "symbol": "BCXT",
    "decimals": 18
  },
  "networkId": 19191,
  "rpc": [],
  "shortName": "bcxt",
  "slug": "blockx",
  "testnet": false
} as const satisfies Chain;