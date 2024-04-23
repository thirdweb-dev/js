import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 94204209,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://polygon-blackberry.gelatoscout.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    },
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
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://bridge.gelato.network/bridge/polygon-blackberry"
      }
    ]
  },
  "redFlags": [],
  "rpc": [
    "https://94204209.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.polygon-blackberry.gelato.digital",
    "wss://ws.polygon-blackberry.gelato.digital"
  ],
  "shortName": "polygon-blackberry",
  "slip44": 60,
  "slug": "polygon-blackberry",
  "status": "active",
  "testnet": true,
  "title": "Polygon Blackberry Testnet"
} as const satisfies Chain;