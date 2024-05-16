import type { Chain } from "../src/types";
export default {
  "chain": "Green Chain",
  "chainId": 97531,
  "explorers": [
    {
      "name": "Green Chain Explorer",
      "url": "https://explorer.greenchain.app",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmNWBcc2AtknphNxt4GtTxbWF6vDkf6sh2nvkPn9wqchW6",
    "width": 519,
    "height": 518,
    "format": "png"
  },
  "infoURL": "https://www.greenchain.app",
  "name": "Green Chain Testnet",
  "nativeCurrency": {
    "name": "GREEN",
    "symbol": "GREEN",
    "decimals": 18
  },
  "networkId": 97531,
  "rpc": [
    "https://97531.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node.greenchain.app/rpc/"
  ],
  "shortName": "greenchain",
  "slug": "green-chain-testnet",
  "testnet": true
} as const satisfies Chain;