import type { Chain } from "../src/types";
export default {
  "chain": "Plinga",
  "chainId": 242,
  "explorers": [
    {
      "name": "plgscan",
      "url": "https://www.plgscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://bafybeibpvlod5nyev6wyuvp6pbestmgvru3ovbadsul32odpno26xwld6y",
    "width": 1039,
    "height": 1022,
    "format": "svg"
  },
  "infoURL": "https://www.plinga.technology/",
  "name": "Plinga Mainnet",
  "nativeCurrency": {
    "name": "Plinga",
    "symbol": "PLINGA",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://plinga.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpcurl.mainnet.plgchain.com",
    "https://rpcurl.plgchain.blockchain.evmnode.online",
    "https://rpcurl.mainnet.plgchain.plinga.technology"
  ],
  "shortName": "plgchain",
  "slug": "plinga",
  "testnet": false
} as const satisfies Chain;