import type { Chain } from "../src/types";
export default {
  "chain": "BEVM",
  "chainId": 11501,
  "explorers": [
    {
      "name": "bevm mainnet scan",
      "url": "https://scan-mainnet.bevm.io",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmfMXiYn4xF9JwdjaqM5YKhqoByox51XvnL68VvKJS6yyu",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "infoURL": "https://bevm.io",
  "name": "BEVM Mainnet",
  "nativeCurrency": {
    "name": "BTC",
    "symbol": "BTC",
    "decimals": 18
  },
  "networkId": 11501,
  "rpc": [
    "https://11501.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-mainnet-1.bevm.io/",
    "https://rpc-mainnet-2.bevm.io/"
  ],
  "shortName": "bevm",
  "slug": "bevm",
  "testnet": false
} as const satisfies Chain;