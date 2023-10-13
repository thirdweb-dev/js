import type { Chain } from "../src/types";
export default {
  "chain": "Fastex Chain (Bahamut)",
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
  "infoURL": "https://fastexchain.com",
  "name": "Fastex Chain (Bahamut)",
  "nativeCurrency": {
    "name": "FTN",
    "symbol": "FTN",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://fastex-chain-bahamut.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc1.sahara.bahamutchain.com",
    "https://rpc2.sahara.bahamutchain.com"
  ],
  "shortName": "ftn",
  "slug": "fastex-chain-bahamut",
  "testnet": false
} as const satisfies Chain;