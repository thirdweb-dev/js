import type { Chain } from "../src/types";
export default {
  "chain": "Rootstock",
  "chainId": 30,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://rootstock.blockscout.com",
      "standard": "EIP3091"
    },
    {
      "name": "Rootstock Explorer",
      "url": "https://explorer.rsk.co",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://rootstock.io",
  "name": "Rootstock Mainnet",
  "nativeCurrency": {
    "name": "Smart Bitcoin",
    "symbol": "RBTC",
    "decimals": 18
  },
  "networkId": 30,
  "rpc": [
    "https://30.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://public-node.rsk.co",
    "https://mycrypto.rsk.co"
  ],
  "shortName": "rsk",
  "slip44": 137,
  "slug": "rootstock",
  "testnet": false
} as const satisfies Chain;