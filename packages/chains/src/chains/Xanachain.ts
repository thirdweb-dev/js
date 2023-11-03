import type { Chain } from "../types";
export default {
  "chain": "XANAChain",
  "chainId": 8888,
  "explorers": [
    {
      "name": "XANAChain",
      "url": "https://xanachain.xana.net",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmWGNfwJ9o2vmKD3E6fjrxpbFP8W5q45zmYzHHoXwqqAoj",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://xanachain.xana.net/",
  "name": "XANAChain",
  "nativeCurrency": {
    "name": "XETA",
    "symbol": "XETA",
    "decimals": 18
  },
  "networkId": 8888,
  "redFlags": [
    "reusedChainId"
  ],
  "rpc": [
    "https://xanachain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://8888.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://mainnet.xana.net/rpc"
  ],
  "shortName": "XANAChain",
  "slug": "xanachain",
  "testnet": false
} as const satisfies Chain;