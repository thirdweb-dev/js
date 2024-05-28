import type { Chain } from "../src/types";
export default {
  "chain": "Rootstock",
  "chainId": 31,
  "explorers": [
    {
      "name": "RSK Testnet Explorer",
      "url": "https://explorer.testnet.rsk.co",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.rsk.co/"
  ],
  "infoURL": "https://rootstock.io",
  "name": "Rootstock Testnet",
  "nativeCurrency": {
    "name": "Testnet Smart Bitcoin",
    "symbol": "tRBTC",
    "decimals": 18
  },
  "networkId": 31,
  "rpc": [
    "https://31.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://public-node.testnet.rsk.co",
    "https://mycrypto.testnet.rsk.co"
  ],
  "shortName": "trsk",
  "slip44": 1,
  "slug": "rootstock-testnet",
  "testnet": true
} as const satisfies Chain;