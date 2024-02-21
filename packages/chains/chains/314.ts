import type { Chain } from "../src/types";
export default {
  "chain": "FIL",
  "chainId": 314,
  "explorers": [
    {
      "name": "Filfox",
      "url": "https://filfox.info/en",
      "standard": "none"
    },
    {
      "name": "Beryx",
      "url": "https://beryx.zondax.ch",
      "standard": "none"
    },
    {
      "name": "Glif Explorer",
      "url": "https://explorer.glif.io",
      "standard": "EIP3091"
    },
    {
      "name": "Dev.storage",
      "url": "https://dev.storage",
      "standard": "none"
    },
    {
      "name": "Filscan",
      "url": "https://filscan.io",
      "standard": "none"
    },
    {
      "name": "Filscout",
      "url": "https://filscout.io/en",
      "standard": "none"
    }
  ],
  "faucets": [],
  "icon": {
    "url": "ipfs://QmS9r9XQkMHVomWcSBNDkKkz9n87h9bH9ssabeiKZtANoU",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "infoURL": "https://filecoin.io",
  "name": "Filecoin - Mainnet",
  "nativeCurrency": {
    "name": "filecoin",
    "symbol": "FIL",
    "decimals": 18
  },
  "networkId": 314,
  "rpc": [
    "https://314.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.node.glif.io/",
    "https://rpc.ankr.com/filecoin",
    "https://filecoin-mainnet.chainstacklabs.com/rpc/v1",
    "https://filfox.info/rpc/v1"
  ],
  "shortName": "filecoin",
  "slip44": 461,
  "slug": "filecoin",
  "testnet": false
} as const satisfies Chain;