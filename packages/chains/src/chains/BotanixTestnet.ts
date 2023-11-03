import type { Chain } from "../types";
export default {
  "chain": "BOTANIX",
  "chainId": 3636,
  "explorers": [
    {
      "name": "3xpl",
      "url": "https://3xpl.com/botanix",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.botanixlabs.dev"
  ],
  "icon": {
    "url": "ipfs://QmVE5s2pXiqdMnAcxhAmWkZYhpFB5CysypeLyPKzT4rGYe",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://botanixlabs.xyz",
  "name": "Botanix Testnet",
  "nativeCurrency": {
    "name": "Botanix",
    "symbol": "BTC",
    "decimals": 18
  },
  "networkId": 3636,
  "rpc": [
    "https://botanix-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://3636.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node.botanixlabs.dev"
  ],
  "shortName": "BTNX",
  "slug": "botanix-testnet",
  "testnet": true
} as const satisfies Chain;