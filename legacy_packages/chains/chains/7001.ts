import type { Chain } from "../src/types";
export default {
  "chain": "ZetaChain",
  "chainId": 7001,
  "explorers": [
    {
      "name": "ZetaScan",
      "url": "https://athens.explorer.zetachain.com",
      "standard": "none"
    },
    {
      "name": "Blockscout",
      "url": "https://zetachain-athens-3.blockscout.com",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmYtUimyqHkkFxYdbXXRbUqNg2VLPUg6Uu2C2nmFWowiZM",
        "width": 551,
        "height": 540,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://www.zetachain.com/docs/reference/apps/get-testnet-zeta/"
  ],
  "icon": {
    "url": "ipfs://QmP4Gnf4Lkp8q5LQVePNjAWxSqrw8vU2JAf7amcFz4vEUy",
    "width": 712,
    "height": 712,
    "format": "png"
  },
  "infoURL": "https://zetachain.com/docs",
  "name": "ZetaChain Testnet",
  "nativeCurrency": {
    "name": "Zeta",
    "symbol": "ZETA",
    "decimals": 18
  },
  "networkId": 7001,
  "rpc": [
    "https://7001.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://zetachain-athens-evm.blockpi.network/v1/rpc/public",
    "https://zetachain-testnet.public.blastapi.io",
    "https://zetachain-athens.g.allthatnode.com/archive/evm",
    "https://zeta-chain-testnet.drpc.org"
  ],
  "shortName": "zetachain-testnet",
  "slip44": 1,
  "slug": "zetachain-testnet",
  "status": "active",
  "testnet": true
} as const satisfies Chain;