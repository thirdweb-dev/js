export default {
  "name": "Filecoin - Hyperspace testnet",
  "chain": "FIL",
  "icon": {
    "url": "ipfs://QmS9r9XQkMHVomWcSBNDkKkz9n87h9bH9ssabeiKZtANoU",
    "width": 1000,
    "height": 1000,
    "format": "png"
  },
  "rpc": [
    "https://filecoin-hyperspace-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://api.hyperspace.node.glif.io/rpc/v1",
    "https://rpc.ankr.com/filecoin_testnet",
    "https://filecoin-hyperspace.chainstacklabs.com/rpc/v1"
  ],
  "faucets": [
    "https://hyperspace.yoga/#faucet"
  ],
  "nativeCurrency": {
    "name": "testnet filecoin",
    "symbol": "tFIL",
    "decimals": 18
  },
  "infoURL": "https://filecoin.io",
  "shortName": "filecoin-hyperspace",
  "chainId": 3141,
  "networkId": 3141,
  "slip44": 1,
  "explorers": [
    {
      "name": "Filfox - Hyperspace",
      "url": "https://hyperspace.filfox.info/en",
      "standard": "none"
    },
    {
      "name": "Glif Explorer - Hyperspace",
      "url": "https://explorer.glif.io/?network=hyperspace",
      "standard": "none"
    },
    {
      "name": "Beryx",
      "url": "https://beryx.zondax.ch",
      "standard": "none"
    },
    {
      "name": "Filmine",
      "url": "https://explorer.filmine.io",
      "standard": "none"
    },
    {
      "name": "Filscan - Hyperspace",
      "url": "https://hyperspace.filscan.io",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "filecoin-hyperspace-testnet"
} as const;