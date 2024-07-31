import type { Chain } from "../src/types";
export default {
  "chain": "Trust Smart Chain Testnet",
  "chainId": 820522,
  "explorers": [
    {
      "name": "tscscan",
      "url": "https://testnet.tscscan.io",
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
  "name": "TSC Testnet",
  "nativeCurrency": {
    "name": "TAS",
    "symbol": "tTAS",
    "decimals": 18
  },
  "networkId": 820025,
  "rpc": [
    "https://820522.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet.tscscan.io/testrpc"
  ],
  "shortName": "tTSC",
  "slug": "tsc-testnet",
  "testnet": true
} as const satisfies Chain;