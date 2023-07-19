import type { Chain } from "../src/types";
export default {
  "name": "IoTeX Network Testnet",
  "chain": "iotex.io",
  "rpc": [
    "https://iotex-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://babel-api.testnet.iotex.io"
  ],
  "faucets": [
    "https://faucet.iotex.io/"
  ],
  "nativeCurrency": {
    "name": "IoTeX",
    "symbol": "IOTX",
    "decimals": 18
  },
  "infoURL": "https://iotex.io",
  "shortName": "iotex-testnet",
  "chainId": 4690,
  "networkId": 4690,
  "explorers": [
    {
      "name": "testnet iotexscan",
      "url": "https://testnet.iotexscan.io",
      "standard": "EIP3091"
    }
  ],
  "icon": {
    "url": "ipfs://QmQKHQrvtyUC5b5B76ke5GPTGXoGTVCubXS6gHgzCAswKo",
    "width": 250,
    "height": 250,
    "format": "png"
  },
  "testnet": true,
  "slug": "iotex-network-testnet"
} as const satisfies Chain;