import type { Chain } from "../src/types";
export default {
  "name": "PartyChain",
  "chain": "mainnet",
  "rpc": [
    "https://partychain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://tea.mining4people.com/rpc",
    "http://172.104.194.36:8545"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Grams",
    "symbol": "GRAMS",
    "decimals": 18
  },
  "infoURL": "TeaPartyCrypto.com",
  "shortName": "TeaParty",
  "chainId": 1773,
  "networkId": 1773,
  "icon": {
    "url": "ipfs://QmerDBFoXvgev2xx9U71gAaAK4CtxaaQVaAPf9Qi6UF9MS",
    "width": 400,
    "height": 400,
    "format": "jpg"
  },
  "status": "incubating",
  "explorers": [
    {
      "name": "PartyExplorer",
      "url": "https://partyexplorer.co",
      "icon": {
        "url": "ipfs://QmerDBFoXvgev2xx9U71gAaAK4CtxaaQVaAPf9Qi6UF9MS",
        "width": 400,
        "height": 400,
        "format": "jpg"
      },
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "partychain"
} as const satisfies Chain;