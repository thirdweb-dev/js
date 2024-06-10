import type { Chain } from "../src/types";
export default {
  "chain": "dchainmainnet",
  "chainId": 2716446429837000,
  "explorers": [
    {
      "name": "dchain scan",
      "url": "https://dchain-2716446429837000-1.sagaexplorer.io",
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
    "url": "ipfs://QmamkxtxT1uFWQGxswmzBRkoTcZuU5biM1QvdsU6SD36K6",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://www.dchain.foundation/",
  "name": "DCHAIN",
  "nativeCurrency": {
    "name": "Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 2716446429837000,
  "rpc": [
    "https://2716446429837000.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://dchain-2716446429837000-1.jsonrpc.sagarpc.io"
  ],
  "shortName": "dchainmainnet",
  "slug": "dchain",
  "testnet": false,
  "title": "DCHAIN Mainnet"
} as const satisfies Chain;