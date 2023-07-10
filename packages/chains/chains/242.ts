import type { Chain } from "../src/types";
export default {
  "name": "Plinga Mainnet",
  "chain": "Plinga",
  "icon": {
    "url": "ipfs://bafybeibpvlod5nyev6wyuvp6pbestmgvru3ovbadsul32odpno26xwld6y",
    "width": 1039,
    "height": 1022,
    "format": "svg"
  },
  "rpc": [
    "https://plinga.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpcurl.mainnet.plgchain.com",
    "https://rpcurl.plgchain.blockchain.evmnode.online",
    "https://rpcurl.mainnet.plgchain.plinga.technology"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Plinga",
    "symbol": "PLINGA",
    "decimals": 18
  },
  "infoURL": "https://www.plinga.technology/",
  "shortName": "plgchain",
  "chainId": 242,
  "networkId": 242,
  "explorers": [
    {
      "name": "plgscan",
      "url": "https://www.plgscan.com",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "plinga"
} as const satisfies Chain;