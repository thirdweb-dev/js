import type { Chain } from "../src/types";
export default {
  "chainId": 1773,
  "chain": "mainnet",
  "name": "PartyChain",
  "rpc": [
    "https://partychain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://tea.mining4people.com/rpc",
    "http://172.104.194.36:8545"
  ],
  "slug": "partychain",
  "icon": {
    "url": "ipfs://QmerDBFoXvgev2xx9U71gAaAK4CtxaaQVaAPf9Qi6UF9MS",
    "width": 400,
    "height": 400,
    "format": "jpg"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Grams",
    "symbol": "GRAMS",
    "decimals": 18
  },
  "infoURL": null,
  "shortName": "TeaParty",
  "testnet": false,
  "status": "incubating",
  "redFlags": [],
  "explorers": [
    {
      "name": "PartyExplorer",
      "url": "https://partyexplorer.co",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;