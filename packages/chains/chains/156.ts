import type { Chain } from "../src/types";
export default {
  "chainId": 156,
  "chain": "OEBt",
  "name": "OEBlock Testnet",
  "rpc": [
    "https://oeblock-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.oeblock.com"
  ],
  "slug": "oeblock-testnet",
  "icon": {
    "url": "ipfs://QmdoQUfYqtkWMfjtoPv2KWDY4MxDDSsyWgwXtCx6jfkezz",
    "width": 155,
    "height": 177,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "OEBlock",
    "symbol": "OEB",
    "decimals": 18
  },
  "infoURL": "https://www.oeblock.com/",
  "shortName": "obe",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "OEScan explorer",
      "url": "https://testnet.oescan.io",
      "standard": "EIP3091"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;