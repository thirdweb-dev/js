import type { Chain } from "../src/types";
export default {
  "chain": "2911",
  "chainId": 2911,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.hychain.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmcSJmAfk3iay6uCGJxgUPd9pTsRxbtF4BrNnC5txE9cg8",
        "width": 400,
        "height": 400,
        "format": "jpg"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmcSJmAfk3iay6uCGJxgUPd9pTsRxbtF4BrNnC5txE9cg8",
    "width": 400,
    "height": 400,
    "format": "jpg"
  },
  "infoURL": "https://www.hychain.com",
  "name": "HYCHAIN",
  "nativeCurrency": {
    "name": "TOPIA",
    "symbol": "TOPIA",
    "decimals": 18
  },
  "networkId": 2911,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://bridge.hychain.com"
      }
    ]
  },
  "redFlags": [],
  "rpc": [
    "https://2911.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.hychain.com/http"
  ],
  "shortName": "hychain",
  "slug": "hychain",
  "testnet": true
} as const satisfies Chain;