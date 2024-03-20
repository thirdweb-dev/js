import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 29112,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://testnet.explorer.hychain.com",
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
  "name": "HYCHAIN Testnet",
  "nativeCurrency": {
    "name": "TOPIA",
    "symbol": "TOPIA",
    "decimals": 18
  },
  "networkId": 29112,
  "parent": {
    "type": "L2",
    "chain": "eip155-58008",
    "bridges": []
  },
  "redFlags": [],
  "rpc": [
    "https://29112.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.hychain.com/http"
  ],
  "shortName": "hychain-testnet",
  "slug": "hychain-testnet",
  "testnet": true
} as const satisfies Chain;