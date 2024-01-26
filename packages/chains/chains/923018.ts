import type { Chain } from "../src/types";
export default {
  "chain": "FNCY",
  "chainId": 923018,
  "explorers": [
    {
      "name": "fncy scan testnet",
      "url": "https://fncyscan-testnet.fncy.world",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmfXCh6UnaEHn3Evz7RFJ3p2ggJBRm9hunDHegeoquGuhD",
        "width": 256,
        "height": 256,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet-testnet.fncy.world"
  ],
  "icon": {
    "url": "ipfs://QmfXCh6UnaEHn3Evz7RFJ3p2ggJBRm9hunDHegeoquGuhD",
    "width": 256,
    "height": 256,
    "format": "png"
  },
  "infoURL": "https://fncyscan-testnet.fncy.world",
  "name": "FNCY Testnet",
  "nativeCurrency": {
    "name": "FNCY",
    "symbol": "FNCY",
    "decimals": 18
  },
  "networkId": 923018,
  "rpc": [
    "https://fncy-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://923018.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://fncy-testnet-seed.fncy.world"
  ],
  "shortName": "tFNCY",
  "slip44": 1,
  "slug": "fncy-testnet",
  "testnet": true
} as const satisfies Chain;