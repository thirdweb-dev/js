import type { Chain } from "../src/types";
export default {
  "name": "ZetaChain Mainnet",
  "chain": "ZetaChain",
  "icon": {
    "url": "ipfs://QmP4Gnf4Lkp8q5LQVePNjAWxSqrw8vU2JAf7amcFz4vEUy",
    "width": 712,
    "height": 712,
    "format": "png"
  },
  "rpc": [
    "https://zetachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.mainnet.zetachain.com/evm"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Zeta",
    "symbol": "ZETA",
    "decimals": 18
  },
  "infoURL": "https://zetachain.com/docs/",
  "shortName": "zetachain-mainnet",
  "chainId": 7000,
  "networkId": 7000,
  "status": "incubating",
  "explorers": [
    {
      "name": "ZetaChain Mainnet Explorer",
      "url": "https://explorer.mainnet.zetachain.com",
      "standard": "none"
    }
  ],
  "testnet": false,
  "slug": "zetachain"
} as const satisfies Chain;