import type { Chain } from "../src/types";
export default {
  "chainId": 5165,
  "chain": "Fastex Chain (Bahamut)",
  "name": "Fastex Chain (Bahamut)",
  "rpc": [
    "https://fastex-chain-bahamut.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.sahara.bahamutchain.com",
    "https://rpc2.sahara.bahamutchain.com"
  ],
  "slug": "fastex-chain-bahamut",
  "icon": {
    "url": "ipfs://QmSemioP83RXnDWwTZbet8VpwJxcFRboX4B3pcdhLZGodP",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "FTN",
    "symbol": "FTN",
    "decimals": 18
  },
  "infoURL": "https://fastexchain.com",
  "shortName": "ftn",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://ftnscan.com",
      "standard": "none"
    }
  ],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ]
} as const satisfies Chain;