import type { Chain } from "../src/types";
export default {
  "chain": "OEBt",
  "chainId": 156,
  "explorers": [
    {
      "name": "OEScan explorer",
      "url": "https://testnet.oescan.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmdoQUfYqtkWMfjtoPv2KWDY4MxDDSsyWgwXtCx6jfkezz",
    "width": 155,
    "height": 177,
    "format": "png"
  },
  "infoURL": "https://www.oeblock.com/",
  "name": "OEBlock Testnet",
  "nativeCurrency": {
    "name": "OEBlock",
    "symbol": "OEB",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://oeblock-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.oeblock.com"
  ],
  "shortName": "obe",
  "slug": "oeblock-testnet",
  "testnet": true
} as const satisfies Chain;