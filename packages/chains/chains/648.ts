import type { Chain } from "../src/types";
export default {
  "chain": "ACE",
  "chainId": 648,
  "explorers": [
    {
      "name": "Endurance Scan",
      "url": "https://explorer.endurance.fusionist.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://ace.fusionist.io/",
  "name": "Endurance Smart Chain Mainnet",
  "nativeCurrency": {
    "name": "Endurance Chain Native Token",
    "symbol": "ACE",
    "decimals": 18
  },
  "networkId": 648,
  "rpc": [
    "https://648.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-endurance.fusionist.io/"
  ],
  "shortName": "ace",
  "slug": "endurance-smart-chain",
  "testnet": false
} as const satisfies Chain;