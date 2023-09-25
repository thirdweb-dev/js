import type { Chain } from "../src/types";
export default {
  "chainId": 7000,
  "chain": "ZetaChain",
  "name": "ZetaChain Mainnet",
  "rpc": [
    "https://zetachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.mainnet.zetachain.com/evm"
  ],
  "slug": "zetachain",
  "icon": {
    "url": "ipfs://QmP4Gnf4Lkp8q5LQVePNjAWxSqrw8vU2JAf7amcFz4vEUy",
    "width": 712,
    "height": 712,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Zeta",
    "symbol": "aZETA",
    "decimals": 18
  },
  "infoURL": "https://zetachain.com/docs/",
  "shortName": "zetachain-mainnet",
  "testnet": false,
  "status": "incubating",
  "redFlags": [],
  "explorers": [
    {
      "name": "ZetaChain Mainnet Explorer",
      "url": "https://explorer.mainnet.zetachain.com",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;