import type { Chain } from "../src/types";
export default {
  "chain": "IOTA EVM",
  "chainId": 8822,
  "explorers": [
    {
      "name": "explorer",
      "url": "https://explorer.evm.iota.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "infoURL": "https://www.iota.org",
  "name": "IOTA EVM",
  "nativeCurrency": {
    "name": "IOTA",
    "symbol": "IOTA",
    "decimals": 18
  },
  "networkId": 8822,
  "rpc": [
    "https://8822.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://json-rpc.evm.iotaledger.net",
    "https://ws.json-rpc.evm.iotaledger.net"
  ],
  "shortName": "iotaevm",
  "slug": "iota-evm",
  "testnet": false,
  "title": "IOTA EVM"
} as const satisfies Chain;