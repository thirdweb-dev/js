import type { Chain } from "../src/types";
export default {
  "chainId": 420692,
  "chain": "ALT",
  "name": "Alterium L2 Testnet",
  "rpc": [
    "https://alterium-l2-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://l2-testnet-rpc.altscan.org"
  ],
  "slug": "alterium-l2-testnet",
  "icon": {
    "url": "ipfs://bafkreid3v7ow4c4t3ljya6aouiwvqbtssb2lzmkwt2eghryk234g7yynrq",
    "width": 756,
    "height": 756,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "Alterium ETH",
    "symbol": "AltETH",
    "decimals": 18
  },
  "infoURL": "https://alteriumprotocol.org",
  "shortName": "alterium",
  "testnet": true,
  "redFlags": [],
  "explorers": [
    {
      "name": "Alterium L2 Testnet Explorer",
      "url": "https://l2-testnet.altscan.org",
      "standard": "EIP3091"
    }
  ],
  "features": []
} as const satisfies Chain;