import type { Chain } from "../src/types";
export default {
  "chainId": 314,
  "chain": "FIL",
  "name": "Filecoin - Mainnet",
  "rpc": [
    "https://filecoin.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.node.glif.io/",
    "https://rpc.ankr.com/filecoin",
    "https://filecoin-mainnet.chainstacklabs.com/rpc/v1",
    "https://filfox.info/rpc/v1"
  ],
  "slug": "filecoin",
  "icon": {
    "url": "ipfs://QmS9r9XQkMHVomWcSBNDkKkz9n87h9bH9ssabeiKZtANoU",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "faucets": [],
  "nativeCurrency": {
    "name": "filecoin",
    "symbol": "FIL",
    "decimals": 18
  },
  "infoURL": "https://filecoin.io",
  "shortName": "filecoin",
  "testnet": false,
  "redFlags": [],
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
  "features": []
} as const satisfies Chain;