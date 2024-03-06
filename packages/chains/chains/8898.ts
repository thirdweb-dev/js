import type { Chain } from "../src/types";
export default {
  "chain": "MMT",
  "chainId": 8898,
  "explorers": [
    {
      "name": "mmtscan",
      "url": "https://mmtscan.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmaF5gi2CbDKsJ2UchNkjBqmWjv8JEDP3vePBmxeUHiaK4",
        "width": 250,
        "height": 250,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet.mmtscan.io/"
  ],
  "icon": {
    "url": "ipfs://QmaF5gi2CbDKsJ2UchNkjBqmWjv8JEDP3vePBmxeUHiaK4",
    "width": 250,
    "height": 250,
    "format": "png"
  },
  "infoURL": "https://mmtchain.io/",
  "name": "Mammoth Mainnet",
  "nativeCurrency": {
    "name": "Mammoth Token",
    "symbol": "MMT",
    "decimals": 18
  },
  "networkId": 8898,
  "rpc": [
    "https://8898.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dataseed.mmtscan.io",
    "https://dataseed1.mmtscan.io",
    "https://dataseed2.mmtscan.io"
  ],
  "shortName": "mmt",
  "slug": "mammoth",
  "testnet": false,
  "title": "Mammoth Chain"
} as const satisfies Chain;