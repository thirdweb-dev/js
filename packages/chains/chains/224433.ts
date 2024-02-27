import type { Chain } from "../src/types";
export default {
  "chain": "CONET Holesky",
  "chainId": 224433,
  "explorers": [
    {
      "name": "CONET Holesky Scan",
      "url": "https://scan.conet.network",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    }
  ],
  "icon": {
    "url": "ipfs://bafkreibjxqd5kqcc2shstjjujvxzg6cwegwr6dgjyyd56v6h7yusgks7sy",
    "width": 1200,
    "height": 1200,
    "format": "png"
  },
  "infoURL": "https://conet.network",
  "name": "CONET Holesky",
  "nativeCurrency": {
    "name": "CONET Holesky",
    "symbol": "CONET",
    "decimals": 18
  },
  "networkId": 224433,
  "rpc": [
    "https://224433.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://holeskyrpc1.conet.network"
  ],
  "shortName": "conet-holesky",
  "slip44": 2147708081,
  "slug": "conet-holesky",
  "testnet": false
} as const satisfies Chain;