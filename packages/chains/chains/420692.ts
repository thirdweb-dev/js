import type { Chain } from "../src/types";
export default {
  "name": "Alterium L2 Testnet",
  "chain": "ALT",
  "icon": {
    "url": "ipfs://bafkreid3v7ow4c4t3ljya6aouiwvqbtssb2lzmkwt2eghryk234g7yynrq",
    "width": 756,
    "height": 756,
    "format": "png"
  },
  "rpc": [
    "https://alterium-l2-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://l2-testnet-rpc.altscan.org"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Alterium ETH",
    "symbol": "AltETH",
    "decimals": 18
  },
  "infoURL": "https://alteriumprotocol.org",
  "shortName": "alterium",
  "chainId": 420692,
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
  "explorers": [
    {
      "name": "Alterium L2 Testnet Explorer",
      "url": "https://l2-testnet.altscan.org",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "alterium-l2-testnet"
} as const satisfies Chain;