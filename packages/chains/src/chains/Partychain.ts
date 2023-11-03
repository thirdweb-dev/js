import type { Chain } from "../types";
export default {
  "chain": "mainnet",
  "chainId": 1773,
  "explorers": [
    {
      "name": "PartyExplorer",
      "url": "https://partyexplorer.co",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmerDBFoXvgev2xx9U71gAaAK4CtxaaQVaAPf9Qi6UF9MS",
        "width": 400,
        "height": 400,
        "format": "jpg"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmerDBFoXvgev2xx9U71gAaAK4CtxaaQVaAPf9Qi6UF9MS",
    "width": 400,
    "height": 400,
    "format": "jpg"
  },
  "name": "PartyChain",
  "nativeCurrency": {
    "name": "Grams",
    "symbol": "GRAMS",
    "decimals": 18
  },
  "networkId": 1773,
  "rpc": [
    "https://partychain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://1773.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://tea.mining4people.com/rpc",
    "http://172.104.194.36:8545"
  ],
  "shortName": "TeaParty",
  "slug": "partychain",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;