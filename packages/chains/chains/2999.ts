import type { Chain } from "../src/types";
export default {
  "chain": "BTY",
  "chainId": 2999,
  "explorers": [
    {
      "name": "BitYuan Block Chain Explorer",
      "url": "https://mainnet.bityuan.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmUmJVof2m5e4HUXb3GmijWUFsLUNhrQiwwQG3CqcXEtHt",
    "width": 91,
    "height": 24,
    "format": "png"
  },
  "infoURL": "https://www.bityuan.com",
  "name": "BitYuan Mainnet",
  "nativeCurrency": {
    "name": "BTY",
    "symbol": "BTY",
    "decimals": 18
  },
  "networkId": 2999,
  "rpc": [
    "https://bityuan.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://2999.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.bityuan.com/eth"
  ],
  "shortName": "bty",
  "slug": "bityuan",
  "testnet": false
} as const satisfies Chain;