import type { Chain } from "../src/types";
export default {
  "chain": "blockx",
  "chainId": 19077,
  "explorers": [
    {
      "name": "BlockX EVM Explorer (Blockscout)",
      "url": "https://testnet-explorer.blockxnet.com",
      "standard": "EIP3091"
    },
    {
      "name": "BlockX Cosmos Explorer (Ping)",
      "url": "https://ping.blockxnet.com/blockx-atlantis-testnet",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://ping.blockxnet.com/blockx-atlantis-testnet/faucet"
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
  "name": "BlockX Atlantis Testnet",
  "nativeCurrency": {
    "name": "BCX",
    "symbol": "BCX",
    "decimals": 18
  },
  "networkId": 19077,
  "rpc": [
    "https://19077.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://atlantis-web3.blockxnet.com"
  ],
  "shortName": "tbcx",
  "slug": "blockx-atlantis-testnet",
  "testnet": true
} as const satisfies Chain;