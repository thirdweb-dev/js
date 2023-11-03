import type { Chain } from "../types";
export default {
  "chain": "Hela",
  "chainId": 8668,
  "explorers": [
    {
      "name": "Hela Official Runtime Mainnet Explorer",
      "url": "https://mainnet-blockexplorer.helachain.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmQbUVcaxFwY8gqMq1Jeup4NEyivo12QYhbLvVRvgXRBFb",
    "width": 719,
    "height": 216,
    "format": "png"
  },
  "infoURL": "https://helalabs.com",
  "name": "Hela Official Runtime Mainnet",
  "nativeCurrency": {
    "name": "Hela HLUSD",
    "symbol": "HLUSD",
    "decimals": 18
  },
  "networkId": 8668,
  "rpc": [
    "https://hela-official-runtime.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://8668.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet-rpc.helachain.com"
  ],
  "shortName": "hela",
  "slug": "hela-official-runtime",
  "testnet": false
} as const satisfies Chain;