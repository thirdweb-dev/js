import type { Chain } from "../src/types";
export default {
  "chain": "dcchain",
  "chainId": 176,
  "explorers": [
    {
      "name": "dcscan",
      "url": "https://exp.dcnetio.cloud",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmQsNtUoaKUHWaxFMBuCQwkX9WmKHz7iNotcZTFkWo7Qgt",
    "width": 1020,
    "height": 1022,
    "format": "png"
  },
  "infoURL": "https://www.dcnetio.cloud",
  "name": "DC Mainnet",
  "nativeCurrency": {
    "name": "DC Native Token",
    "symbol": "DCT",
    "decimals": 18
  },
  "networkId": 176,
  "rpc": [
    "https://176.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.dcnetio.cloud",
    "wss://ws.dcnetio.cloud"
  ],
  "shortName": "dcchain",
  "slug": "dc",
  "testnet": false
} as const satisfies Chain;