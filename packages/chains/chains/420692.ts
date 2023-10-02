import type { Chain } from "../src/types";
export default {
  "chain": "ALT",
  "chainId": 420692,
  "explorers": [
    {
      "name": "Alterium L2 Testnet Explorer",
      "url": "https://l2-testnet.altscan.org",
      "standard": "EIP3091"
    }
  ],
  "faucets": [],
  "features": [],
  "icon": {
    "url": "ipfs://bafkreid3v7ow4c4t3ljya6aouiwvqbtssb2lzmkwt2eghryk234g7yynrq",
    "width": 756,
    "height": 756,
    "format": "png"
  },
  "infoURL": "https://alteriumprotocol.org",
  "name": "Alterium L2 Testnet",
  "nativeCurrency": {
    "name": "Alterium ETH",
    "symbol": "AltETH",
    "decimals": 18
  },
  "redFlags": [],
  "rpc": [
    "https://alterium-l2-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://l2-testnet-rpc.altscan.org"
  ],
  "shortName": "alterium",
  "slug": "alterium-l2-testnet",
  "testnet": true
} as const satisfies Chain;