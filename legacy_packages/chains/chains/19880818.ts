import type { Chain } from "../src/types";
export default {
  "chain": "DeepBrainChain",
  "chainId": 19880818,
  "explorers": [
    {
      "name": "DeepBrainChain Mainnet",
      "url": "https://blockscout.dbcscan.io",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmXxRtZnrvzckKVwbRLpKpP9E9vGgQCUPkLroQDCYTmQdG",
        "width": 416,
        "height": 400,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmXxRtZnrvzckKVwbRLpKpP9E9vGgQCUPkLroQDCYTmQdG",
    "width": 416,
    "height": 400,
    "format": "png"
  },
  "infoURL": "https://www.deepbrainchain.org",
  "name": "DeepBrainChain Mainnet",
  "nativeCurrency": {
    "name": "DeepBrainChain",
    "symbol": "DBC",
    "decimals": 18
  },
  "networkId": 19880818,
  "rpc": [
    "https://19880818.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.dbcwallet.io"
  ],
  "shortName": "DBC",
  "slip44": 1,
  "slug": "deepbrainchain",
  "testnet": false
} as const satisfies Chain;