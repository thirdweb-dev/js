import type { Chain } from "../src/types";
export default {
  "chainId": 7001,
  "chain": "ZetaChain",
  "name": "ZetaChain Athens 3 Testnet",
  "rpc": [
    "https://zetachain-athens-3-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ankr.com/zetachain_evm_athens_testnet"
  ],
  "slug": "zetachain-athens-3-testnet",
  "icon": {
    "url": "ipfs://QmP4Gnf4Lkp8q5LQVePNjAWxSqrw8vU2JAf7amcFz4vEUy",
    "width": 712,
    "height": 712,
    "format": "png"
  },
  "faucets": [
    "https://labs.zetachain.com/get-zeta"
  ],
  "nativeCurrency": {
    "name": "Zeta",
    "symbol": "aZETA",
    "decimals": 18
  },
  "infoURL": "https://zetachain.com/docs",
  "shortName": "zetachain-athens",
  "testnet": true,
  "status": "active",
  "redFlags": [],
  "explorers": [
    {
      "name": "ZetaChain Athens Testnet Explorer",
      "url": "https://athens3.explorer.zetachain.com",
      "standard": "none"
    },
    {
      "name": "blockscout",
      "url": "https://zetachain-athens-3.blockscout.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;