import type { Chain } from "../src/types";
export default {
  "chain": "Lyra",
  "chainId": 957,
  "explorers": [
    {
      "name": "Lyra Explorer",
      "url": "https://explorer.lyra.finance",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://bafkreifrvwcwcgs2luampufdbdgohuxue5rep3u4p4owmwskob7hzpcfdq",
        "width": 2640,
        "height": 2640,
        "format": "png"
      }
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
    "url": "ipfs://bafkreifrvwcwcgs2luampufdbdgohuxue5rep3u4p4owmwskob7hzpcfdq",
    "width": 2640,
    "height": 2640,
    "format": "png"
  },
  "infoURL": "https://lyra.finance",
  "name": "Lyra Chain",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 957,
  "rpc": [
    "https://lyra-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://957.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.lyra.finance"
  ],
  "shortName": "lyra",
  "slug": "lyra-chain",
  "testnet": false
} as const satisfies Chain;