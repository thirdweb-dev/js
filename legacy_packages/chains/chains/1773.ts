import type { Chain } from "../src/types";
export default {
  "chain": "mainnet",
  "chainId": 1773,
  "explorers": [
    {
      "name": "PartyExplorer",
      "url": "https://partyexplorer.co",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "name": "PartyChain",
  "nativeCurrency": {
    "name": "Grams",
    "symbol": "GRAMS",
    "decimals": 18
  },
  "networkId": 1773,
  "rpc": [
    "https://1773.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://tea.mining4people.com/rpc",
    "http://172.104.194.36:8545"
  ],
  "shortName": "TeaParty",
  "slug": "partychain",
  "status": "incubating",
  "testnet": false
} as const satisfies Chain;