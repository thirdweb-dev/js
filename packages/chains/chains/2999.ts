import type { Chain } from "../src/types";
export default {
  "chainId": 2999,
  "chain": "BTY",
  "name": "BitYuan Mainnet",
  "rpc": [
    "https://bityuan.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.bityuan.com/eth"
  ],
  "slug": "bityuan",
  "icon": {
    "url": "ipfs://QmUmJVof2m5e4HUXb3GmijWUFsLUNhrQiwwQG3CqcXEtHt",
    "width": 91,
    "height": 24,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "BTY",
    "symbol": "BTY",
    "decimals": 18
  },
  "infoURL": "https://www.bityuan.com",
  "shortName": "bty",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "BitYuan Block Chain Explorer",
      "url": "https://mainnet.bityuan.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;