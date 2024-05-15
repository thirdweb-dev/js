import type { Chain } from "../src/types";
export default {
  "chain": "X Layer",
  "chainId": 195,
  "explorers": [
    {
      "name": "OKLink",
      "url": "https://www.oklink.com/xlayer-test",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://www.okx.com/xlayer/faucet"
  ],
  "features": [],
  "icon": {
    "url": "ipfs://QmSLkiAAr6VtJ6jEqEzz3QdZtVEHzR6Az7E4XD8qXwjuio",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "infoURL": "https://www.okx.com/xlayer",
  "name": "X Layer Testnet",
  "nativeCurrency": {
    "name": "X Layer Global Utility Token in testnet",
    "symbol": "OKB",
    "decimals": 18
  },
  "networkId": 195,
  "rpc": [
    "https://195.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testrpc.xlayer.tech",
    "https://xlayertestrpc.okx.com"
  ],
  "shortName": "tokb",
  "slip44": 1,
  "slug": "x-layer-testnet",
  "status": "active",
  "testnet": true
} as const satisfies Chain;