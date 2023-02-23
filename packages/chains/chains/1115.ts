export default {
  "name": "Core Blockchain Testnet",
  "chain": "Core",
  "icon": {
    "url": "ipfs://QmeTQaBCkpbsxNNWTpoNrMsnwnAEf1wYTcn7CiiZGfUXD2",
    "width": 200,
    "height": 217,
    "format": "png"
  },
  "rpc": [
    "https://core-blockchain-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.test.btcs.network/"
  ],
  "faucets": [
    "https://scan.test.btcs.network/faucet"
  ],
  "nativeCurrency": {
    "name": "Core Blockchain Testnet Native Token",
    "symbol": "tCORE",
    "decimals": 18
  },
  "infoURL": "https://www.coredao.org",
  "shortName": "tcore",
  "chainId": 1115,
  "networkId": 1115,
  "explorers": [
    {
      "name": "Core Scan Testnet",
      "url": "https://scan.test.btcs.network",
      "icon": "core",
      "standard": "EIP3091"
    }
  ],
  "testnet": true,
  "slug": "core-blockchain-testnet"
} as const;