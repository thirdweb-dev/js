import type { Chain } from "../src/types";
export default {
  "chain": "Hela",
  "chainId": 666888,
  "explorers": [
    {
      "name": "Hela Official Runtime Testnet Explorer",
      "url": "https://testnet-blockexplorer.helachain.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://testnet-faucet.helachain.com"
  ],
  "icon": {
    "url": "ipfs://QmQbUVcaxFwY8gqMq1Jeup4NEyivo12QYhbLvVRvgXRBFb",
    "width": 719,
    "height": 216,
    "format": "png"
  },
  "infoURL": "https://helalabs.com",
  "name": "Hela Official Runtime Testnet",
  "nativeCurrency": {
    "name": "Hela HLUSD",
    "symbol": "HLUSD",
    "decimals": 18
  },
  "networkId": 666888,
  "rpc": [
    "https://hela-official-runtime-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://666888.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.helachain.com"
  ],
  "shortName": "hela-testnet",
  "slip44": 1,
  "slug": "hela-official-runtime-testnet",
  "testnet": true
} as const satisfies Chain;