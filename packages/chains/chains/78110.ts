export default {
  "name": "Firenze test network",
  "chain": "ETH",
  "rpc": [
    "https://firenze-test-network.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://ethnode.primusmoney.com/firenze"
  ],
  "faucets": [],
  "nativeCurrency": {
    "name": "Firenze Ether",
    "symbol": "FIN",
    "decimals": 18
  },
  "infoURL": "https://primusmoney.com",
  "shortName": "firenze",
  "chainId": 78110,
  "networkId": 78110,
  "testnet": true,
  "slug": "firenze-test-network"
} as const;