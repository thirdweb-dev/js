import type { Chain } from "../src/types";
export default {
  "chain": "Trust Smart Chain",
  "chainId": 345,
  "explorers": [
    {
      "name": "tscscan",
      "url": "https://www.tscscan.io",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmZWF4RcDtxuFRRGgMMuDV7FWCYR6kA9cAUTk12iADU52U",
        "width": 1024,
        "height": 1024,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmYmQAo5hSr16LDeSbWbXfKdF6qa2zCoK7e88r2f7RiFdt",
    "width": 1024,
    "height": 1024,
    "format": "png"
  },
  "infoURL": "https://www.trias.one",
  "name": "TSC Mainnet",
  "nativeCurrency": {
    "name": "TAS",
    "symbol": "TAS",
    "decimals": 18
  },
  "networkId": 16,
  "rpc": [
    "https://345.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc01.trias.one"
  ],
  "shortName": "TSC",
  "slug": "tsc",
  "testnet": false
} as const satisfies Chain;