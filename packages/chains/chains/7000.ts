import type { Chain } from "../src/types";
export default {
  "chain": "ZetaChain",
  "chainId": 7000,
  "explorers": [
    {
      "name": "ZetaChain Mainnet Explorer",
      "url": "https://explorer.mainnet.zetachain.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmP4Gnf4Lkp8q5LQVePNjAWxSqrw8vU2JAf7amcFz4vEUy",
    "width": 712,
    "height": 712,
    "format": "png"
  },
  "infoURL": "https://zetachain.com/docs/",
  "name": "ZetaChain Mainnet",
  "nativeCurrency": {
    "name": "Zeta",
    "symbol": "ZETA",
    "decimals": 18
  },
  "networkId": 7000,
  "rpc": [
    "https://zetachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://7000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.mainnet.zetachain.com/evm"
  ],
  "shortName": "zetachain-mainnet",
  "slug": "zetachain",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;