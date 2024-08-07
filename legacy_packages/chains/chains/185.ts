import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 185,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.mintchain.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.mintchain.io",
  "name": "Mint Mainnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 185,
  "rpc": [
    "https://185.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.mintchain.io",
    "https://global.rpc.mintchain.io",
    "https://asia.rpc.mintchain.io"
  ],
  "shortName": "mint",
  "slug": "mint",
  "testnet": false
} as const satisfies Chain;