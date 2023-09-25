import type { Chain } from "../src/types";
export default {
  "chainId": 8888,
  "chain": "XANAChain",
  "name": "XANAChain",
  "rpc": [
    "https://xanachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.xana.net/rpc"
  ],
  "slug": "xanachain",
  "icon": {
    "url": "ipfs://QmWGNfwJ9o2vmKD3E6fjrxpbFP8W5q45zmYzHHoXwqqAoj",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "XETA",
    "symbol": "XETA",
    "decimals": 18
  },
  "infoURL": "https://xanachain.xana.net/",
  "shortName": "XANAChain",
  "testnet": false,
  "redFlags": [
    "reusedChainId"
  ],
  "explorers": [
    {
      "name": "XANAChain",
      "url": "https://xanachain.xana.net",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;