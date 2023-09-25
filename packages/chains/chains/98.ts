import type { Chain } from "../src/types";
export default {
  "chainId": 98,
  "chain": "SIXNET",
  "name": "Six Protocol",
  "rpc": [
    "https://six-protocol.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://sixnet-rpc-evm.sixprotocol.net"
  ],
  "slug": "six-protocol",
  "icon": {
    "url": "ipfs://QmP93z696v8Hetu13peY2oEHDXq8Bj5CqaDRwpVkpnM15A",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "SIX evm token",
    "symbol": "SIX",
    "decimals": 18
  },
  "infoURL": "https://six.network/",
  "shortName": "six",
  "testnet": false,
  "redFlags": [],
  "explorers": [
    {
      "name": "SIX Scan",
      "url": "https://sixscan.io/sixnet",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;