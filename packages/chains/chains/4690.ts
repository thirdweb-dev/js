import type { Chain } from "../src/types";
export default {
  "chain": "iotex.io",
  "chainId": 4690,
  "explorers": [
    {
      "name": "testnet iotexscan",
      "url": "https://testnet.iotexscan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.iotex.io/"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmQKHQrvtyUC5b5B76ke5GPTGXoGTVCubXS6gHgzCAswKo",
    "width": 250,
    "height": 250,
    "format": "png"
  },
  "infoURL": "https://iotex.io",
  "name": "IoTeX Network Testnet",
  "nativeCurrency": {
    "name": "IoTeX",
    "symbol": "IOTX",
    "decimals": 18
  },
  "networkId": 4690,
  "redFlags": [],
  "rpc": [
    "https://iotex-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://4690.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://babel-api.testnet.iotex.io"
  ],
  "shortName": "iotex-testnet",
  "slip44": 1,
  "slug": "iotex-network-testnet",
  "testnet": true
} as const satisfies Chain;