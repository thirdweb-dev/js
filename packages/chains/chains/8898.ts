import type { Chain } from "../src/types";
export default {
  "chainId": 8898,
  "chain": "MMT",
  "name": "Mammoth Mainnet",
  "rpc": [
    "https://mammoth.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dataseed.mmtscan.io",
    "https://dataseed1.mmtscan.io",
    "https://dataseed2.mmtscan.io"
  ],
  "slug": "mammoth",
  "icon": {
    "url": "ipfs://QmaF5gi2CbDKsJ2UchNkjBqmWjv8JEDP3vePBmxeUHiaK4",
    "width": 250,
    "height": 250,
    "format": "png"
  },
  "faucets": [
    "https://faucet.mmtscan.io/"
  ],
  "nativeCurrency": {
    "name": "Mammoth Token",
    "symbol": "MMT",
    "decimals": 18
  },
  "infoURL": "https://mmtchain.io/",
  "shortName": "mmt",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "mmtscan",
      "url": "https://mmtscan.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;