export default {
  "name": "Beverly Hills",
  "title": "Ethereum multi-client Verkle Testnet Beverly Hills",
  "chain": "ETH",
  "rpc": [
    "https://beverly-hills.rpc.thirdweb.com/${THIRDWEB_API_KEY}",
    "https://rpc.beverlyhills.ethdevops.io:8545"
  ],
  "faucets": [
    "https://faucet.beverlyhills.ethdevops.io"
  ],
  "nativeCurrency": {
    "name": "Beverly Hills Testnet Ether",
    "symbol": "BVE",
    "decimals": 18
  },
  "infoURL": "https://beverlyhills.ethdevops.io",
  "shortName": "bvhl",
  "chainId": 90210,
  "networkId": 90210,
  "status": "incubating",
  "explorers": [
    {
      "name": "Beverly Hills explorer",
      "url": "https://explorer.beverlyhills.ethdevops.io",
      "standard": "none"
    }
  ],
  "testnet": true,
  "slug": "beverly-hills"
} as const;