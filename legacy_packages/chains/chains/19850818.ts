import type { Chain } from "../src/types";
export default {
  "chain": "DeepBrainChain",
  "chainId": 19850818,
  "explorers": [
    {
      "name": "DeepBrainChain Testnet",
      "url": "https://blockscout-testnet.dbcscan.io",
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
  "name": "DeepBrainChain Testnet",
  "nativeCurrency": {
    "name": "DeepBrainChain",
    "symbol": "DBC",
    "decimals": 18
  },
  "networkId": 19850818,
  "rpc": [
    "https://19850818.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-testnet.dbcwallet.io"
  ],
  "shortName": "tDBC",
  "slip44": 1,
  "slug": "deepbrainchain-testnet",
  "testnet": true
} as const satisfies Chain;