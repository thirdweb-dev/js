import type { Chain } from "../src/types";
export default {
  "name": "ZetaChain Athens 3 Testnet",
  "chain": "ZetaChain",
  "icon": {
    "url": "ipfs://QmP4Gnf4Lkp8q5LQVePNjAWxSqrw8vU2JAf7amcFz4vEUy",
    "width": 712,
    "height": 712,
    "format": "png"
  },
  "rpc": [
    "https://zetachain-athens-3-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.ankr.com/zetachain_evm_athens_testnet"
  ],
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
  "chainId": 7001,
  "networkId": 7001,
  "status": "active",
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://zetachain-athens-3.blockscout.com",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      },
      "standard": "EIP3091"
    },
    {
      "name": "ZetaChain Athens Testnet Explorer",
      "url": "https://athens3.explorer.zetachain.com",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "zetachain-athens-3-testnet"
} as const satisfies Chain;