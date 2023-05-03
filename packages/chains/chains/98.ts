import type { Chain } from "../src/types";
export default {
  "name": "Six Protocol",
  "chain": "SIXNET",
  "icon": {
    "url": "ipfs://QmP93z696v8Hetu13peY2oEHDXq8Bj5CqaDRwpVkpnM15A",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "rpc": [
    "https://six-protocol.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sixnet-rpc-evm.sixprotocol.net"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "SIX evm token",
    "symbol": "SIX",
    "decimals": 18
  },
  "infoURL": "https://six.network/",
  "shortName": "six",
  "chainId": 98,
  "networkId": 98,
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
  "testnet": false,
  "slug": "six-protocol"
} as const satisfies Chain;