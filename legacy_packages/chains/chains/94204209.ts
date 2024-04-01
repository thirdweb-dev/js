import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 94204209,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://polygon-blackberry.gelatoscout.com/",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYotcuJYjUBXZ33CYoWMyNnJbjK14f8ma6sge55Z5bg5W/polygon-blackberry.svg",
        "width": 300,
        "height": 300,
        "format": "svg"
      }
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://QmYotcuJYjUBXZ33CYoWMyNnJbjK14f8ma6sge55Z5bg5W/polygon-blackberry.svg",
    "width": 300,
    "height": 300,
    "format": "svg"
  },
  "infoURL": "https://raas.gelato.network/rollups/details/public/polygon-blackberry",
  "name": "Polygon Blackberry",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 94204209,
  "redFlags": [],
  "rpc": [
    "https://94204209.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.polygon-blackberry.gelato.digital"
  ],
  "shortName": "polygon-blackberry",
  "slug": "polygon-blackberry",
  "testnet": true
} as const satisfies Chain;