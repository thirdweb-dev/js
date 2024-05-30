import type { Chain } from "../src/types";
export default {
  "chain": "Rangers",
  "chainId": 38400,
  "explorers": [
    {
      "name": "rangersscan",
      "url": "https://scan.rangersprotocol.com",
      "standard": "none"
    }
  ],
  "faucets": [],
  "infoURL": "https://rangersprotocol.com",
  "name": "ConnectorManager",
  "nativeCurrency": {
    "name": "Rangers Protocol Gas",
    "symbol": "cmRPG",
    "decimals": 18
  },
  "networkId": 38400,
  "rpc": [
    "https://38400.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://cm.rangersprotocol.com/api/jsonrpc"
  ],
  "shortName": "cmrpg",
  "slug": "connectormanager",
  "testnet": false
} as const satisfies Chain;