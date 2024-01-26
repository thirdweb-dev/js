import type { Chain } from "../src/types";
export default {
  "chain": "BTC",
  "chainId": 3637,
  "explorers": [
    {
      "name": "Botanix",
      "url": "https://btxtestchain.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.btxtestchain.com"
  ],
  "icon": {
    "url": "ipfs://QmVE5s2pXiqdMnAcxhAmWkZYhpFB5CysypeLyPKzT4rGYe",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://btxtestchain.com",
  "name": "Botanix Mainnet",
  "nativeCurrency": {
    "name": "Botanix",
    "symbol": "BTC",
    "decimals": 18
  },
  "networkId": 3637,
  "rpc": [
    "https://botanix.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://3637.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.btxtestchain.com"
  ],
  "shortName": "BTCm",
  "slug": "botanix",
  "testnet": true
} as const satisfies Chain;