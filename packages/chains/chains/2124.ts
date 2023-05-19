import type { Chain } from "../src/types";
export default {
  "name": "Metaplayerone Dubai Testnet",
  "chain": "MP1 Dubai-Testnet",
  "icon": {
    "url": "ipfs://QmfJKxmubJrqYWDcR2PnPvmpukxPz4fYDu3hqTaSnpJDxC",
    "width": 42,
    "height": 23,
    "format": "svg"
  },
  "rpc": [
    "https://metaplayerone-dubai-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-dubai.mp1network.com/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Metaunit",
    "symbol": "MEU",
    "decimals": 18
  },
  "infoURL": "https://docs.metaplayer.one/",
  "shortName": "MEU",
  "chainId": 2124,
  "networkId": 2124,
  "explorers": [
    {
      "name": "MP1Scan",
      "url": "https://dubai.mp1scan.io",
      "icon": {
        "url": "ipfs://QmfJKxmubJrqYWDcR2PnPvmpukxPz4fYDu3hqTaSnpJDxC",
        "width": 42,
        "height": 23,
        "format": "svg"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "metaplayerone-dubai-testnet"
} as const satisfies Chain;