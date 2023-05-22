import type { Chain } from "../src/types";
export default {
  "name": "Six Protocol Testnet",
  "chain": "FIVENET",
  "icon": {
    "url": "ipfs://QmP93z696v8Hetu13peY2oEHDXq8Bj5CqaDRwpVkpnM15A",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "rpc": [
    "https://six-protocol-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-evm.fivenet.sixprotocol.net"
  ],
  "faucets": [
    "https://faucet.sixprotocol.net"
  ],
  "nativeCurrency": {
    "name": "SIX testnet evm token",
    "symbol": "tSIX",
    "decimals": 18
  },
  "infoURL": "https://six.network/",
  "shortName": "sixt",
  "chainId": 150,
  "networkId": 150,
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
  "testnet": true,
  "slug": "six-protocol-testnet"
} as const satisfies Chain;