import type { Chain } from "../src/types";
export default {
  "chain": "AmChain",
  "chainId": 999999,
  "explorers": [
    {
      "name": "AMCAmChain explorer",
      "url": "https://explorer.amchain.net",
      "standard": "none"
    }
  ],
  "faucets": [],
  "features": [
    {
      "name": "EIP155"
    },
    {
      "name": "EIP1559"
    }
  ],
  "icon": {
    "url": "ipfs://Qmb6VAhhtaJmdaW1j7PAjxaLju1V24PPDFBdXtebyTSfsZ",
    "width": 200,
    "height": 200,
    "format": "png"
  },
  "infoURL": "https://hewe.io/",
  "name": "AmChain",
  "nativeCurrency": {
    "name": "AMC",
    "symbol": "AMC",
    "decimals": 18
  },
  "networkId": 999999,
  "rpc": [
    "https://999999.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://node1.amchain.net"
  ],
  "shortName": "AMC",
  "slug": "amchain",
  "testnet": false,
  "title": "AMC"
} as const satisfies Chain;