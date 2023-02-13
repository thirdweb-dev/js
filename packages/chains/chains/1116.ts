export default {
  "name": "Core Blockchain Mainnet",
  "chain": "Core",
  "icon": {
    "url": "ipfs://QmeTQaBCkpbsxNNWTpoNrMsnwnAEf1wYTcn7CiiZGfUXD2",
    "width": 200,
    "height": 217,
    "format": "png"
  },
  "rpc": [
    "https://core-blockchain.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.coredao.org/"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Core Blockchain Native Token",
    "symbol": "CORE",
    "decimals": 18
  },
  "infoURL": "https://www.coredao.org",
  "shortName": "core",
  "chainId": 1116,
  "networkId": 1116,
  "explorers": [
    {
      "name": "Core Scan",
      "url": "https://scan.coredao.org",
      "icon": "core",
      "standard": "EIP3091"
    }
  ],
  "testnet": false,
  "slug": "core-blockchain"
} as const;