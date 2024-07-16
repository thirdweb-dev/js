import type { Chain } from "../src/types";
export default {
  "chain": "ETH",
  "chainId": 59902,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://sepolia-explorer.metisdevops.link",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://sepolia.faucet.metisdevops.link"
  ],
  "infoURL": "https://www.metis.io",
  "name": "Metis Sepolia Testnet",
  "nativeCurrency": {
    "name": "tMetis",
    "symbol": "tMETIS",
    "decimals": 18
  },
  "networkId": 59902,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://bridge.metis.io"
      }
    ]
  },
  "rpc": [
    "https://59902.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sepolia.metisdevops.link"
  ],
  "shortName": "metis-sepolia",
  "slug": "metis-sepolia-testnet",
  "testnet": true
} as const satisfies Chain;