import type { Chain } from "../src/types";
export default {
  "chain": "Bitlayer",
  "chainId": 200901,
  "explorers": [
    {
      "name": "bitlayer mainnet scan",
      "url": "https://www.btrscan.com",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmdWZ1frB47fr3tw31xE68C2Vocaw5Ef53LQ5WDNdNnNyG",
    "width": 4500,
    "height": 4500,
    "format": "jpg"
  },
  "infoURL": "https://docs.bitlayer.org/",
  "name": "Bitlayer Mainnet",
  "nativeCurrency": {
    "name": "BTC",
    "symbol": "BTC",
    "decimals": 18
  },
  "networkId": 200901,
  "rpc": [
    "https://200901.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.bitlayer.org",
    "https://rpc.bitlayer-rpc.com",
    "https://rpc.ankr.com/bitlayer",
    "https://rpc-bitlayer.rockx.com",
    "wss://ws.bitlayer.org",
    "wss://ws.bitlayer-rpc.com"
  ],
  "shortName": "btr",
  "slip44": 1,
  "slug": "bitlayer",
  "testnet": false
} as const satisfies Chain;