export default {
  "name": "Gear Zero Network Testnet",
  "chain": "GearZero",
  "rpc": [
    "https://gear-zero-network-testnet.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://gzn-test.linksme.info"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Gear Zero Network Native Token",
    "symbol": "GZN",
    "decimals": 18
  },
  "infoURL": "https://token.gearzero.ca/testnet",
  "shortName": "gz-testnet",
  "chainId": 266256,
  "networkId": 266256,
  "slip44": 266256,
  "explorers": [],
  "testnet": true,
  "slug": "gear-zero-network-testnet"
} as const;