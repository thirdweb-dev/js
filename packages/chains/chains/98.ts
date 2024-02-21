import type { Chain } from "../src/types";
export default {
  "chain": "SIXNET",
  "chainId": 98,
  "explorers": [
    {
      "name": "SIX Scan",
      "url": "https://sixscan.io/sixnet",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmP93z696v8Hetu13peY2oEHDXq8Bj5CqaDRwpVkpnM15A",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmP93z696v8Hetu13peY2oEHDXq8Bj5CqaDRwpVkpnM15A",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://six.network/",
  "name": "Six Protocol",
  "nativeCurrency": {
    "name": "SIX evm token",
    "symbol": "SIX",
    "decimals": 18
  },
  "networkId": 98,
  "rpc": [
    "https://98.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sixnet-rpc-evm.sixprotocol.net"
  ],
  "shortName": "six",
  "slug": "six-protocol",
  "testnet": false
} as const satisfies Chain;