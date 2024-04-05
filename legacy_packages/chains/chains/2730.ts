import type { Chain } from "../src/types";
export default {
  "chain": "XR Sepolia",
  "chainId": 2730,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://xr-sepolia-testnet.explorer.caldera.xyz/",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmRdBsZF2sgWitedT5qAtBZwrYwY1xecHN9u5fgddqA1eL/xr-sepolia.png",
        "width": 300,
        "height": 300,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmRdBsZF2sgWitedT5qAtBZwrYwY1xecHN9u5fgddqA1eL/xr-sepolia.png",
    "width": 300,
    "height": 300,
    "format": "png"
  },
  "infoURL": "https://xr-one.gitbook.io",
  "name": "XR Sepolia",
  "nativeCurrency": {
    "name": "tXR",
    "symbol": "tXR",
    "decimals": 18
  },
  "networkId": 2730,
  "parent": {
    "type": "L2",
    "chain": "eip155-421614",
    "bridges": []
  },
  "redFlags": [],
  "rpc": [
    "https://2730.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://xr-sepolia-testnet.rpc.caldera.xyz/http"
  ],
  "shortName": "xr-sepolia",
  "slug": "xr-sepolia",
  "testnet": true
} as const satisfies Chain;