import type { Chain } from "../src/types";
export default {
  "chainId": 4690,
  "chain": "iotex.io",
  "name": "IoTeX Network Testnet",
  "rpc": [
    "https://iotex-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://babel-api.testnet.iotex.io"
  ],
  "slug": "iotex-network-testnet",
  "icon": {
    "url": "ipfs://QmQKHQrvtyUC5b5B76ke5GPTGXoGTVCubXS6gHgzCAswKo",
    "width": 250,
    "height": 250,
    "format": "png"
  },
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
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "testnet iotexscan",
      "url": "https://testnet.iotexscan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;