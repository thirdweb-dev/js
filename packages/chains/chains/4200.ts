import type { Chain } from "../src/types";
export default {
  "chain": "Merlin",
  "chainId": 4200,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://scan.merlinchain.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmULpMFUvKSmJT8sWXS3WDnTm4EacgRbsEynDenpxcfrAj",
        "width": 400,
        "height": 400,
        "format": "jpg"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmULpMFUvKSmJT8sWXS3WDnTm4EacgRbsEynDenpxcfrAj",
    "width": 400,
    "height": 400,
    "format": "jpg"
  },
  "infoURL": "https://merlinchain.io",
  "name": "Merlin Mainnet",
  "nativeCurrency": {
    "name": "BTC",
    "symbol": "BTC",
    "decimals": 18
  },
  "networkId": 4200,
  "rpc": [
    "https://merlin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://4200.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.merlinchain.io"
  ],
  "shortName": "Merlin-Mainnet",
  "slug": "merlin",
  "testnet": false,
  "title": "Merlin Mainnet"
} as const satisfies Chain;