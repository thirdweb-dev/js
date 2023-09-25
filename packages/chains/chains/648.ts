import type { Chain } from "../src/types";
export default {
  "chainId": 648,
  "chain": "ACE",
  "name": "Endurance Smart Chain Mainnet",
  "rpc": [
    "https://endurance-smart-chain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-endurance.fusionist.io/"
  ],
  "slug": "endurance-smart-chain",
  "faucets": [],
  "nativeCurrency": {
    "name": "Endurance Chain Native Token",
    "symbol": "ACE",
    "decimals": 18
  },
  "infoURL": "https://ace.fusionist.io/",
  "shortName": "ace",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "Endurance Scan",
      "url": "https://explorer.endurance.fusionist.io",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;