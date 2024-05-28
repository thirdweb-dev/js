import type { Chain } from "../src/types";
export default {
  "chain": "Rangers",
  "chainId": 9527,
  "explorers": [
    {
      "name": "rangersscan-robin",
      "url": "https://robin-rangersscan.rangersprotocol.com",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://robin-faucet.rangersprotocol.com"
  ],
  "infoURL": "https://rangersprotocol.com",
  "name": "Rangers Protocol Testnet Robin",
  "nativeCurrency": {
    "name": "Rangers Protocol Gas",
    "symbol": "tRPG",
    "decimals": 18
  },
  "networkId": 9527,
  "rpc": [
    "https://9527.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://robin.rangersprotocol.com/api/jsonrpc"
  ],
  "shortName": "trpg",
  "slip44": 1,
  "slug": "rangers-protocol-testnet-robin",
  "testnet": true
} as const satisfies Chain;