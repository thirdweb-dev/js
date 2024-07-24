import type { Chain } from "../src/types";
export default {
  "chain": "FLOW",
  "chainId": 646,
  "explorers": [
    {
      "name": "Flow Diver",
      "url": "https://previewnet.flowdiver.io",
      "standard": "none"
    },
    {
      "name": "Eth Flow Scan",
      "url": "https://eth.flowscan.io/  ",
      "standard": "EIP3091"
    }
  ],
  "faucets": [
    "https://previewnet-faucet.onflow.org"
  ],
  "features": [],
  "icon": {
    "url": "https://ipfs.filebase.io/ipfs/QmQFugEvsfU3ARjjJ7YRLJwSxMfTk54WWzrofekTRBKFaC",
    "width": 1294,
    "height": 1294,
    "format": "png"
  },
  "infoURL": "https://developers.flow.com/evm/about",
  "name": "EVM on Flow",
  "nativeCurrency": {
    "name": "FLOW",
    "symbol": "FLOW",
    "decimals": 18
  },
  "networkId": 646,
  "redFlags": [],
  "rpc": [
    "https://646.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://previewnet.evm.nodes.onflow.org/",
    "https://previewnet.evm.nodes.onflow.org"
  ],
  "shortName": "FLOW",
  "slug": "evm-on-flow",
  "testnet": true
} as const satisfies Chain;