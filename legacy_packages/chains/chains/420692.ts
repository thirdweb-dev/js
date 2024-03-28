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
  "networkId": 420692,
  "parent": {
    "type": "L2",
    "chain": "eip155-5",
    "bridges": [
      {
        "url": "https://testnet-bridge.alteriumprotocol.org"
      }
    ]
  },
  "rpc": [
    "https://420692.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://l2-testnet-rpc.altscan.org"
  ],
  "shortName": "alterium",
  "slip44": 1,
  "slug": "alterium-l2-testnet",
  "testnet": true
} as const satisfies Chain;