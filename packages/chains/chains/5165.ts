import type { Chain } from "../src/types";
export default {
  "chain": "Bahamut",
  "chainId": 5165,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://ftnscan.com",
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
  "name": "Bahamut",
  "nativeCurrency": {
    "name": "FTN",
    "symbol": "FTN",
    "decimals": 18
  },
  "networkId": 5165,
  "rpc": [
    "https://bahamut.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://5165.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.bahamut.io",
    "https://rpc2.bahamut.io",
    "wss://ws1.sahara.bahamutchain.com",
    "wss://ws2.sahara.bahamutchain.com"
  ],
  "shortName": "ftn",
  "slug": "bahamut",
  "testnet": false,
  "title": "Bahamut mainnet"
} as const satisfies Chain;