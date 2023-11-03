import type { Chain } from "../types";
export default {
  "chain": "FIVENET",
  "chainId": 150,
  "explorers": [
    {
      "name": "SIX Scan fivenet",
      "url": "https://sixscan.io/fivenet",
      "standard": "none",
      "icon": {
        "url": "ipfs://QmP93z696v8Hetu13peY2oEHDXq8Bj5CqaDRwpVkpnM15A",
        "width": 512,
        "height": 512,
        "format": "png"
      }
    }
  ],
  "faucets": [
    "https://faucet.sixprotocol.net"
  ],
  "icon": {
    "url": "ipfs://QmP93z696v8Hetu13peY2oEHDXq8Bj5CqaDRwpVkpnM15A",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://six.network/",
  "name": "Six Protocol Testnet",
  "nativeCurrency": {
    "name": "SIX testnet evm token",
    "symbol": "tSIX",
    "decimals": 18
  },
  "networkId": 150,
  "rpc": [
    "https://six-protocol-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://150.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-evm.fivenet.sixprotocol.net"
  ],
  "shortName": "sixt",
  "slug": "six-protocol-testnet",
  "testnet": true
} as const satisfies Chain;