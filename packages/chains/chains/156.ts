import type { Chain } from "../src/types";
export default {
  "name": "OEBlock Testnet",
  "chain": "OEBt",
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "rpc": [
    "https://oeblock-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.oeblock.com"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "OEBlock",
    "symbol": "OEB",
    "decimals": 18
  },
  "infoURL": "https://www.oeblock.com/",
  "shortName": "obe",
  "chainId": 156,
  "networkId": 156,
  "icon": {
    "url": "ipfs://QmdoQUfYqtkWMfjtoPv2KWDY4MxDDSsyWgwXtCx6jfkezz",
    "width": 155,
    "height": 177,
    "format": "png"
  },
  "explorers": [
    {
      "name": "OEScan explorer",
      "url": "https://testnet.oescan.io",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "oeblock-testnet"
} as const satisfies Chain;