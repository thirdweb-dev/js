import type { Chain } from "../src/types";
export default {
  "chain": "Altar",
  "chainId": 4444444,
  "explorers": [
    {
      "name": "altar testnet explorer",
      "url": "https://altar-explorer.ceremonies.ai",
      "standard": "none"
    }
  ],
  "faucets": [
    "https://sepoliafaucet.com/"
  ],
  "icon": {
    "url": "ipfs://QmZiJLjciV6KiuxwDebi7CwRhDzei6KKDuStppzsUGtNfN",
    "width": 512,
    "height": 512,
    "format": "png"
  },
  "infoURL": "https://ceremonies.gitbook.io",
  "name": "Altar Testnet",
  "nativeCurrency": {
    "name": "Sepolia Ether",
    "symbol": "ETH",
    "decimals": 18
  },
  "networkId": 4444444,
  "parent": {
    "type": "L2",
    "chain": "eip155-11155111",
    "bridges": [
      {
        "url": "https://altar-testnet-yzxhzk61ck-b7590e4db247a680.testnets.rollbridge.app/"
      }
    ]
  },
  "rpc": [
    "https://4444444.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://altar-rpc.ceremonies.ai/"
  ],
  "shortName": "altarTestnet",
  "slip44": 1,
  "slug": "altar-testnet",
  "testnet": true
} as const satisfies Chain;