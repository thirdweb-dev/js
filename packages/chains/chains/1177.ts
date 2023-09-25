import type { Chain } from "../src/types";
export default {
  "chainId": 1177,
  "chain": "SHT",
  "name": "Smart Host Teknoloji TESTNET",
  "rpc": [
    "https://smart-host-teknoloji-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://s2.tl.web.tr:4041"
  ],
  "slug": "smart-host-teknoloji-testnet",
  "icon": {
    "url": "ipfs://QmTrLGHyQ1Le25Q7EgNSF5Qq8D2SocKvroDkLqurdBuSQQ",
    "width": 1655,
    "height": 1029,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Smart Host Teknoloji TESTNET",
    "symbol": "tSHT",
    "decimals": 18
  },
  "infoURL": "https://smart-host.com.tr",
  "shortName": "sht",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Smart Host Teknoloji TESTNET Explorer",
      "url": "https://s2.tl.web.tr:4000",
      "standard": "EIP3091"
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