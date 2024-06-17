import type { Chain } from "../src/types";
export default {
  "chain": "Berachain",
  "chainId": 80084,
  "explorers": [
    {
      "name": "Beratrail",
      "url": "https://bartio.beratrail.io",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://bartio.faucet.berachain.com",
    "https://bartio.faucet.berachain.com/"
  ],
  "features": [],
  "icon": {
    "url": "https://d391b93f5f62d9c15f67142e43841acc.ipfscdn.io/ipfs/QmW2xrDkSqBB7qgftp5PUecEGg4zwUBJgSN45CaR7CKJMr",
    "width": 360,
    "height": 360,
    "format": "png"
  },
  "infoURL": "https://www.berachain.com",
  "name": "Berachain bArtio",
  "nativeCurrency": {
    "name": "BERA",
    "symbol": "BERA",
    "decimals": 18
  },
  "networkId": 80084,
  "redFlags": [],
  "rpc": [
    "https://80084.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://quicknode-rpc.berachain.com",
    "https://bartio.rpc.berachain.com",
    "https://rpc.ankr.com/berachain_testnet",
    "https://bera-testnet.nodeinfra.com"
  ],
  "shortName": "Berachain",
  "slug": "berachain-bartio",
  "testnet": true
} as const satisfies Chain;