import type { Chain } from "../src/types";
export default {
  "chainId": 242,
  "chain": "Plinga",
  "name": "Plinga Mainnet",
  "rpc": [
    "https://plinga.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpcurl.mainnet.plgchain.com",
    "https://rpcurl.plgchain.blockchain.evmnode.online",
    "https://rpcurl.mainnet.plgchain.plinga.technology"
  ],
  "slug": "plinga",
  "icon": {
    "url": "ipfs://bafybeibpvlod5nyev6wyuvp6pbestmgvru3ovbadsul32odpno26xwld6y",
    "width": 1039,
    "height": 1022,
    "format": "svg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Plinga",
    "symbol": "PLINGA",
    "decimals": 18
  },
  "infoURL": "https://www.plinga.technology/",
  "shortName": "plgchain",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "plgscan",
      "url": "https://www.plgscan.com",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;