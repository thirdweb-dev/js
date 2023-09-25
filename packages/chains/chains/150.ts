import type { Chain } from "../src/types";
export default {
  "chainId": 150,
  "chain": "FIVENET",
  "name": "Six Protocol Testnet",
  "rpc": [
    "https://six-protocol-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc-evm.fivenet.sixprotocol.net"
  ],
  "slug": "six-protocol-testnet",
  "icon": {
    "url": "ipfs://QmP93z696v8Hetu13peY2oEHDXq8Bj5CqaDRwpVkpnM15A",
    "width": 512,
    "height": 512,
    "format": "png"
  },
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
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "SIX Scan fivenet",
      "url": "https://sixscan.io/fivenet",
      "standard": "none"
    }
  ],
  "features": []
} as const satisfies Chain;