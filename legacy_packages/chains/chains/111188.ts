import type { Chain } from "../src/types";
export default {
  "chain": "re.al",
  "chainId": 111188,
  "explorers": [
    {
      "name": "blockscout",
      "url": "https://explorer.re.al",
      "standard": "EIP3091",
      "icon": {
        "url": "ipfs://QmNUmWC7jNEBcTs6ZqkrQ5vMAQG8qjq7n3FcZnXvJZLoQ9",
        "width": 301,
        "height": 302,
        "format": "png"
      }
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmNUmWC7jNEBcTs6ZqkrQ5vMAQG8qjq7n3FcZnXvJZLoQ9",
    "width": 301,
    "height": 302,
    "format": "png"
  },
  "infoURL": "https://re.al",
  "name": "re.al",
  "nativeCurrency": {
    "name": "re.al Ether",
    "symbol": "reETH",
    "decimals": 18
  },
  "networkId": 111188,
  "parent": {
    "type": "L2",
    "chain": "eip155-1",
    "bridges": [
      {
        "url": "https://re.al/bridge"
      },
      {
        "url": "https://bridge.gelato.network/bridge/real"
      }
    ]
  },
  "rpc": [
    "https://111188.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://real.drpc.org",
    "wss://real.drpc.org"
  ],
  "shortName": "re-al",
  "slip44": 60,
  "slug": "re-al",
  "testnet": false,
  "title": "re.al Real-World Assets network"
} as const satisfies Chain;