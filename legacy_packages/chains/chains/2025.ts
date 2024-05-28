import type { Chain } from "../src/types";
export default {
  "chain": "Rangers",
  "chainId": 2025,
  "explorers": [
    {
      "name": "rangersscan",
      "url": "https://scan.rangersprotocol.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://rangersprotocol.com",
  "name": "Rangers Protocol Mainnet",
  "nativeCurrency": {
    "name": "Rangers Protocol Gas",
    "symbol": "RPG",
    "decimals": 18
  },
  "networkId": 2025,
  "rpc": [
    "https://2025.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.rangersprotocol.com/api/jsonrpc"
  ],
  "shortName": "rpg",
  "slip44": 1008,
  "slug": "rangers-protocol",
  "testnet": false
} as const satisfies Chain;