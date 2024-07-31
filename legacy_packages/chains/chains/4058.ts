import type { Chain } from "../src/types";
export default {
  "chain": "Bahamut",
  "chainId": 4058,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://ocean.ftnscan.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmSemioP83RXnDWwTZbet8VpwJxcFRboX4B3pcdhLZGodP",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "infoURL": "https://bahamut.io",
  "name": "Bahamut ocean",
  "nativeCurrency": {
    "name": "FTN",
    "symbol": "FTN",
    "decimals": 18
  },
  "networkId": 4058,
  "rpc": [
    "https://4058.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.ocean.bahamutchain.com"
  ],
  "shortName": "ocean",
  "slug": "bahamut-ocean",
  "testnet": false,
  "title": "Bahamut ocean"
} as const satisfies Chain;