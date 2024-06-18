import type { Chain } from "../src/types";
export default {
  "chain": "LayerEdge",
  "chainId": 3456,
  "explorers": [
    {
      "name": "LayerEdge Testnet Explorer",
      "url": "https://testnet-explorer.layeredge.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmT2RotFAn8edji6FqBiP1TpTb1EFqHr28qbQGoRaJ9nTN",
        "width": 218,
        "height": 211,
        "format": "svg"
      }
    }
  ],
  "faucets": [
    "https://testnet-faucet.layeredge.io"
  ],
  "icon": {
    "url": "ipfs://QmT2RotFAn8edji6FqBiP1TpTb1EFqHr28qbQGoRaJ9nTN",
    "width": 218,
    "height": 211,
    "format": "svg"
  },
  "infoURL": "https://www.layeredge.io",
  "name": "LayerEdge testnet",
  "nativeCurrency": {
    "name": "Bitcoin",
    "symbol": "BTC",
    "decimals": 18
  },
  "networkId": 3456,
  "rpc": [
    "https://3456.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.layeredge.io"
  ],
  "shortName": "LayerEdge-testnet",
  "slug": "layeredge-testnet",
  "testnet": true
} as const satisfies Chain;