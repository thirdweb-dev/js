import type { Chain } from "../types";
export default {
  "chain": "ZetaChain",
  "chainId": 7001,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://zetachain-athens-3.blockscout.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    },
    {
      "name": "ZetaChain Athens Testnet Explorer",
      "url": "https://athens3.explorer.zetachain.com",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://labs.zetachain.com/get-zeta"
  ],
  "icon": {
    "url": "ipfs://QmP4Gnf4Lkp8q5LQVePNjAWxSqrw8vU2JAf7amcFz4vEUy",
    "width": 712,
    "height": 712,
    "format": "png"
  },
  "infoURL": "https://zetachain.com/docs",
  "name": "ZetaChain Athens 3 Testnet",
  "nativeCurrency": {
    "name": "Zeta",
    "symbol": "ZETA",
    "decimals": 18
  },
  "networkId": 7001,
  "rpc": [
    "https://zetachain-athens-3-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://7001.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ankr.com/zetachain_evm_athens_testnet"
  ],
  "shortName": "zetachain-athens",
  "slug": "zetachain-athens-3-testnet",
  "status": "active",
  "testnet": true
} as const satisfies Chain;