import type { Chain } from "../src/types";
export default {
  "chain": "NETSBO",
  "chainId": 5333,
  "explorers": [
    {
      "name": "netsbo",
      "url": "https://explorer.netsbo.io",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmfGRakPDaDGTq5yCXifGmWZBSJotYfeEVamWi8Mv4HFWt",
        "width": 512,
        "height": 512,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmfGRakPDaDGTq5yCXifGmWZBSJotYfeEVamWi8Mv4HFWt",
    "width": 512,
    "height": 512,
    "format": "svg"
  },
  "infoURL": "https://netsbo.io",
  "name": "Netsbo",
  "nativeCurrency": {
    "name": "Netsbo",
    "symbol": "NETS",
    "decimals": 18
  },
  "networkId": 5333,
  "rpc": [
    "https://5333.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.netsbo.io",
    "https://rpc2.netsbo.io"
  ],
  "shortName": "nets",
  "slug": "netsbo",
  "testnet": false
} as const satisfies Chain;