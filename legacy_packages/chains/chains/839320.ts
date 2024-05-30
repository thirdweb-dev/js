import type { Chain } from "../src/types";
export default {
  "chain": "prm",
  "chainId": 839320,
  "explorers": [
    {
      "name": "Primal Network Testnet",
      "url": "https://testnet-explorer.prmscan.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://faucet.prmscan.org"
  ],
  "icon": {
    "url": "ipfs://QmckkDRkuCQWbvhpKGsqa8ajuQvf3W5dekzw5qpiPC6shk",
    "width": 1220,
    "height": 1220,
    "format": "png"
  },
  "infoURL": "https://primalnetwork.org",
  "name": "PRM Testnet",
  "nativeCurrency": {
    "name": "Primal Network",
    "symbol": "PRM",
    "decimals": 18
  },
  "networkId": 839320,
  "rpc": [
    "https://839320.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://testnet-rpc.prmscan.org"
  ],
  "shortName": "prmtest",
  "slug": "prm-testnet",
  "testnet": true
} as const satisfies Chain;