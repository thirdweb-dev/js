import type { Chain } from "../src/types";
export default {
  "chain": "dchaint",
  "chainId": 2713017997578000,
  "explorers": [
    {
      "name": "dchaint scan",
      "url": "https://dchaintestnet-2713017997578000-1.testnet.sagaexplorer.io",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://QmP2cDWvgMuPgwAAEX9KexowUEjw6q7zCUSsWcb8HdudUH",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://www.dchain.foundation/",
  "name": "DCHAIN Testnet",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 2713017997578000,
  "rpc": [
    "https://2713017997578000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dchaintestnet-2713017997578000-1.jsonrpc.testnet.sagarpc.io"
  ],
  "shortName": "dchaint",
  "slug": "dchain-testnet",
  "testnet": true,
  "title": "DCHAIN Testnet"
} as const satisfies Chain;