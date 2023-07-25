import type { Chain } from "../src/types";
export default {
  "name": "Bitnet",
  "chain": "BTN",
  "rpc": [
    "https://bitnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.bitnet.money"
  ],
  "faucets": [
    "https://bitnet.money/forum/showthread.php?tid=2"
  ],
  "nativeCurrency": {
    "name": "Bitnet",
    "symbol": "BTN",
    "decimals": 18
  },
  "infoURL": "https://bitnet.money",
  "shortName": "BTN",
  "chainId": 210,
  "networkId": 210,
  "explorers": [
    {
      "name": "Bitnet Explorer",
      "url": "https://btnscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "bitnet"
} as const satisfies Chain;